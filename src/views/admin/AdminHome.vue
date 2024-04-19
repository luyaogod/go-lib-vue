<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUUIDStore } from '@/stores/userInfo'
import { adminAuth } from '@/api/admin'

//校验
const router = useRouter()
const route = useRoute()
const params = ref(route.params)
const store = useUUIDStore()
const uuid = params.value.uuid as string

onMounted(() => {
  adminAuth(uuid)
    .then((ret) => {
      if (ret) {
        store.UUID = uuid
        store.saveUUID(uuid)
      } else {
        router.push('/error')
      }
    })
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
  router.push('/mario/users')
}
function bottonClickTwo() {
  isLoadingTwo.value = true
  router.push('/mario/tasks')
}
function bottonClickThree() {
  isLoadingThree.value = true
  router.push('/mario/taskRets')
}
</script>

<template>
  <div class="body">
    <tyingTools style="width: 320px" :typingSpeed="90" :text="'衣带渐宽终不悔，为伊消得人憔悴！'" />

    <van-button
      class="buttonGo"
      type="primary"
      size="large"
      block
      @click="bottonClickOne()"
      :loading="isLoadingOne"
      >用户管理</van-button
    >
    <van-button
      class="buttonGo"
      type="primary"
      size="large"
      block
      @click="bottonClickTwo()"
      :loading="isLoadingTwo"
      >令牌状态</van-button
    >
    <van-button
      class="buttonGo"
      type="primary"
      size="large"
      block
      @click="bottonClickThree()"
      :loading="isLoadingThree"
      >任务状态</van-button
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
  border-radius: 10px;
  background-color: #ffff;
}
.spanWrap {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
