# Code Inspector Plugin

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

Default: `code`，可选值：`code`（VS Code）、`VSCode-huawei`、`idea`、`webstorm`。

打开文件所用的编辑器。
