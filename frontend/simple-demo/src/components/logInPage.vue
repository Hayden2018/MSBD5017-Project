<template>
  <div class="login-container">

    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
    >
      <el-form-item label="Activity name" prop="username">
        <el-input v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item label="Activity name" prop="password">
        <el-input v-model="ruleForm.password" />
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
        >Login</el-button>
        <el-button type="info" @click="toResgister">Register</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script lang="ts" setup>

import {login} from "../api/http.js";
import {useRouter} from "vue-router";
import { reactive, ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'

let formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: 'Test-User',
  password: 'password'
})

const route = useRouter();
function toResgister() {
  route.push({path: '/reg'});
}


const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: 'Please input password',
      trigger: 'change',
    },
    {
      min: 6,
      max: 12,
      message: 'Length should be 6 to 12',
      trigger: 'change',
    },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let res = login(ruleForm.name, ruleForm.password)
      res.then((data) => {
        if (data.status === 200) {
          localStorage.setItem("username", ruleForm.name)
          localStorage.setItem("token", data.data.token)
          route.push({path: '/home'})
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}





</script>

<style scoped>

</style>