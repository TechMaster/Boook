<template>
  <div>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="120px" class="demo-ruleForm">
      <el-alert v-if="msg" :title="msg" type="success" show-icon></el-alert>
      <el-alert v-if="msgErr" :title="msgErr" type="error" show-icon></el-alert>
      <br>
      <el-form-item label="Username" prop="username">
        <el-input type="text" v-model="ruleForm2.username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Confirm" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email" :rules="[{ required: true, message: 'Please input email address', trigger: 'blur' },{ type: 'email', message: 'Please input correct email address', trigger: 'blur,change' }]">
        <el-input type="email" v-model="ruleForm2.email"></el-input>
      </el-form-item>
      <el-form-item label="Display name" prop="displayname">
        <el-input type="text" v-model="ruleForm2.displayname"></el-input>
      </el-form-item>
      <el-form-item label="Birthday" prop="birthday">
        <el-input type="date" v-model="ruleForm2.birthday"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">Submit</el-button>
        <el-button @click="resetForm('ruleForm2')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data () {
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the Username'))
        }
        callback()
      }
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the Password'))
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass')
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password again'))
        } else if (value !== this.ruleForm2.password) {
          callback(new Error('Password don\'t match!'))
        } else {
          callback()
        }
      }
      let validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the Email'))
        }
        callback()
      }
      let validateDisplayname = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the Display name'))
        }
        callback()
      }
      let validateBirthday = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the Birthday'))
        }
        callback()
      }
      return {
        msg: '',
        msgErr: '',
        ruleForm2: {
          username: '',
          password: '',
          checkPass: '',
          email: '',
          displayname: '',
          birthday: ''
        },
        rules2: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' }
          ],
          displayname: [
            { validator: validateDisplayname, trigger: 'blur' }
          ],
          birthday: [
            { validator: validateBirthday, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('http://localhost:3000/api/register', this.ruleForm2)
              .then(res => {
                console.log(res.data)
                this.msg = res.data.msg || ''
                this.msgErr = res.data.msgErr || ''
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style>

</style>


