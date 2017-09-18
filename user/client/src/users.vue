<template>
  <div>
    <el-table v-if="users" :data="users" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="username" label="Username"></el-table-column>
      <el-table-column prop="email" label="Email"></el-table-column>
      <el-table-column prop="displayname" label="Display name"></el-table-column>
      <el-table-column prop="birthday" label="Birthday"></el-table-column>
      <el-table-column prop="roles" label="Roles"></el-table-column>
      <el-table-column label="Operations">
        <template scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pagination"
        :total="allPages">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

let baseURL = 'http://localhost:3000'

export default {
  data () {
    return {
      users: '',
      currentPage: 1,
      allPages: 1,
      pagination: 1
    }
  },
  methods: {
    /* handleDelete (index, row) {
      this.$confirm(`Do you want delete ${row.username}?`, 'DELETE', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'info',
        customClass: 'wsdelete'
      }).then(() => {
        axios.get(baseURL + `/api/users/delete/?id=${row.id}&currentPage=${this.currentPage}`)
          .then(res => {
            this.users = res.data.users
            this.allPages = res.data.allPages
            this.currentPage = res.data.currentPage
            this.pagination = res.data.pagination
            this.$message({
              type: 'success',
              message: `Delete ${row.username} completed`
            })
          })
      }).catch(() => {

      })
    },
    handleCurrentChange (val) {
      axios.get(baseURL + '/api/users/page/' + val)
        .then(res => {
          console.log(res.data)
          this.users = res.data.users
          this.allPages = res.data.allPages
          this.currentPage = res.data.currentPage
          this.pagination = res.data.pagination
        })
    } */
  },
  created () {
    let page = this.$route.params.page
    if (page > 0) {
      /* axios.get(baseURL + '/api/users/page/' + page)
        .then(res => {
          this.users = res.data.users
          this.allPages = res.data.allPages
          this.currentPage = res.data.currentPage
          this.pagination = res.data.pagination
        }) */
    } else {
      axios({
        method: 'get',
        url: baseURL + '/api/users',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '.concat(sessionStorage.token)
        }
      })
        .then(res => {
          console.log(res)
          this.users = res.data
        })
    }
  }
}
</script>

<style>

</style>


