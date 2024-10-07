import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "DayDreamer的个人博客",
  description: "无",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
