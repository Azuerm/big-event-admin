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
</script>

<template>
  <div>我是App</div>
  <button @click="$router.push('/home')">跳首页</button>
  <button @click="goList">跳列表页</button>
</template>

<style scoped></style>
