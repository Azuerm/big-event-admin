import { createPinia } from 'pinia'
// 持久化
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)

export default pinia

// import { useUserStore } from './modules/user'
// export { useUserStore }
// import { useCountStore } from './modules/counter'
// export { useCountStore }
export * from './modules/user'
// 接收user模块的所有按需导出
export * from './modules/counter'
