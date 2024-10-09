---
cover: /assets/images/cover2.jpg
icon: pen-to-square
date: 2024-10-09
category:
  - vue
  - npm
tag:
  - vue
  - npm
star: true
sticky: true
---

# 写一个vue组件库并发布

## 脚手架搭建环境

通过pnpm包管理工具，使用vite，创建一个以vue为模板的项目结构

``` cmd
pnpm create vite vite-pak-vue --template vue
cd vite-pak-vue
pnpm i
```

可以再输入 pnpm dev 启动一次开发预览，确认环境搭建成功

## 整理项目

有很多默认结构是我们不需要的

删除public目录，assets目录，components下的默认.vue文件，
删除style.css全局样式表，删除App.vue内的默认脚本(保留script和template标签)

``` vue
// App.vue
<script setup lang="ts">
</script>
<template>
<div class=""></div>
</template>
<style scoped></style>
```

最后在main.js中删除那些导入了已经不存在的导入文件的语句，结果如下

``` js
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

## 写组件

在components目录下新建popup目录，在里面新建index.js和PopUp.vue

``` vue
<script setup lang="ts">
defineProps({
    text:{
        type:String,
        defalut:'text'
    }
})
</script>
<template>
<div class="back">
    <div class="box">
        {{text}}
    </div>
</div>
</template>
<style scoped>
.back{
    position: absolute;
    background-color: rgba(0, 0, 0, 0.289);
    width: 100%;
    height: 100%;
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
    .box{
        background-color: white;
        width: 30vw;
        height: 30vh;
    }
}
</style>
```

这里我们只是简单的做一个PopUp进行演示,可以在App.vue中导入进行调试
效果如下

![img](/vue/vue.1png "调试效果")

编写components/popup/index.js

``` js
import PopUp from "./PopUp.vue";

export { PopUp }

const component = [PopUp];

const install = function (App) {
    component.forEach((item) => {
        console.log('installing item : ', item)
        App.component(item.__name, item);
    });
}

export default { install }

```

这里就是将组件导入，通过vue提供的一个install接口（当我们在vue项目的入口文件使用时App.use()时，会调用它的install方法），
将组件注入全局，item.__name是根据.vue文件的文件名自动生成的，比如这里的值就是PopUp

我们在全局main.js中注入调试一次

``` js
import { createApp } from 'vue'
import App from './App.vue'
import popup from './components/popup'
createApp(App).use(popup).mount('#app')
```

在App.vue中不用导入，直接使用

``` vue
<script setup lang="ts">

</script>
<template>
<div class="">
    <PopUp text="123" />
</div>
</template>
<style scoped></style>
```

可以看到效果是一样的

## 打包发布

和上一篇文章一样，配置好编译目标和排除依赖

``` js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // 库编译模式配置
    lib: {
      entry: path.resolve(__dirname, "./src/components/popup/index.js"), //指定组件编译入口文件
      name: "PopUp",
      fileName: "popup",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  }
})
```

设置包信息

``` json
{
  "name": "vite-pak-vue",
  "private": false,
  "version": "0.0.1",
  "type": "module",
  "author": "dayDreamer",
  "license":"ISC",
  "keywords": ["vue","popup"],
  "files": [
    "src/components"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.10"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1.4",
    "vite": "^5.4.8"
  }
}
```

然后就是上篇文章讲过的，npm login， npm publish
如果你想要发布一个新的版本，那么需要修改version属性，发布到仓库的包的版本不能冲突

完结撒花~
