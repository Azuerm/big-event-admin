import axios from 'axios'
// 导入数据
import { useUserStore } from '@/stores'
// 导入插件
import { ElMessage } from 'element-plus'
// 导入路由对象
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // 基础地址，超时时间
  baseURL,
  timeout: 10000
})
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 摘取核心响应式数据
    if (res.data.code === 0) {
      return res
    }
    // 处理业务失败，给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token过期 => 拦截到登录
    if (err.response?.status === 401) {
      // ?表示是否存在并且，status是不是等于401
      router.push('/login')
    }
    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL } //默认导出和按需导出不冲突
