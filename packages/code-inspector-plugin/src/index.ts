import openInEditor from 'launch-editor-middleware'
import path from 'path'
import { formatPath } from './utils'

const PLUGIN_NAME = 'CodeInspectorPlugin'

const isDevelopment = (compiler: any) => {
  return process.env.NODE_ENV === 'development' || compiler.options.mode === 'development'
}

const mergeSetupMiddlewares = (options: any, setupMiddleware: Function) => {
  if (!options.devServer) {
    options.devServer = {
      setupMiddlewares: setupMiddleware,
    }
    return
  }

  const originMiddlewares = options.devServer?.setupMiddlewares
  if (!originMiddlewares) {
    options.devServer.setupMiddlewares = setupMiddleware
    return
  }

  options.devServer.setupMiddlewares = function (middlewares: any[]) {
    originMiddlewares(middlewares)
    return setupMiddleware(middlewares)
  }
}

const mergeDevServerBeforeHook = (options: any, beforeHook: Function) => {
  if (!options.devServer) {
    options.devServer = {
      before: beforeHook,
    }
    return
  }

  const originBeforeHook = options.devServer?.before
  if (!originBeforeHook) {
    options.devServer.before = beforeHook
    return
  }

  options.devServer.before = function (app: any) {
    originBeforeHook(app)
    beforeHook(app)
  }
}

const injectLoader = (loaders: any[], server: any) => {
  if (loaders.find(loader => loader._isCodeInspectorLoader)) {
    return
  }

  const loader = {
    loader: path.resolve(__dirname, './loader.js'),
    options: {
      server: server || '',
    },
    ident: null,
    type: null,
    _isCodeInspectorLoader: true,
  }

  const tsLoaderIdx = loaders.findIndex(loader => loader.loader.indexOf('ts-loader') > -1)
  if (tsLoaderIdx === -1) {
    const cacheLoaderIdx = loaders.findIndex(loader => loader.loader.indexOf('cache-loader') > -1)
    if (cacheLoaderIdx > -1) {
      loaders.splice(cacheLoaderIdx + 1, 0, loader)
    } else {
      loaders.unshift(loader)
    }
  } else {
    loaders.splice(tsLoaderIdx, 0, loader)
  }
}

type MatchType = string | RegExp | [string, RegExp]

interface Options {
  /**
   * 所有匹配的模块
   */
  test: MatchType
  /**
   * 包含匹配到的所有模块
   */
  include: MatchType
  /**
   * 排除匹配到的所有模块
   */
  exclude: MatchType
  /**
   * 打开文件所用的编辑器
   */
  editor: 'code' | 'VSCode-huawei' | 'idea' | 'webstorm'
}

class CodeInspectorPlugin {
  options: Options
  constructor(options: Options) {
    this.options = options
  }

  apply(compiler: any) {
    if (!isDevelopment(compiler)) {
      return
    }

    const editor = this.options.editor || 'code'
    const openEditorPath = '/__open-in-editor'
    const matchObject = this.matchObject.bind(this, this.options)

    const version = compiler.webpack?.version || require('webpack').version
    const { host, port } = compiler.options.devServer
    const server = `//${host}:${port}`

    if (version.startsWith('5')) {
      compiler.hooks.afterEnvironment.tap(PLUGIN_NAME, () => {
        mergeSetupMiddlewares(compiler.options, function (middlewares: any[]) {
          middlewares.unshift({
            name: 'open-in-editor',
            path: openEditorPath,
            middleware: openInEditor(editor),
          })
          return middlewares
        })
      })

      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
        const normalModule = compiler.webpack
          ? compiler.webpack.NormalModule
          : require('webpack/lib/NormalModule')
        normalModule
          .getCompilationHooks(compilation)
          .beforeLoaders.tap(PLUGIN_NAME, (loaders: any[], module: any) => {
            if (matchObject(formatPath(module.userRequest))) {
              injectLoader(loaders, server)
            }
          })
      })
    } else if (version.startsWith('4')) {
      compiler.hooks.afterEnvironment.tap(PLUGIN_NAME, () => {
        mergeDevServerBeforeHook(compiler.options, function (app: any) {
          app.use(openEditorPath, openInEditor(editor))
        })
      })
      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
        const normalModuleLoader = compilation.hooks.normalModuleLoader
        normalModuleLoader.tap(PLUGIN_NAME, (context: any, module: any) => {
          if (matchObject(module.userRequest.replace(/\\/g, '/'))) {
            injectLoader(module.loaders, server)
          }
        })
      })
    }
  }

  matchObject(obj: Options, str: string) {
    if (obj.test) {
      if (!this.matchPart(str, obj.test)) {
        return false
      }
    }
    if (obj.include) {
      if (!this.matchPart(str, obj.include)) {
        return false
      }
    }
    if (obj.exclude) {
      if (this.matchPart(str, obj.exclude)) {
        return false
      }
    }
    return true
  }

  matchPart(str: string, test: MatchType) {
    if (!test) {
      return true
    }

    if (Array.isArray(test)) {
      return test.map(this.asRegExp).some(regExp => regExp.test(str))
    } else {
      return this.asRegExp(test).test(str)
    }
  }

  asRegExp(test: string | RegExp) {
    if (typeof test === 'string') {
      test = new RegExp(test.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
    }
    return test
  }
}

export default CodeInspectorPlugin
