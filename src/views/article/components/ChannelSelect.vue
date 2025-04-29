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
const cid = defineModel('cid')
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
