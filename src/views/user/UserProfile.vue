<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
import { ElMessage } from 'element-plus'
// 是在使用仓库中数据的初始值（无需响应式）解构无问题
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()
// 表单数据
const formData = ref({
  username, // 示例登录名（禁用状态）
  nickname,
  email,
  id
})
// 表单校验规则
const formRules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (/\s/.test(value)) {
          callback(new Error('不能包含空格'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
}
// 表单引用
const formRef = ref()
// 提交表单
const submitForm = async () => {
  // 等待校验结果
  await formRef.value.validate()
  // 提交修改
  await userUpdateInfoService(formData.value)
  // 通知user模块，进行数据的更新
  getUser()
  ElMessage.success('修改成功')
}
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      style="max-width: 600px"
    >
      <!-- 1. 登录名称（禁用） -->
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="formData.username" disabled />
      </el-form-item>
      <!-- 2. 用户昵称（可输入+校验） -->
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入2-10位昵称" />
      </el-form-item>
      <!-- 3. 用户邮箱（可输入+校验） -->
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入有效邮箱" />
      </el-form-item>
      <!-- 4. 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
<style scoped>
/* 可选样式 */
.el-form {
  margin-top: 20px;
}
.el-input {
  width: 100%;
}
</style>
