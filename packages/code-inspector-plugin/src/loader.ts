import * as t from '@babel/types'
import * as parser from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import generate from '@babel/generator'
import path from 'path'
import fs from 'fs'
import { formatPath } from './utils'

const SelectorClassName = 'CodeInspectorSelector'

const genRelativePath = (absolutePath: string) => {
  const relativePath = path.relative(process.cwd(), absolutePath)
  return formatPath(relativePath)
}

const matchFunctionName = (funcName: string) => {
  return /^use([A-Z][a-z]+)+$/.test(funcName)
}

const matchFilePath = (filePath: string) => {
  return /\/use(-[a-z]+)+(\/index)?\.ts/.test(filePath)
}

const genIIFEAst = (server: string): t.Statement => {
  const selector = fs.readFileSync(path.resolve(__dirname, 'selector.js'), {
    encoding: 'utf-8',
  })
  const content = /* js */ `
    (function () {
      if (!window["${SelectorClassName}"]) {
        ${selector}
        new window["${SelectorClassName}"]("${server}")
      }
    })()
  `
  const ast = parser.parse(content)
  return ast.program.body[0]
}

const replaceUseProperty = (
  properties: t.ObjectProperty[],
  filePath: string,
  server: string
) => {
  const idx = properties.findIndex(
    (property) => (property.key as any).name === 'use'
  )
  if (idx < 0) {
    return
  }

  const use = properties[idx]
  const newProperty = t.objectProperty(
    t.identifier('use'),
    t.functionExpression(
      null,
      [t.restElement(t.identifier('args'))],
      t.blockStatement([
        genIIFEAst(server),
        t.returnStatement(
          t.callExpression(
            t.memberExpression(t.identifier('Object'), t.identifier('assign')),
            [
              t.callExpression(t.identifier((use.value as any).name), [
                t.spreadElement(t.identifier('args')),
              ]),
              t.objectExpression([
                t.objectProperty(
                  t.identifier('__file'),
                  t.stringLiteral(filePath)
                ),
              ]),
            ]
          )
        ),
      ])
    )
  )
  properties.splice(idx, 1)
  properties.push(newProperty)
}

const replaceUseFn = (body: t.BlockStatement, filePath: string) => {
  const newBody = t.blockStatement([
    t.returnStatement(
      t.callExpression(
        t.memberExpression(t.identifier('Object'), t.identifier('assign')),
        [
          t.callExpression(t.functionExpression(null, [], body), []),
          t.objectExpression([
            t.objectProperty(t.identifier('__file'), t.stringLiteral(filePath)),
          ]),
        ]
      )
    ),
  ])
  return newBody
}

/**
 * 满足下方所有条件，才对当前函数的返回值注入 `__file` 属性
 * 1. 父节点类型为 `ExportDefaultDeclaration`
 * 2. 函数体内的最外层有 `return` 语句，不包括 `if` 语句包裹的 `return` 语句
 * 3. 文件路径以 `use-xxx-xxx.ts` 或 `use-xxx-xxx/index.ts` 结尾
 * @param path
 * @param filePath
 * @returns
 */
const matchFunctionDeclaration = (
  path: NodePath<t.FunctionDeclaration>,
  filePath: string
) => {
  return (
    t.isExportDefaultDeclaration(path.parent) &&
    path.node.body.body.some((node) => t.isReturnStatement(node)) &&
    matchFilePath(filePath)
  )
}

export default function (
  this: any,
  content: string,
  sourceMap: any,
  meta: any
) {
  const { server } = this.query
  const relativePath = genRelativePath(this.resourcePath)
  const ast = parser.parse(content, {
    plugins: ['jsx', 'typescript'],
    sourceType: 'module',
  })

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration
      if (
        t.isCallExpression(declaration) &&
        (declaration.callee as any).name === 'createComposable'
      ) {
        if (t.isObjectExpression(declaration.arguments[0])) {
          const properties = declaration.arguments[0]
            .properties as t.ObjectProperty[]
          replaceUseProperty(properties, relativePath, server)
        }
      }
    },
    FunctionDeclaration(path) {
      const node = path.node
      if (!matchFunctionDeclaration(path, relativePath)) {
        return
      }

      node.body = replaceUseFn(node.body, relativePath)
    },
  })
  const newContent = generate(ast).code
  this.callback(null, newContent, sourceMap, meta)
}
