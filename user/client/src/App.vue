<template>
  <div id="app" class="container">
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1"><router-link to="/">Home</router-link></el-menu-item>
      <el-menu-item index="2"><router-link to="/users">Users</router-link></el-menu-item>
      <el-menu-item index="3" v-if="users"><router-link to="/my-account">My account</router-link></el-menu-item>
      <el-menu-item index="4" v-if="!users"><el-button type="text" @click="dialogVisible = true">Login</el-button></el-menu-item>
      <el-menu-item index="5" v-if="!users"><router-link to="/register">Register</router-link></el-menu-item>
      <el-menu-item index="6"><el-button type="text" @click="logout()">Logout</el-button></el-menu-item>
      <el-menu-item index="7"><router-link to="/admin-page">Admin page</router-link></el-menu-item>
      <el-menu-item index="8"><router-link to="/shop-manager">Shop page</router-link></el-menu-item>
      <el-menu-item index="9"><router-link to="/member-page">Member page</router-link></el-menu-item>
    </el-menu>
    <br>
    <router-view></router-view>
    <el-dialog title="Login" :visible.sync="dialogVisible" size="tiny">
      <div>
        <el-form ref="ruleForm2" label-width="120px" class="demo-ruleForm">
          <el-alert v-if="msg" :title="msg" type="success" show-icon></el-alert>
          <el-alert v-if="msgErr" :title="msgErr" type="error" show-icon></el-alert>
          <br v-if="msg || msgErr">
          <el-input type="text" placeholder="Username" name="username" v-model="ruleForm2.username"></el-input>
          <br>
          <br>
          <el-input type="password" placeholder="Password" name="password" v-model="ruleForm2.password"></el-input>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLogin()">Login</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
let baseUrl = 'http://localhost:3000'
export default {
  name: 'app',
  data () {
    return {
      dialogVisible: false,
      msg: '',
      msgErr: '',
      ruleForm2: {
        username: '',
        password: ''
      },
      users: ''
    }
  },
  created () {
    let userCheck = JSON.parse(sessionStorage.getItem('user'))
    this.users = userCheck ? userCheck.displayname : ''
  },
  methods: {
    submitLogin () {
      let getToken = sessionStorage.getItem('token')
      if (!getToken) {
        axios({
          method: 'post',
          url: baseUrl + '/api/login',
          data: this.ruleForm2
        })
          .then(res => {
            if (res.data.msg === 'ok') {
              sessionStorage.setItem('token', res.data.token)
            }
            this.msgErr = res.data.msgErr
          })
          .catch(err => {
            this.msgErr = err.message
          })
      } else {
        this.msgErr = 'Bạn đã đăng nhập.'
      }
    },
    logout () {
      this.$confirm(`Are you sure you want to log out?`, 'LOGOUT', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'info',
        customClass: 'wsdelete'
      }).then(() => {
        sessionStorage.clear()
        location.href = '/'
      }).catch(() => {

      })
    }
  }
}
</script>

<style>
.container {
  width: 1200px;
  margin: 0 auto;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
