<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUUIDStore } from '@/stores/userInfo'
import { user_task, switchTaskStatus, userDetail } from '@/api/user'
import MsgPop from '@/components/MsgPop.vue'

//消息提醒组件
const showSuccess = ref(false)
const successDetail = ref('')
const showDanger = ref(false)
const dangerDetail = ref('')

// function successMsg(detail: string) {
//   showSuccess.value = true
//   successDetail.value = detail
// }

function dangerMsg(detail: string) {
  showDanger.value = true
  dangerDetail.value = detail
}

//用户校验与数据获取
const router = useRouter()
const route = useRoute()
const params = ref(route.params)
const store = useUUIDStore()
const uuid = params.value.uuid as string
const showStatusText = ref(false)
const userTaskStatus = ref(0) //任务状态
const checked = ref(false) //任务开关Status
const balance = ref()
const statusList = ref([
  {
    text: '令牌失效',
    type: 'danger'
  },
  {
    text: '令牌有效',
    type: 'success'
  }
])

//用户任务数据请求函数
function task_pull() {
  user_task(uuid)
    .catch(() => {
      dangerMsg('任务数据获取失败！')
    })
    .then((rep) => {
      console.log(rep)

      if (!rep) {
        userTaskStatus.value = 0 //用户无任务状态设置为失效
        checked.value = false
        showStatusText.value = true
      } else {
        userTaskStatus.value = rep.status
        checked.value = rep.open
        showStatusText.value = true
      }
    })
}

onMounted(() => {
  if (!uuid) router.push('error')
  else {
    userDetail(uuid)
      .catch(() => {
        router.push('/error')
      })
      .then((rep) => {
        if (rep === undefined || rep === null) {
          router.push('/error')
        } else {
          balance.value = rep.balance
          store.UUID = uuid
          store.saveUUID(uuid)
          //请求用户任务数据
          task_pull()
        }
      })
  }
})

//按钮切换事件
function onUpdateValue() {
  const checkedStroe = checked.value //存储按钮初始状态
  showStatusText.value = false
  switchTaskStatus(uuid).then((result) => {
    if (result === true) {
      //更新数据
      task_pull()
    } else {
      //切换失败返回初始状态
      checked.value = checkedStroe
      dangerMsg('切换失败')
    }
  })
}

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
  <van-cell
    size="large"
    title="单元格"
    center
    style="height: 50px; border-bottom: #1989fa 1px solid"
  >
    <template #title>
      <van-loading size="24" v-show="!showStatusText" color="#1989fa" />
      <van-tag v-show="showStatusText" :type="statusList[userTaskStatus].type" size="medium">
        <div class="spanWrap">{{ statusList[userTaskStatus].text }}</div>
      </van-tag>
    </template>

    <template #right-icon>
      <van-switch v-model="checked" @update:model-value="onUpdateValue" size="22px" />
    </template>
  </van-cell>

  <div class="body">
    <tyingTools style="width: 320px" :typingSpeed="90" :text="'衣带渐宽终不悔，为伊消得人憔悴！'" />

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
      >更新选座令牌</van-button
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

  <van-divider
    :style="{
      color: '#1989fa',
      borderColor: '#1989fa',
      padding: '0 16px'
    }"
  >
    剩余次数：{{ balance }}
  </van-divider>
  <MsgPop :detail="successDetail" v-model="showSuccess" type="success" />
  <MsgPop :detail="dangerDetail" v-model="showDanger" type="danger" />
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
.spanWrap {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
