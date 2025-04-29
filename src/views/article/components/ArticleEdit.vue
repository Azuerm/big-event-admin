<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
// 默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
}
const formModel = ref({
  ...defaultForm
})
const rules = {}
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
const openDrawer = (row) => {
  visibleDrawer.value = true //显示抽屉
  // console.log(row)
  if (row.id) {
    // 需要基于 row.id发送请求，获取编辑对应的详情数据，进行回显
    console.log('编辑回显')
  } else {
    formModel.value = { ...defaultForm } //基于默认的数据，重置from的数据
    console.log('添加')
  }
}
defineExpose({
  openDrawer
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" :rules="rules">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model:cid="formModel.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">文件上传</el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">富文本编辑器</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">发布</el-button>
        <el-button type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
