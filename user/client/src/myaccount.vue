<template>
  <div>
    <h1>Hello, {{users}}</h1>
    <el-row>
      <el-col :span="3"><el-button type="primary" icon="edit" @click="getInfo()">Change detail</el-button></el-col>
      <el-col :span="4"><el-button type="primary" icon="edit" @click="dialogPassword = true">Change password</el-button></el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark p10" v-if="detail">
          <b>Username:</b> {{ detail.username }} <br>
          <b>Email:</b> {{ detail.email }} <br>
          <b>Display name:</b> {{ detail.displayname }} <br>
          <b>Birthday:</b> {{ detail.birthday }} <br>
          <b>Create at:</b> {{ detail.create_at }} <br>
          <b>Roles:</b> {{ detail.roles }} <br>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="Change password"
      :visible.sync="dialogPassword"
      size="tiny"
      :before-close="handleClose">
      <div>
        <el-form ref="P" :model="P" label-width="170px" class="demo-ruleForm">
          <el-alert v-if="msgP" :title="msgP" type="success" show-icon></el-alert>
          <el-alert v-if="msgErrP" :title="msgErrP" type="error" show-icon></el-alert>
          <br v-if="msgP || msgErrP">
          <el-input type="hidden" name="id" v-model="P.id" :value="P.id"></el-input>
          <el-form-item label="Old password" prop="old_password" :rules="[{ required: true, message: 'Please input old password', trigger: 'blur' }]">
            <el-input type="password" name="old_password" v-model="P.old_password"></el-input>
          </el-form-item>
          <el-form-item label="New password" prop="new_password" :rules="[{ required: true, message: 'Please input new password', trigger: 'blur' }]">
            <el-input type="password" name="new_password" v-model="P.new_password"></el-input>
          </el-form-item>
          <el-form-item label="Confirm new password" prop="cf_new_password"  :rules="[{ required: true, message: 'Please input confirm new password', trigger: 'blur' }]">
            <el-input type="password" name="cf_new_password" v-model="P.cf_new_password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPassword = false">Cancel</el-button>
        <el-button type="primary" @click="submitChangePassword('P')">Change password</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Change detail"
      :visible.sync="dialogDetail"
      size="tiny"
      :before-close="handleClose">
      <div>
        <el-form ref="D" :model="D" label-width="120px" class="demo-ruleForm">
          <el-alert v-if="msgD" :title="msgD" type="success" show-icon></el-alert>
          <el-alert v-if="msgErrD" :title="msgErrD" type="error" show-icon></el-alert>
          <br v-if="msgD || msgErrD">
          <el-input type="hidden" name="id" v-model="D.id" :value="D.id"></el-input>
          <el-form-item label="Username">
            <el-input type="text" :value="D.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email" :rules="[{ required: true, message: 'Please input email address', trigger: 'blur' },{ type: 'email', message: 'Please input correct email address', trigger: 'blur,change' }]">
            <el-input type="email" name="email" v-model="D.email"></el-input>
          </el-form-item>
          <el-form-item label="Display name" prop="displayname" :rules="[{ required: true, message: 'Please input display name', trigger: 'blur' }]">
            <el-input type="text" name="displayname" v-model="D.displayname"></el-input>
          </el-form-item>
          <el-form-item label="Birthday" prop="birthday">
            <el-date-picker
              v-model="D.birthday"
              type="date"
              placeholder="Pick a day">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Roles" prop="roles">
            <el-select v-model="D.roles" multiple placeholder="Select roles">
              <el-option
                v-for="item in roles"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDetail = false">Cancel</el-button>
        <el-button type="primary" @click="submitDetail('D')">Change</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        users: '',
        detail: '',
        dialogPassword: false,
        msgP: '',
        msgErrP: '',
        P: {
          id: 0,
          old_password: '',
          new_password: '',
          cf_new_password: ''
        },
        dialogDetail: false,
        msgD: '',
        msgErrD: '',
        D: {
          id: 0,
          username: '',
          email: '',
          displayname: '',
          birthday: '',
          roles: []
        },
        roles: [
          {value: 'admin', label: 'Admin'},
          {value: 'member', label: 'Member'},
          {value: 'shop_manager', label: 'Shop manager'}
        ]
      }
    },
    methods: {
      getInfo () {
        this.dialogDetail = true
        let userCheck = JSON.parse(sessionStorage.getItem('user'))
        axios.post('http://localhost:3000/api/my-account/' + userCheck.id)
          .then(res => {
            this.$refs['D'].resetFields()
            this.msgErrD = ''
            this.msgD = ''
            this.D.id = res.data.id
            this.D.username = res.data.username
            this.D.email = res.data.email
            this.D.displayname = res.data.displayname
            this.D.birthday = res.data.birthday
            this.D.roles = res.data.roles
          })
      },
      submitChangePassword (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.P.new_password === this.P.cf_new_password) {
              this.msgErrP = ''
              this.msgP = ''
              axios.post('http://localhost:3000/api/change-password', this.P)
                .then(res => {
                  if (res.data.msg) {
                    this.$refs['P'].resetFields()
                  }
                  this.msgP = res.data.msg || ''
                  this.msgErrP = res.data.msgErr || ''
                })
                .catch(err => {
                  this.msgErrP = err.message
                })
            } else {
              this.msgErrP = 'Password don\'t match'
            }
          } else {
            this.msgErrP = 'Error submit'
            return false
          }
        })
      },
      submitDetail (formName) {
        console.log(this.D)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.msgErrD = ''
            this.msgD = ''
            axios.post('http://localhost:3000/api/change-detail', this.D)
              .then(res => {
                this.detail = res.data.data
                this.msgD = res.data.msg || ''
                this.msgErrD = res.data.msgErr || ''
              })
              .catch(err => {
                this.msgErrD = err.message
              })
          } else {
            this.msgErrD = 'Error submit'
            return false
          }
        })
      },
      handleClose (done) {
        this.dialogPassword = false
        this.dialogDetail = false
      }
    },
    created () {
      let userCheck = JSON.parse(sessionStorage.getItem('user'))
      this.users = userCheck ? userCheck.displayname : 'guest'
      axios.post('http://localhost:3000/api/my-account/' + userCheck.id)
        .then(res => {
          this.detail = res.data
          this.P.id = res.data.id
          this.D.id = res.data.id
          this.D.username = res.data.username
          this.D.email = res.data.email
          this.D.displayname = res.data.displayname
          this.D.birthday = res.data.birthday
          this.D.roles = res.data.roles || []
        })
    }
  }
</script>
<style>
  .bg-purple-dark {
    background: #eef1f6 ;
  }
  .p10 {
    padding:10px;
  }
  .el-message-box.wsdelete .el-message-box__message {
    font-size: 17px;
  }

  .el-message-box.wsdelete {
      font-family: sans-serif;
  }
</style>
