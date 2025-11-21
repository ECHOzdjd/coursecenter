<template>
  <div id="app">
    <HeaderNav />
    <router-view/>
    <Footer />
  </div>
</template>

<script setup>
import HeaderNav from '@/components/layout/HeaderNav.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  background-color: #f8f9fa;
  color: #202124;
}

#app {
  min-height: 100vh;
}
</style>