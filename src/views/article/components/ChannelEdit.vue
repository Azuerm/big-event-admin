<script setup>
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article.js'
const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trriger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trriger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母或数字',
      trigger: 'blur'
    }
  ]
}
// 组件对外暴露一个方open，基于open传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({ id, cate_name, ...}) => 表单需要重新渲染，说明是编辑
// open调用后，可以打开弹窗
const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row.row } //添加 -> 重置了表单内容；编辑了需要回显的数据
}
const formRef = ref() //用户预校验
const emit = defineEmits(['success'])
const onSubmit = async () => {
  // 区分添加还是编辑
  await formRef.value.validate()
  const isEidt = formModel.value.id
  if (isEidt) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  // 子传父：通知修改成功
  emit('success')
}
// 往外暴露方法
defineExpose({
  open
})
</script>
<template>
  <!-- 弹层 -->
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="500"
  >
    <!-- 渲染表单 -->
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
