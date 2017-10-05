<template>
  <div>
    <h1>Book List</h1>
    <el-table v-if="books" :data="books" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="Title"></el-table-column>
      <el-table-column prop="author_id" label="Author"></el-table-column>
      <el-table-column prop="category_id" label="Category"></el-table-column>
      <el-table-column prop="image" label="Image"></el-table-column>
      <el-table-column prop="published_at" label="Published Date"></el-table-column>
      <el-table-column label="Operations">
        <template scope="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">Delete Book</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios'
  let bookURL = 'http://localhost:3000/api'
  // let userURL = 'http://localhost:3003'

  export default {
    data () {
      return {
        books: [],
        currentPage: 1,
        allPages: 1,
        pagination: 1
      }
    },
    methods: {
      handleDelete (index, row) {
        this.$confirm(`Do you want delete ${row.title}?`, 'DELETE', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'info',
          customClass: 'wsdelete'
        }).then(() => {
          let options = {
            method: 'DELETE',
            url: `${bookURL}/books/${row.id}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT '.concat(sessionStorage.token),
              'Username': sessionStorage.username
            }
          }
          axios(options)
            .then(res => {
              console.log(res)
              if (res.data.data === 'delete book ok') {
                this.$message({
                  type: 'success',
                  message: `Delete ${row.title} completed. Server msg: ${res.data.data}`
                })
              }
            })
        }).catch(console.error)
      }
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
        axios.get(`${bookURL}/books/`)
          .then(res => {
            this.books = res.data.data
          }).catch(console.error)
      }
    }
  }

</script>

<style>

</style>