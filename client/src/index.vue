<template>
  <div>
    <h1>Hello, {{users}}</h1>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        users: ''
      }
    },
    created () {
      let userCheck = JSON.parse(sessionStorage.getItem('user'))
      this.users = userCheck ? userCheck.displayname : 'guest'
    }
  }
</script>
