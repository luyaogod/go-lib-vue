<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  type userItem,
  type createUserData,
  type updateUserData,
  getUserList,
  createUser,
  deleteUser,
  adminAuth,
  updateUser
} from '@/api/admin'
import MsgPop from '@/components/MsgPop.vue'
import { useRoute, useRouter } from 'vue-router'
import { useClipboard } from '@vueuse/core'
import { useUUIDStore } from '@/stores/userInfo'

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
//pinia
const store = useUUIDStore()
//route
const router = useRouter()
const route = useRoute()

//页面加载样式
const dataListLoading = ref(true)

//身份验证数据加载
const uuid = route.params.uuid as string
const userList = ref<userItem[]>([]) //列表数据

//挂载事件
onMounted(() => {
  adminAuth(uuid).then((rep) => {
    if (rep === true) {
      //保存uuid
      store.UUID = uuid
      store.saveUUID(uuid)
      //更新数据
      getUserList(uuid).then((rep) => {
        userList.value = rep
        dataListLoading.value = false
      })
    } else {
      router.push('/error')
    }
  })
})

//折叠面板操作变量
const activeName = ref()

//底部弹窗显示变量
const showAddUserPop = ref(false)
const showUpdateUserPop = ref(false)
const showDeleteUserPop = ref(false)

//添加用户和前往任务列表
function addUserButton() {
  showAddUserPop.value = true
}
function goTaskPage() {
  router.push('/mario/tasks')
}

//用户删除确定和取消按钮事件函数
const deleteUserSureButtonLoading = ref(false)
function deleteUserSure() {
  deleteUserSureButtonLoading.value = true
  const index = activeName.value
  const userId = userList.value[index].id
  deleteUser(uuid, userId).then((rep) => {
    if (rep === true) {
      //更新数据
      getUserList(uuid).then((rep) => {
        userList.value = rep
        deleteUserSureButtonLoading.value = false
        showDeleteUserPop.value = false
        successMsg('删除成功')
      })
    } else {
      deleteUserSureButtonLoading.value = false
      dangerMsg('删除失败')
    }
  })
}

function deleteUserCancel() {
  showDeleteUserPop.value = false
}

//新建用户表单提交
const createUserSubmitButtonLoading = ref(false)
const createUserStore = ref<createUserData>({ username: '', balance: 30 })
function addUserSubmit() {
  createUserSubmitButtonLoading.value = true
  createUser(uuid, createUserStore.value).then((ret) => {
    if (ret === true) {
      //新建成功更新数
      getUserList(uuid).then((rep) => {
        userList.value = rep
        dataListLoading.value = false
        //更新成功关闭弹窗
        createUserSubmitButtonLoading.value = false
        showAddUserPop.value = false
        successMsg('添加成功')
      })
    } else {
      createUserSubmitButtonLoading.value = false
      dangerMsg('添加失败')
    }
  })
}

//更新用户表单提交
const updateUserStore = ref<updateUserData>({ id: -1, username: '', balance: 0 })
const updateUserSubmitButtonLoading = ref(false)
function updateUserSubmit() {
  updateUserSubmitButtonLoading.value = true
  const index = activeName.value
  const postData = userList.value[index]
  updateUser(uuid, postData).then((ret) => {
    if (ret === true) {
      //删除成功更新数
      getUserList(uuid).then((rep) => {
        userList.value = rep
        dataListLoading.value = false
        //更新成功关闭弹窗
        updateUserSubmitButtonLoading.value = false
        showUpdateUserPop.value = false
        successMsg('更新成功')
      })
    } else {
      updateUserSubmitButtonLoading.value = false
      dangerMsg('更新失败')
    }
  })
  updateUser
}

//列表内三个按钮事件函数
function updateUserButton() {
  showUpdateUserPop.value = true
  const index = activeName.value
  updateUserStore.value = userList.value[index]
}
function deleteUserButton() {
  showDeleteUserPop.value = true
  console.log(activeName.value)
}
//复制按钮
const source = ref('Hello')
const { copy, isSupported } = useClipboard({ source })

