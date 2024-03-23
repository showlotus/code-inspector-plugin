import * as t from '@babel/types'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
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

const genIIFEAst = (server: string): t.Statement => {
  const selector = fs.readFileSync(path.resolve(__dirname, 'selector.js'), { encoding: 'utf-8' })
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

const replaceUseProperty = (properties: t.ObjectProperty[], filePath: string, server: string) => {
  const idx = properties.findIndex(property => (property.key as any).name === 'use')
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
          t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), [
            t.callExpression(t.identifier((use.value as any).name), [
              t.spreadElement(t.identifier('args')),
            ]),
            t.objectExpression([
              t.objectProperty(t.identifier('__file'), t.stringLiteral(filePath)),
            ]),
          ])
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
      t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), [
        t.callExpression(t.functionExpression(null, [], body), []),
        t.objectExpression([t.objectProperty(t.identifier('__file'), t.stringLiteral(filePath))]),
      ])
    ),
  ])
  return newBody
}

export default function (this: any, content: string, sourceMap: any, meta: any) {
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
          const properties = declaration.arguments[0].properties as t.ObjectProperty[]
          replaceUseProperty(properties, relativePath, server)
        }
      }
    },
    // TODO useFn 与 createComposable 都会被注入 __file，如何优化？
    FunctionDeclaration(path) {
      const node = path.node
      const funcName = node.id?.name
      if (!funcName || !matchFunctionName(funcName)) {
        return
      }

      node.body = replaceUseFn(node.body, relativePath)
    },
  })
  const newContent = generate(ast).code
  this.callback(null, newContent, sourceMap, meta)
}
