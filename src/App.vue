<script setup>
import { zhCn } from 'element-plus/es/locales.mjs'
</script>

<template>
  <!-- App.vue只需要留一个路由出口 router-view即可 -->
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped></style>
