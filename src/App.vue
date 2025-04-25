<script setup>
import { useRoute, useRouter } from 'vue-router'
// 在vue3 compositionAPI 中
// 1.获得路由对象 router useRouter
//  const router = useRouter()
// 2.获得路由参数 route useRoute
//  const route = useRoute
const router = useRouter()
const route = useRoute()
const goList = () => {
  console.log(router, route)
  router.push('/list')
}
// 导入数据库的数据
import { useUserStore, useCountStore } from '@/stores'
const userStore = useUserStore()
const countStore = useCountStore()
</script>

<template>
  <hr />
  <router-view></router-view>
  <hr />
  <hr />
  <hr />
  <div>我是App</div>
  <test-demo></test-demo>
  <el-button @click="$router.push('/home')">跳首页</el-button>
  <el-button @click="goList">跳列表页</el-button>
  <hr />
  <p>{{ userStore.token }}</p>
  <el-button @click="userStore.setToken('hhhhhhhh')">登录</el-button>
  <el-button @click="userStore.removeToken()">退出</el-button>
  <hr />
  {{ countStore.count }}
  <el-button @click="countStore.add(2)">加法</el-button>
</template>

<style scoped></style>
