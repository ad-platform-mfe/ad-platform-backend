<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2>用户注册</h2>
      <el-form :model="registerForm" :rules="rules" ref="registerForm">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" style="width: 100%">注册</el-button>
        </el-form-item>
        <el-form-item>
          <router-link to="/login">已有账号？点击登录</router-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RegisterView',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.post('http://localhost:3030/api/register', {
              username: this.registerForm.username,
              password: this.registerForm.password
            })
            if (response.data.code === 200) {
              this.$message.success('注册成功')
              this.$router.push('/')
            } else {
              this.$message.error(response.data.message)
            }
          } catch (error) {
            this.$message.error('注册失败，请稍后重试')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
}

.register-card h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>