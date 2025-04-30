<script setup>
import { nextTick, ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
// vue-quill富文本编辑器
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService } from '@/api/article'
import { defineEmits } from 'vue'
// 默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
}
// 准备数据
const formModel = ref({
  ...defaultForm
})
const rules = {
  title: [{ required: true, pattern: /^\S+$/, trriger: 'blur' }],
  cate_id: [{ required: true }],
  content: [{ required: true, pattern: /^\S+$/, trriger: 'blur' }],
  cover_img: [{ required: true }],
  state: [{ required: true }]
}
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
// 图片上传相关逻辑
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  // console.log(uploadFile)
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
  // 立即将图片对象，存入 formModel.value.cover_img 将来用来提交
  formModel.value.cover_img = uploadFile.raw
}
// 提交
const emit = defineEmits('success')
const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入formModel
  formModel.value.state = state
  // 注意：当前接口，需要的是formData对象
  // 将普通对象 => 转换为 => formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    console.log('编辑操作')
  } else {
    // 发布操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知到父组件，添加成功了
    emit('success', 'add')
  }
}
const editorRef = ref() // 编辑器
const openDrawer = (row) => {
  visibleDrawer.value = true //显示抽屉
  // console.log(row)
  if (row.id) {
    // 需要基于 row.id发送请求，获取编辑对应的详情数据，进行回显
    // console.log('编辑回显')
  } else {
    // console.log('添加')
    formModel.value = { ...defaultForm } //基于默认的数据，重置from的数据
    // 这里重置了表单的数据，但图片上传img地址，富文本编辑器内容 => 需要手动重置
    imgUrl.value = ''
    nextTick(() => {
      editorRef.value.setHTML('')
    })
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
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" :rules="rules">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model:cid="formModel.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传，不需要配置action等参数，只需要做前端的本地预览图片即可，无需在提交前上传图片
          语法: URL.createObjectURL(...) 创建本地预览的地址，来预览
        -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <!-- auto-upload关闭自动上传 -->
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
