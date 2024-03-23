<script setup lang="ts">
import { ref } from 'vue'
// import { showToast } from 'vant'
// import { showSuccessToast, showFailToast } from 'vant'
import { useUUIDStore } from '@/stores/userInfo'
import { useRouter } from 'vue-router'
import { submitTask } from '@/api/user'
import MsgPop from '@/components/MsgPop.vue'

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
const router = useRouter()
const store = useUUIDStore()
const buttonLoading = ref(false)

if (store.getUUID) {
  undefined
} else {
  router.push('/error')
}

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
    submitTask(wxurl.value, store.getUUID)
      .then((res) => {
        const status = res.status
        if (status == 'success') {
          successMsg('任务提交成功')
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
</script>

<template>
  <div class="body">
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
      提交时间为：18:00-20:00否则无效
    </van-divider>

    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
      提交任务前需确保已在本站绑定常用座位
    </van-divider>

    <van-divider :style="{ color: '#f34824', borderColor: '#f34824', padding: '0 16px' }">
      请勿重复提交任务
    </van-divider>

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
      >提交抢座任务</van-button
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
  height: 80vh;
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

.textHeader {
  margin-top: 30vh;
}

.cleanInput {
  margin-bottom: 20px;
}
</style>
