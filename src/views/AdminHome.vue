<script setup lang="ts">
import { ref } from 'vue'
import { type userItem, getUserList, createUser } from '@/api/admin'
import MsgPop from '@/components/MsgPop.vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteUser, adminAuth, updateUser } from '@/api/admin'

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

//身份校验
const router = useRouter()
const route = useRoute()
const params = ref(route.params)
const uuid = params.value.uuid as string
const data = ref<userItem[]>()
const fontendLink = import.meta.env.VITE_WEBSITE_UTL

function updateData(uuid: string) {
  getUserList(uuid)
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

adminAuth(uuid)
  .then((res) => {
    const status = res.status
    if (status == 'success') {
      updateData(uuid)
    } else router.push('/error')
  })
  .catch(() => {
    router.push(`/error`)
  })

//删除处理
function deleteButton(userId: number) {
  successMsg('正在删除')
  deleteUser(uuid, userId)
    .then((res) => {
      if (res.status === 'success') {
        successMsg('删除成功')
        getUserList(uuid)
        updateData(uuid)
      } else {
        dangerMsg(`删除失败！${res.detail}`)
      }
    })
    .catch((error) => {
      dangerMsg(`删除失败！${error}`)
    })
}

//新建用户
const showFormCreate = ref(false)
const newUserName = ref()
const newUserBalance = ref(30)

function addUser() {
  showFormCreate.value = true
}

function submitAddUser() {
  if (newUserName.value) {
    const postData = {
      username: newUserName.value,
      balance: newUserBalance.value
    }
    createUser(uuid, postData).then((res) => {
      if (res.status === 'success') {
        showFormCreate.value = false
        successMsg('创建成功')
        updateData(uuid)
      } else {
        dangerMsg('创建失败')
      }
    })
  } else {
    dangerMsg('用户名不为空')
  }
}

//更新用户
const updateUserId = ref()
const showFormUpdate = ref(false)
const updateUserName = ref('')
const updateBalance = ref(30)

function updateButton(userData: userItem) {
  updateUserName.value = userData.username
  updateUserId.value = userData.id
  updateBalance.value = userData.balance
  showFormUpdate.value = true
}

function updateConfirm() {
  const postData = {
    username: updateUserName.value,
    balance: updateBalance.value
  }
  updateUser(uuid, updateUserId.value, postData)
    .then((rep) => {
      if (rep.status === 'success') {
        successMsg('更新成功')
        showFormUpdate.value = false
        updateData(uuid)
      } else {
        dangerMsg('数据更新失败')
      }
    })
    .catch((error) => {
      dangerMsg(`数据更新失败:${error}`)
    })
}
</script>

<template>
  <div class="body">
    <div class="item" v-for="i in data" :key="i.id">
      <van-cell :title="`${i.username} ${i.balance}`" :label="`${fontendLink}/user/${i.uuid}`">
      </van-cell>
      <div class="buttonWrap">
        <div class="itemButtonWrap">
          <van-button
            square
            class="itemButton"
            type="danger"
            text="删除"
            @click="deleteButton(i.id)"
          />
        </div>
        <div class="itemButtonWrap">
          <van-button
            square
            class="itemButton"
            type="success"
            text="更新"
            @click="updateButton(i)"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="button_wrap">
    <van-button type="primary" block @click="addUser">新建用户</van-button>
  </div>

  <van-popup
    class="formPop"
    v-model:show="showFormCreate"
    position="bottom"
    :style="{ height: '70%' }"
  >
    <div class="form_wrap">
      <van-field v-model="newUserName" label="用户名" placeholder="请输入用户名" />
      <van-field v-model="newUserBalance" label="余额" placeholder="请输入次数" />
      <van-button class="submitButton" type="primary" block @click="submitAddUser">提交</van-button>
    </div>
  </van-popup>

  <van-popup
    class="formPop"
    v-model:show="showFormUpdate"
    position="bottom"
    :style="{ height: '70%' }"
  >
    <div class="form_wrap">
      <van-field v-model="updateUserName" label="用户名" placeholder="请输入用户名" />
      <van-field v-model="updateBalance" label="余额" placeholder="请输入次数" />
      <van-button class="submitButton" type="primary" block @click="updateConfirm">提交</van-button>
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
  margin-right: 10px;
}
.buttonWrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
