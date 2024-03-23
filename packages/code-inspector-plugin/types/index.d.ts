type MatchType = string | RegExp | [string, RegExp];
interface Options {
    /**
     * 所有匹配的模块
     */
    test: MatchType;
    /**
     * 包含匹配到的所有模块
     */
    include: MatchType;
    /**
     * 排除匹配到的所有模块
     */
    exclude: MatchType;
    /**
     * 打开文件所用的编辑器
     */
    editor: 'code' | 'VSCode-huawei' | 'idea' | 'webstorm';
}
declare class CodeInspectorPlugin {
    options: Options;
    constructor(options: Options);
    apply(compiler: any): void;
    matchObject(obj: Options, str: string): boolean;
    matchPart(str: string, test: MatchType): boolean;
    asRegExp(test: string | RegExp): RegExp;
}
export = CodeInspectorPlugin;
