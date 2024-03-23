# ts-webpack-devtools

> 参考资料：
>
> - https://github.com/yyx990803/launch-editor
> - [Chrome 插件 vue-devtools 是如何把 VSCode 中对应的组件文件打开的](https://juejin.cn/post/7124860117786296334)
> - [vue-devtools 打开组件文件之原理解析](https://juejin.cn/post/6992602669969833992)
> - [vue-devtools 如何得到组件对应的信息](https://juejin.cn/post/7025961122389983246)

> VS Code 打开文件命令：`Code`
>
> VSCode-Huawei 打开文件命令：`VSCode-huawei`

- 打开一个文件

  ```js
  // 文件名：src/App.ts
  // 行号：7
  // 列号：25
  fetch('/__open-in-editor?file=src/App.ts:7:25')
  ```

- 通过 `render` 函数定义的一个组件，在配置项里添加 `__file` 属性后，就会在 `devtools` 里开启 _Open in ... editor_ 按钮。而通过 `.vue` 去生成的组件，`vue-loader` 会默认添加 `__file` 属性，所以会自动开启 _Open in ... editor_ 按钮。

- 遇到一个有趣的点：_Win_ 平台得到的文件路径以 `\` 分隔，_Mac_ 平台得到的文件路径以 `/` 分隔。如果 `__file` 是以反斜杠 `\` 分隔的路径，例如 `src\app.ts`，那么也不会开启 _Open in ... editor_ ，必须以斜杠 `/` 分隔才可以。

- 旧版 _Webpack_ 配置：

  ```js
  const openInEditor = require('launch-editor-middleware')

  module.exports = {
    /* ... */
    devServer: {
      before(app) {
        app.use('/__open-in-editor', openInEditor('code'))
      },
    },
  }
  ```

- 新版 _Webpack_ 配置：

  ```js
  const openInEditor = require('launch-editor-middleware')

  module.exports = {
    /* ... */
    devServer: {
      setupMiddlewares(middlewares) {
        middlewares.unshift({
          name: 'open-in-editor',
          path: '/__open-in-editor',
          middleware: openInEditor('code'),
        })
        return middlewares
      },
    },
  }
  ```

- 待解决的问题：

  - 如何获取当前页面的组件层级结构？
  - 自定义 Vue devtools 面板，隐藏一些不必要的功能。先降低隐藏原有功能的优先级，优先添加自定义插件，预览当前组件层级结构。
  -

一个普通的 JS/TS 文件的 Vue 组件，在开发环境下，Vue 内部实例化的时候会在 `$options` 上注入一个属性 `__file` 对应该组件的源文件位置。

## 实现方案

1. 在返回的 `op` 对象上挂载一个 `__file` 属性，为当前文件的相对路径。但是，并不是所有文件都会返回 `op` 这个对象，有些是封装过后的，比如以 `page` 为例。

   入口文件会有一个默认导出。

   ```js
   // index.js
   function useFn() {
     /* ... */
   }

   export default createComposable({
     manifest,
     use: useFn,
   })
   ```

   `useFn` 为主逻辑代码，需要对其进行封装一层。

   ```js
   // index.js
   function useFn() {
     /* ... */
   }

   const myUseFn = function (...args) {
     const res = useFn(...args)
     res.__file = /* 文件的相对路径 */
     return res
   }

   export default createComposable({
     manifest,
     use: myUseFn,
   })
   ```

   对源文件进行解析的时候，需要处理

   ```js
   // before
   export default createComposable({
     manifest,
     use: useFn,
   })

   // after
   export default createComposable({
     manifest,
     use: function(...args) {
      return Object.assign(useFn(...args), { __file: '' })
     },
   })
   ```

2. 解析目标文件夹下的组件文件，文件路径以 `use-xx-xx/index.ts` 或者 `use-xx-xx.ts` 结尾的，认为是组件源文件。查找当前文件里，定义的函数名格式为 `useXxxYyy` 大驼峰格式的方法，在 `return` 之前，给返回值注入 `__file` 属性。同时，提供两个配置（`exclude`，`include`，[参考](https://webpack.docschina.org/plugins/banner-plugin#options)），对需要匹配的文件进行灵活配置。

## 兼容 Webpack 4&5

> - https://www.cnblogs.com/xingguozhiming/p/15424014.html
> - https://github.com/vuejs/vue-loader/blob/master/lib/plugin-webpack4.js#L15
> - https://github.com/vuejs/vue-loader/blob/master/lib/plugin-webpack5.js#L53

## 高版本 Node 打开文件时报错：--openssl-legacy-provider is not allowed in NODE_OPTIONS

## 组件支持情况

|     组件      | 是否支持 |
| :-----------: | :------: |
|   MetaPage    |    ✓     |
|   MetaGrid    |    ✓     |
|   MetaForm    |    ✓     |
| MetaContainer |    ✓     |
|  MetaDialog   |    ✓     |

## 编辑器支持情况

|     编辑器     | 是否支持 |
| :------------: | :------: |
|    VS Code     |    ✓     |
| VS Code-huawei |    ✓     |
|    WebStorm    |    ✓     |
|      IDEA      |          |
