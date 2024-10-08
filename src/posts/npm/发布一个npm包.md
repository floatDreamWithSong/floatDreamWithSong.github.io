---
cover: /assets/images/cover2.jpg
icon: pen-to-square
date: 2024-10-08
category:
  - npm
tag:
  - npm
star: true
sticky: true
---
# 发布一个npm包到npmjs仓库并使用

## 搭建工程

首先要创建一个npm包的工程
这里我们使用的是pnpm包管理器和vite

``` cmd
pnpm create vite
```

![img](/npm/npm1.png "创建项目图片")

如图进行配置选择

输入终端命令安装依赖（vite和tsc）

``` cmd
pnpm i
```

## 编写项目

![img](/npm/npm3.png "目录结构图片")

**粗略讲解一下目录结构：**

我们生成的src目录下就是vite+js的一个网页模板，通过网页我们可以在浏览器中更方便调试。
这里我们就不做调试了

lib目录下就是我们主要写代码的地方，删除初始化生成的main.ts
我们可以设置一个入口文件index.ts集成导出，在其他ts模块中写库函数

接下来我们要使用第三方库moment.js进行再次封装，导出两个函数。

编写lib/format.ts:

``` ts
// format.ts
import moment, { MomentInput } from "moment";

// 将时间戳转换成时间字符串
export function formatTimestampToDate(
    timestamp: MomentInput,
    formatter = "YYYY-MM-DD HH:mm:ss"
) {
    return moment(timestamp).format(formatter);
}

/**
 * 将时间字符串转换成时间戳
 * @param {String} date 时间格式，例如2023-06-01 02:00:00
 * @returns {Number} 返回时间戳，例如1689264000000
 */
export function formatDateToTimestamp(date: MomentInput) {
    return moment(date).valueOf();
}

```

在函数前加上jsdoc类型的注释，（VSC可以下载jsdoc插件）我们可以稍后在构建的时候生成对应文件的.d.ts文件声名，
这样可以让我们的库文件导入后有类型提示，更加方便其他人使用。

在创建lib/index.ts，集中导出函数

``` ts
export { formatTimestampToDate, formatDateToTimestamp } from "./format";
```

可以在src/mian.ts中引入文件，命令行pnpm vite 启动开发调试。调试结果符合你的预期即可

## 打包配置

删除根目录下初始化的index.d.ts（不需要这个文件）

打开tsconfig.json，声名我们需要的类型声名文件的配置

- include属性表示我们要生成声名文件的目标文件夹，将src更改为lib
- 在compilerOption中:

``` json
 "compilerOption" : {
  // 添加如下三项
  "declaration": true,
  "outDir": "types",
  "emitDeclarationOnly": true,
  // 删除此项
  "noEmit": true, 
  }

```

作为一个包，我们首先要配置：

- 入口文件、声名文件的位置
- 打包哪些文件
- 作者
- 版本
- 是否公开

设置build时的入口为/lib/index.ts

``` ts
export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      //其他
    }
  }
})

```

接下来我们在命令行pnpm build，这将会在项目根目录生成dist目录（我们编译后的库文件所在）
和types目录（我们的库函数对应的类型声名文件所在）

可以看到types/format.d.ts如下：

``` ts
import { MomentInput } from "moment";
export declare function formatTimestampToDate(timestamp: MomentInput, formatter?: string): string;
/**
 * 将时间字符串转换成时间戳
 * @param {String} date 时间格式，例如2023-06-01 02:00:00
 * @returns {Number} 返回时间戳，例如1689264000000
 */
export declare function formatDateToTimestamp(date: MomentInput): number;

```

### pack前的配置

package.json中设置声名文件入口为/types/index.d.ts

``` ts
{
  "types": "./types/index.d.ts",
}

```

同时由于我们使用了moment.js作为依赖，因此在使用我们这个包时必须要安装
moment包，我们要添加moment作为我们的对等依赖

``` cmd
pnpm add moment --save-peer
```

但是我们打包的时候并不需要将moment一起打包进来，包管理器安装的时候会根据依赖自动安装的
我们也不期望将我们的包变得臃肿

设置将库

``` ts
export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      // 其他
    },
    rollupOptions: {
      external: ["moment"],
      output: {
        globals: {
          moment: "moment",
        },
      },
    }
  }
})

```

### 包信息设置

![img](/npm/npm2.png "package.json")

设置包名称，是否公开（设置为false才能发布到npmjs仓库）,作者名称，作者主页，包版本（版本不能和已经发布的版本冲突)

file属性添加你要打包的文件

如果你要打包的东西比较多，不方便使用file属性，就在根目录设置
.npmignore排除你不想打包的

如果不设置.npmignore，也会默认使用.gitignore

``` json
{
  "name": "vite-pak-demo",
  "private": false,
  "author": "floatDreamer",
  "homepage": "https://github.com/floatDreamWithSong",
  "version": "0.0.1",
  "type": "module",
  "files": [
    "dist",
    "types"
  ],
}

```

可以使用npm pack指令先生成一个包，tar -tf XXX.tgz进行解压预览

## 发布

首先需要npm login，你必须先在npm官网注册一个账号

npm login 失败的原因：

1. npm的网总是不好...
2. 你使用了镜像源之类的，需要切换回npm源

然后就可以npm publish了，

可以在你的npm账号中看到，
其他镜像源可能暂时无法使用你的包，但是他们会尽快保持跟官网仓库同步

完结撒花~
