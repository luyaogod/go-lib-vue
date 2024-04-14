<script setup lang="ts">
const clickBack = () => history.back()
</script>

<template>
  <van-nav-bar left-text="返回" left-arrow @click-left="clickBack" />

  <div class="body">
    <h1 class="text">帮助文档</h1>
    <a
      class="teacherLink"
      href="https://www.yuque.com/luyao-sxof0/delwcn/lc7i6cilay0r1hb0?singleDoc# 《选座教程》"
      target="_blank"
      >点击查看教程</a
    >
  </div>
</template>

<style scoped>
.body {
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.text {
  margin-bottom: 20px;
}
</style>
