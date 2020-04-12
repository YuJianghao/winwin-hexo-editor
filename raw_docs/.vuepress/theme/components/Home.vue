<template>
<div>
  <iframe :src="$withBase('home.html')" frameborder="0" style="position:fixed;width:100vw;height:100vh;z-index:10000"></iframe>
</div>
</template>

<script>
export default {
  name:'Home'
}
</script>
<style lang="css" scoped>
a.start{
  z-index: 10001;
  display: inline-block;
  padding: 7px 40px;
  margin-top: 30px;
  background: #4172cf;
  color: #f5f5f5;
  font-size: 24px;
  text-decoration: none;
}
</style>