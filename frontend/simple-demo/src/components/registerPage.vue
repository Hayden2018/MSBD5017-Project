<template>
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
      >Create</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {register} from "../api/http.js";
import {useRouter} from "vue-router";

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: 'axv',
  password: 'password',
})

const route = useRouter();

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
      var res = register(ruleForm.name, ruleForm.password)
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