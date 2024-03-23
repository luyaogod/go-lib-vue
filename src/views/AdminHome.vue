<script setup lang="ts">
import { ref } from 'vue'
import { type userItem, adminAuth, getUserList, createUser } from '@/api/admin'
import MsgPop from '@/components/MsgPop.vue'
import { useRoute, useRouter } from 'vue-router'
import { useUUIDStore } from '@/stores/userInfo'
import { deleteUser } from '@/api/admin'

//身份校验
const router = useRouter()
const route = useRoute()
const params = ref(route.params)
const uuid = params.value.uuid as string
const store = useUUIDStore()

adminAuth(uuid)
  .then((res) => {
    const status = res.status
    //   console.log(status)

    if (status == 'success') {
      store.UUID = uuid
      store.saveUUID(uuid)
    } else router.push('/error')
  })
  .catch(() => {
    router.push(`/error`)
  })

//消息提示组件
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

//数据获取
const data = ref<userItem[]>()

function updateData() {
  getUserList(store.getUUID)
    .then((res) => {
      if (res.length > 0) {
        data.value = res
      } else {
        router.push('/error')
      }
    })
    .catch(() => {
      router.push('/error')
    })
}

updateData()

//删除处理

function deleteButton(userId: number) {
  successMsg('正在删除')
  deleteUser(store.getUUID, userId)
    .then((res) => {
      if (res.status === 'success') {
        successMsg('删除成功')
        getUserList(store.getUUID)
        updateData()
      } else {
        dangerMsg(`删除失败！${res.detail}`)
      }
    })
    .catch((error) => {
      dangerMsg(`删除失败！${error}`)
    })
}

//用户链接复制
async function copy(uuid: string) {
  const fontendLink = import.meta.env.VITE_FRONTEND_URL
  const url = `${fontendLink}/user/${uuid}`
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      successMsg('复制成功')
    } else {
      dangerMsg('复制失败')
    }
  } catch (err) {
    dangerMsg('复制失败')
  }
}

//新建用户
const showForm = ref(false)

const newUserName = ref()

function addUser() {
  showForm.value = true
}

function submitAddUser() {
  if (newUserName.value) {
    const postData = {
      username: newUserName.value
    }
    createUser(store.getUUID, postData).then((res) => {
      if (res.status === 'success') {
        showForm.value = false
        successMsg('创建成功')
        updateData()
      } else {
        dangerMsg('创建失败')
      }
    })
  } else {
    dangerMsg('用户名不为空')
  }
}
</script>

<template>
  <div class="body">
    <div class="item" v-for="i in data" :key="i.id">
      <van-cell :title="i.username" :label="i.uuid"> </van-cell>
      <div class="itemButtonWrap">
        <van-button
          square
          class="itemButton"
          type="danger"
          text="删除"
          @click="deleteButton(i.id)"
        />
        <van-button square class="itemButton" type="primary" text="复制" @click="copy(i.uuid)" />
      </div>
    </div>
  </div>
  <div class="button_wrap">
    <van-button type="primary" block @click="addUser">新建用户</van-button>
  </div>

  <van-popup class="formPop" v-model:show="showForm" position="bottom" :style="{ height: '70%' }">
    <div class="form_wrap">
      <van-field v-model="newUserName" label="用户名" placeholder="请输入用户名" />
      <van-button class="submitButton" type="primary" block @click="submitAddUser">提交</van-button>
    </div>
  </van-popup>
  <MsgPop :detail="successDetail" v-model="showSuccess" type="success" />
  <MsgPop :detail="dangerDetail" v-model="showDanger" type="danger" />
</template>

<style scoped>
.button_wrap {
  margin-top: 20px;
}
.form_wrap {
  padding: 10px;
  height: 50%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
}
.submitButton {
  margin-top: 20px;
}
.formPop {
  background-color: #f7f8fa;
}
.itemButtonWrap {
  display: flex;
  justify-content: space-between;
}
</style>
