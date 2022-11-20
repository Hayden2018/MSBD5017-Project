<template>
  <h1 > Welcome {{name}}</h1>
</template>

<script setup>
let name = localStorage.getItem("username")
</script>

<style scoped>

</style>