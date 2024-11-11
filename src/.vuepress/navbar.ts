import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: '博客列表',
    link:'/posts/'
  },
  {
    text: "推荐文章",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "npm",
        icon: "pen-to-square",
        prefix: "npm/",
        children: [
          { text: "发布一个npm包", icon: "pen-to-square", link: "发布一个npm包" },
        ],
      },
      {
        text: "vue",
        icon: "pen-to-square",
        prefix: "vue/",
        children: [
          { text: "发布一个vue组件库到npm仓库", icon: "pen-to-square", link: "写一个vue组件库并发布" },
        ],
      },
      {
        text:'后端',
        icon:"pen-to-square",
        prefix:"backend/Java/",
        children:[{
          text:"SQL",
          link:"SQL速通"
        }]
      },
      {
        text:'typescript',
        icon:"pen-to-square",
        prefix:"posts/Ts/",
        children:[{
          text:"Ts 泛型挑战",
          link:"type挑战"
        }]
      }
    ],
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
