<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="Book Title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="Publish">
      <el-switch on-text="" off-text="" v-model="form.publish"></el-switch>
    </el-form-item>
    <el-form-item label="Book description">
      <el-input type="textarea" v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import axios from 'axios'
  let bookURL = 'http://localhost:3000/api'
  // let userURL = 'http://localhost:3003'
  export default {
    data () {
      return {
        form: {
          title: '',
          publish: false,
          desc: ''
        }
      }
    },
    created () {
      // axios.get(`${bookURL}/books/category/all`).then(res => {
      //   this.form.category = res.data.data
      //   console.log(this.form.category)
      // })
    },
    methods: {
      onSubmit () {
        console.log(this.form)
        console.log('submit!')
        if (!sessionStorage.getItem('token')) {
          this.$message({
            type: 'success',
            message: `Please log in to create book`
          })
        } else {
          console.log('user is logged in')
          let options = {
            method: 'POST',
            url: `${bookURL}/books/`,
            data: this.form,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT '.concat(sessionStorage.token),
              'Username': sessionStorage.username
            }
          }
          axios(options)
            .then(res => {
              if (res.data.data === 'create book ok') {
                this.$message({
                  type: 'success',
                  message: `Create ${this.form.title} completed. Server msg: ${res.data.data}`
                })
                console.log(this.form)
              }
            }).catch((err) => {
              console.log(err)
            })
        }
      }
    }
  }

</script>