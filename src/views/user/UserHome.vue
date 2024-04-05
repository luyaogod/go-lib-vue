<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUUIDStore } from '@/stores/userInfo'
import tyingTools from '@/components/tyingTools.vue'
import { userAuth } from '@/api/user'

//用户校验
const router = useRouter()
const route = useRoute()
const params = ref(route.params)
const store = useUUIDStore()

onMounted(() => {
  const uuid = params.value.uuid as string
  if (!uuid) router.push('error')
  else {
    userAuth(uuid)
      .catch(() => {
        router.push('/error')
      })
      .then((ret) => {
        if (ret === false) router.push('/error')
        else {
          store.UUID = uuid
          store.saveUUID(uuid)
        }
      })
  }
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
    <div style="width: 100%; display: flex; align-items: center; justify-content: center">
      <tyingTools
        style="width: 320px"
        :typingSpeed="90"
        :text="'衣带渐宽终不悔，为伊消得人憔悴！'"
      />
    </div>

    <van-button
      class="buttonGo"
      type="primary"
      size="large"
      block
      @click="bottonClickOne()"
      :loading="isLoadingOne"
      >更改常用座位</van-button
    >
    <van-button
      class="buttonGo"
      type="primary"
      size="large"
      block
      @click="bottonClickTwo()"
      :loading="isLoadingTwo"
      >添加选座任务</van-button
    >
    <van-button
      class="buttonGo"
      type="primary"
      size="large"
      block
      @click="bottonClickThree()"
      :loading="isLoadingThree"
      >查看帮助文档</van-button
    >
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
