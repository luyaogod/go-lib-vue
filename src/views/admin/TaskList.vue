<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type taskItem, getTaskList, adminAuth } from '@/api/admin'
import { useRouter } from 'vue-router'
import { useUUIDStore } from '@/stores/userInfo'

//pinia
const store = useUUIDStore()
//route
const router = useRouter()

//页面加载样式
const dataListLoading = ref(true)

//身份验证数据加载
const taskList = ref<taskItem[]>([])

//挂载事件
onMounted(() => {
  const uuid = store.getUUID
  if (uuid !== '') {
    adminAuth(uuid).then((rep) => {
      if (rep === true) {
        //更新数据
        getTaskList(uuid).then((rep) => {
          taskList.value = rep
          dataListLoading.value = false
        })
      } else {
        router.push('/error')
      }
    })
  } else {
    router.push('/error')
  }
})

function getStatusType(status: number) {
  switch (status) {
    case 1:
      return 'primary'
    case 2:
      return 'success'
    case 3:
      return 'danger'
    default:
      return 'default' // 当 status 不是 1、2、3 时的默认类型
  }
}

function getStatusContent(status: number) {
  switch (status) {
    case 1:
      return 'ready'
    case 2:
      return 'success'
    case 3:
      return 'fail'
    default:
      return '' // 当 status 不是 1、2、3 时的默认内容，此处为空
  }
}

const clickBack = () => history.back()
</script>

<template>
  <div class="body">
    <van-nav-bar left-text="返回" left-arrow @click-left="clickBack" />
    <!-- 加载 -->
    <div class="loadingBox" v-show="dataListLoading">
      <van-loading size="30" color="#1989fa" />
    </div>
    <div class="taskListWrap">
      <van-cell-group>
        <van-cell
          v-for="(task, index) in taskList"
          :title="task.username"
          :label="task.add_time"
          :key="index"
          center
        >
          <template #right-icon>
            <van-tag :type="getStatusType(task.status)" size="medium">
              <div class="spanWrap">{{ getStatusContent(task.status) }}</div>
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<style scoped>
.spanWrap {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loadingBox {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
