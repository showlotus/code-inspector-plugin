# Code Inspector Plugin

> [!TIP]
> 专门为我司 SAAS 项目开发的插件：适用于用 _Webpack_ 打包的 _Vue_ 项目，会将项目中文件中定义的所有函数（命名风格为 `useXxx`）的返回值中插入一个 `__file` 属性，即当前组件文件的相对路径。当触发选择器后并点击，就会打开当前 _DOM_ 节点所在的组件源文件。

同时按下：`Alt` + `Shift` 时，触发选择器。点击后，在编辑器中打开当前元素对应的代码源文件。

![demo](https://raw.githubusercontent.com/showlotus/code-inspector-plugin/master/res/code-inspector-plugin-demo.gif)

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
