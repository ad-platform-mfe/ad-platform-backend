<template>
    <div class="login-container">
      <el-card class="login-card">
        <h2>用户登录</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
          </el-form-item>
          <el-form-item>
            <router-link to="/register">没有账号？点击注册</router-link>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'LoginView',
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleLogin() {
        this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
            try {
              const response = await axios.post('http://localhost:3030/api/login', this.loginForm)
              if (response.data.code === 200) {
                this.$message.success('登录成功')
                this.$router.push('/home')
              } else {
                this.$message.error(response.data.message)
              }
            } catch (error) {
              this.$message.error('登录失败，请稍后重试')
            }
          }
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
  }
  
  .login-card {
    width: 400px;
  }
  
  .login-card h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  </style>