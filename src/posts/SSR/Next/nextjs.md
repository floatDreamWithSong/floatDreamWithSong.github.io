# Next.js

## 项目创建：

``` sh
# 模板创建
npx create-next-app@latest
# 或者手动添加
npm install next@latest react@latest react-dom@latest
```

## next指令

``` sh
next dev # 开发环境启动
next build # 编译项目
next start # 生产环境启动
next lint # 代码检查
```

## 路由

### App router

app/page.tsx as root component

#### 特殊的文件

- page.tsx：用于定义页面组件。
- layout.tsx：用于定义页面布局组件。
- loading.tsx：用于定义页面加载组件。
- not-found.tsx：用于定义404页面组件。
- error.tsx：用于定义错误页面组件。
- global-error.tsx：用于定义全局错误处理组件。
- route.ts： API 终端点
- templete.tsx：布局重渲染
- default.tsx: 重定向

#### 特殊的目录

- `public`：用于存放静态资源，比如图片、字体等。通过"/"引用资源
- `.next`：用于存放编译后的文件，不应该被编辑。
- 动态路由目录
  - `[folder]`：动态路由划分
  - `[...folder]`：动态路由划分,但是可以捕获从此往后的所有划分并以数组形式传参
  - `[[...folder]]`：可选的，不传就是undifined
- `(folder)`:路由分组
- `_folder`: 私有目录
- `@folder`: 插槽
  > `插槽`：在页面中定义插槽，然后在其他页面中插入内容，共享插入页面的布局，并且插槽文件夹不出现在URL路由。next这里用并行路由来解释
  > 这里和vue的插槽不太一样，vue是由外向内插槽内容，这里感觉，更灵活了。但是嵌套结构又有点奇怪
  >
  > ![slots](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fparallel-routes.png&w=3840&q=75&dpl=dpl_3SbCqnjAVDFddAzkjQT5WUwEBmtz)

### Page router

pages/index.tsx as root component

#### 特殊的文件

- `_app`
- `_document`
- `_error`
- 404
- 500

#### 更多page模式的介绍[link](https://nextjs.org/docs/getting-started/project-structure#pages-routing-conventions)

### layout

RootLayout是必要的，如果没有，会自动创建一个

Layout的权限受很大控制，子父之间甚至不能传参

### Redirect

重定向：
- 是否permanent (307:临时，308:永久)
- Redirect
- useRoute
- next.config.js
- middleware


