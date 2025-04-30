<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // console.log(channelList.value)
}
getChannelList()
// defineProps({
//   modelValue: {
//     type: [Number, String]
//   }
// })
const cid = defineModel('cid', {
  default: '',
  set(value) {
    // 自动转换数字字符串为数字类型（可选）
    if (typeof value === 'string' && !isNaN(value)) {
      return Number(value)
    }
    return value
  }
})
</script>

<template>
  <el-select v-model="cid">
    <!-- label 展示给用户看的，value 收集起来提交给后台的 -->
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
