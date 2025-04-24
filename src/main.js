import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'
// 导入基本样式
import '@/assets/main.scss'
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
