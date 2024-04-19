<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUUIDStore } from '@/stores/userInfo'
import { userDetail, saveCookie } from '@/api/user'
import MsgPop from '@/components/MsgPop.vue'
// import { taskTimeDiff } from '@/utils/timeFunc'
//页面显示配置
const mainShow = ref(false)
const pageLoading = ref(true)

//任务可提交时间配置
// const START = [18, 20, 0, 0]
// const END = [19, 55, 0, 0]

const store = useUUIDStore()
//消息提醒组件
const showSuccess = ref(false)
const successDetail = ref('')
const showDanger = ref(false)
const dangerDetail = ref('')

function successMsg(detail: string) {
  showSuccess.value = true
  successDetail.value = detail
}

function dangerMsg(detail: string) {
  showDanger.value = true
  dangerDetail.value = detail
}

const wxurl = ref() //输入框数据
const buttonLoading = ref(false)

//倒计时组件变量与时间计算
// const time = ref()
// const ret = taskTimeDiff(START, END)
// time.value = ret
// const taskSubmitdisabled = ref(true) //按钮禁用
// if (ret === 0) {
//   taskSubmitdisabled.value = false
// } else {
//   setTimeout(function () {
//     taskSubmitdisabled.value = false
//   }, ret)
// }

//获取用户数据
const balance = ref()
function getUserInfo() {
  userDetail(store.getUUID)
    .catch(() => {
      dangerMsg('用户数据获取失败')
    })
    .then((ret) => {
      if (ret === undefined) dangerMsg('用户数据获取失败')
      else {
        pageLoading.value = false
        mainShow.value = true
        balance.value = ret.balance
      }
    })
}
//页面挂载事件
onMounted(() => {
  getUserInfo()
})

//清空输入框事件函数
function cleanInput() {
  wxurl.value = ''
}

//提交事件
function sumbit() {
  buttonLoading.value = true
  if (wxurl.value == undefined || wxurl.value == '') {
    dangerMsg('请填写微信身份链接')
    buttonLoading.value = false
  } else {
    saveCookie(wxurl.value, store.getUUID)
      .then((res) => {
        const status = res.status
        if (status == 'success') {
          successMsg('任务提交成功')
          getUserInfo()
          buttonLoading.value = false
        } else {
          dangerMsg(res.detail)
          buttonLoading.value = false
        }
      })
      .catch((error) => {
        //任务提交失败数据库环节报错
        dangerMsg(error)
        buttonLoading.value = false
      })
  }
}

const clickBack = () => history.back()
</script>

<template>
  <van-nav-bar left-text="返回" style="border-bottom: #1989fa 1px solid" @click-left="clickBack" />

  <!-- 加载样式 -->
  <div class="loadingBox" v-show="pageLoading">
    <van-loading size="30" color="#1989fa" />
  </div>

  <!-- <van-cell v-show="mainShow" title="剩余抢座次数" center>
    <template #right-icon>
      <span>{{ balance }}</span>
    </template>
  </van-cell> -->

  <div class="body" v-show="mainShow">
    <!-- <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
      可提交时间{{ START[0] }}:{{ START[1] }}-{{ END[0] }}:{{ END[1] }} 倒计时：
      <van-count-down style="color: #1989fa" :time="time" />
    </van-divider> -->

    <van-cell-group inset class="input-button">
      <van-field v-model="wxurl" label="链接" placeholder="输入身份链接" />
    </van-cell-group>
    <van-button class="cleanInput" size="large" type="primary" @click="cleanInput">
      清空输入框
    </van-button>
    <van-button
      class="submit-button"
      size="large"
      type="primary"
      @click="sumbit"
      :loading="buttonLoading"
      >保存令牌</van-button
    >
  </div>

  <MsgPop :detail="successDetail" v-model="showSuccess" type="success" />
  <MsgPop :detail="dangerDetail" v-model="showDanger" type="danger" />
</template>

<style scoped>
.body {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  background-color: transparent;
}
.input-button {
  border: 1px solid #dadee0;
  width: 100%;
  margin-bottom: 20px;
}
.submit-button {
  width: 100%;
}
h3 {
  margin-bottom: 10px;
}

.cleanInput {
  margin-bottom: 20px;
}
.loadingBox {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
