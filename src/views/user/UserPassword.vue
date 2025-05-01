<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user.js'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
// 表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
// 表单引用
const formRef = ref()
// 校验规则
const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === pwdForm.value.old_pwd) {
          callback(new Error('新密码不能与原密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.value.new_pwd) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const userStore = useUserStore()
const router = useRouter()
// 提交表单
const submitForm = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('修改密码成功')
  // 密码修改成功后，退出重新登录
  // 清空本地存储的token和个人信息
  userStore.setToken('')
  userStore.setUser({})
  // 拦截到登录页
  router.push('/login')
}
// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
}
</script>
<template>
  <page-container title="重置密码">
    <el-row>
      <el-col :span="12">
        <el-form
          ref="formRef"
          :model="pwdForm"
          :rules="rules"
          label-width="100px"
          style="max-width: 500px; margin-top: 20px"
        >
          <!-- 1. 原密码 -->
          <el-form-item label="原密码" prop="old_pwd">
            <el-input
              v-model="pwdForm.old_pwd"
              type="password"
              show-password
              placeholder="请输入原密码"
            />
          </el-form-item>

          <!-- 2. 新密码 -->
          <el-form-item label="新密码" prop="new_pwd">
            <el-input
              v-model="pwdForm.new_pwd"
              type="password"
              show-password
              placeholder="请输入6-15位新密码"
            />
          </el-form-item>

          <!-- 3. 确认密码 -->
          <el-form-item label="确认密码" prop="re_pwd">
            <el-input
              v-model="pwdForm.re_pwd"
              type="password"
              show-password
              placeholder="请再次输入新密码"
            />
          </el-form-item>

          <!-- 4. 按钮组 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">修改密码</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
