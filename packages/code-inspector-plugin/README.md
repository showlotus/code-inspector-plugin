# Code Inspector Plugin

> [!TIP]
> 适用于用 _Webpack_ 打包的 _Vue_ 项目，借助于 _Vue_ `render` 函数的 `attrs` 属性（在上游阶段添加 `__file` 属性），如果当前渲染的 _DOM_ 节点拥有一个 `__file` 属性，即当前组件文件的相对路径。当触发选择器后并点击，就会打开当前 _DOM_ 节点所在的组件源文件。注意：该插件不会向 `Vue` 组件中注入 `__file` 属性，需要在上游阶段提供。

同时按下：`Alt` + `Shift` 时，触发选择器。点击后，在编辑器中打开当前元素对应的代码源文件。

![demo](https://github.com/showlotus/code-inspector-plugin/raw/master/res/code-inspector-plugin-demo.gif)

## 安装

安装插件

```shell
npm install @showlotus/code-inspector-plugin -D
```

配置 Webpack

```js
const CodeInspectorPlugin = require('@showlotus/code-inspector-plugin')

module.exports = {
  plugins: [
    new CodeInspectorPlugin({
      test: /\.ts$/,
      include: /src\//,
      exclude: /node_modules/,
      editor: 'code',
    }),
  ],
}
```

## 配置

### 参数

#### test

Type: `string | RegExp | [string, RegExp]`

Default: `null`

所有匹配的模块。

#### include

Type: `string | RegExp | [string, RegExp]`

Default: `null`

包含匹配到的所有模块。

#### exclude

Type: `string | RegExp | [string, RegExp]`

Default: `null`

排除匹配到的所有模块。

#### editor

Type: `string`

Default: `code`，可选值：`code`、`idea`、`webstorm`。

打开文件所用的编辑器命令。
