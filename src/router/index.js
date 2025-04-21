import {
  createRouter,
  createWebHistory
  // createWebHashHistory
} from 'vue-router'
// createRouter 创建路由实例
// 配置history模式
// 1.history模式：createWebHistory 地址栏不带#
// 2.hash模式：createWebHashHistory 地址栏带#
// 3. vue路由懒加载

console.log(import.meta.env.DEV) // true
// vite 中的环境变量 import.meta.env.BASE_URL 就是 vite.config.js 中的 base配置项
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