function copyUrlButton() {
  if (!isSupported.value) {
    dangerMsg('浏览器不支持')
  } else {
    const index = activeName.value
    const baseUrl = import.meta.env.VITE_WEBSITE_UTL
    source.value = `${baseUrl}/user/${userList.value[index].uuid}`
    copy(source.value)
    // successMsg('复制成功')
  }
}
</script>

<template>
  <div class="body">
    <div class="topButtonWrap">
      <van-cell center>
        <template #title>
          <van-button icon="plus" type="primary" @click="addUserButton" />
        </template>
        <template #right-icon>
          <div class="goTaskArrowWrap" @click="goTaskPage">
            <van-icon name="arrow" size="20" />
          </div>
        </template>
      </van-cell>

      <!-- <div class="itemButton">
        <van-button type="primary" block @click="goTaskPage">任务列表</van-button>
      </div> -->
    </div>
    <!-- 加载 -->
    <div class="loadingBox" v-show="dataListLoading">
      <van-loading size="30" color="#1989fa" />
    </div>

    <div class="userListWrap">
      <van-collapse style="width: 100%" v-model="activeName" accordion>
        <div class="itemWrap" v-for="(i, index) in userList" :key="index">
          <van-collapse-item :title="`${i.username} ${i.balance}`" :name="index">
            <div class="itemDetail">
              <span>{{ i.uuid }}</span>
            </div>

            <div class="itemButtonWrap">
              <div class="itemButton">
                <van-button plain type="primary" block @click="copyUrlButton">复制</van-button>
              </div>
              <div class="itemButton">
                <van-button type="default" block @click="updateUserButton">更新</van-button>
              </div>
              <div class="itemButton">
                <van-button type="default" block @click="deleteUserButton">删除</van-button>
              </div>
            </div>
          </van-collapse-item>
        </div>
      </van-collapse>
    </div>
  </div>

  <!-- 新建用户表单 -->
  <van-popup v-model:show="showAddUserPop" position="bottom" :style="{ height: '30%' }">
    <div class="popDetailWrap">
      <van-field v-model="createUserStore.username" label="用户名" placeholder="请输入用户名" />
      <van-field v-model="createUserStore.balance" label="余额" placeholder="请输入余额" />
    </div>
    <div class="itemButton" style="width: 100%">
      <van-button
        plain
        type="primary"
        block
        @click="addUserSubmit"
        style="margin-top: 40px"
        :loading="createUserSubmitButtonLoading"
        >提交</van-button
      >
    </div>
  </van-popup>

  <!-- 更新用户表单 -->
  <van-popup v-model:show="showUpdateUserPop" position="bottom" :style="{ height: '30%' }">
    <div class="popDetailWrap">
      <van-field v-model="updateUserStore.username" label="用户名" placeholder="请输入用户名" />
      <van-field v-model="updateUserStore.balance" label="余额" placeholder="请输入余额" />
    </div>

    <div class="itemButton" style="width: 100%">
      <van-button
        plain
        type="primary"
        block
        @click="updateUserSubmit"
        style="margin-top: 40px"
        :loading="updateUserSubmitButtonLoading"
        >提交</van-button
      >
    </div>
  </van-popup>

  <!-- 删除用户确定 -->
  <van-popup v-model:show="showDeleteUserPop" position="bottom" :style="{ height: '30%' }">
    <div class="popDetailWrap deleteSurePopWrap">
      <div class="itemButton" style="width: 100%">
        <van-button
          plain
          type="danger"
          block
          @click="deleteUserSure"
          :loading="deleteUserSureButtonLoading"
          >确定</van-button
        >
      </div>

      <div class="itemButton" style="width: 100%">
        <van-button plain type="primary" block @click="deleteUserCancel">取消</van-button>
      </div>
    </div>
  </van-popup>

  <MsgPop :detail="successDetail" v-model="showSuccess" type="success" />
  <MsgPop :detail="dangerDetail" v-model="showDanger" type="danger" />
</template>

<style scoped>
.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.goTaskArrowWrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.userListWrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.itemButtonWrap {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.itemButton {
  margin-bottom: 20px;
}

.itemTitleWrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.itemDetail {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.topButtonWrap {
  width: 100%;
  border-bottom: 1px solid #1989fa;
}

.popDetailWrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.deleteSurePopWrap {
  height: 80%;
}

.loadingBox {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
