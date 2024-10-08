import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  // "/quicklist/",
  {
    text: "博客文章",
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
    ],
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
