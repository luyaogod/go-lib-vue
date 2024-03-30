<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userAuthFunc } from '@/utils/userAuth'
import { useUUIDStore } from '@/stores/userInfo'
import tyingTools from '@/components/tyingTools.vue'

//用户校验
const router = useRouter()
const route = useRoute()
const params = ref(route.params)
const store = useUUIDStore()

onMounted(() => {
  const uuid = params.value.uuid as string
  userAuthFunc(uuid, store)
    .then(() => {})
    .catch(() => {
      router.push('/error')
    })
})

//按钮事件
const isLoadingOne = ref(false)
const isLoadingTwo = ref(false)
const isLoadingThree = ref(false)

function bottonClickOne() {
  isLoadingOne.value = true
  router.push('/user-seats')
}
function bottonClickTwo() {
  isLoadingTwo.value = true
  router.push('/user-task')
}
function bottonClickThree() {
  isLoadingThree.value = true
  router.push('/help')
}
</script>

<template>
  <div class="body">
    <!-- <h3>衣带渐宽终不悔，为伊消得人憔悴！</h3> -->

    <div class="main_warp">
      <tyingTools :text="'衣带渐宽终不悔，为伊消得人憔悴！'" />

      <van-button
        class="buttonGo"
        type="primary"
        size="large"
        @click="bottonClickOne()"
        :loading="isLoadingOne"
        >更改常用座位</van-button
      >
      <van-button
        class="buttonGo"
        type="primary"
        size="large"
        @click="bottonClickTwo()"
        :loading="isLoadingTwo"
        >添加选座任务</van-button
      >
      <van-button
        class="buttonGo"
        type="primary"
        size="large"
        @click="bottonClickThree()"
        :loading="isLoadingThree"
        >查看帮助文档</van-button
      >
    </div>
  </div>
</template>

<style scoped>
.body {
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: transparent;
}
.buttonGo {
  margin-bottom: 25px;
  width: 95%;
}
.main_warp {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* padding: 40px; */
  border-radius: 10px;
  background-color: #ffff;
}
</style>
