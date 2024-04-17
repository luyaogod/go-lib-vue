<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { type tasrRetItem, getTaskRet, adminAuth } from '@/api/admin'
import { useRouter } from 'vue-router'
import { useUUIDStore } from '@/stores/userInfo'

//pinia
const store = useUUIDStore()
//route
const router = useRouter()
const uuid = store.getUUID
//页面加载样式
const dataListLoading = ref(true)
const dataListShow = ref(false)

//身份验证数据加载
const taskList = ref<tasrRetItem[]>([])

//分页数据偏移量
const currentPage = ref(1)

//监听分页
watch(currentPage, () => {
  dataListShow.value = false
  dataListLoading.value = true
  //更新数据
  getTaskRet(currentPage.value - 1, uuid).then((rep) => {
    taskList.value = rep
    dataListLoading.value = false
    dataListShow.value = true
  })
})

//挂载事件
onMounted(() => {
  if (uuid !== '') {
    adminAuth(uuid).then((rep) => {
      if (rep === true) {
        //更新数据
        getTaskRet(currentPage.value - 1, uuid).then((rep) => {
          taskList.value = rep
          dataListLoading.value = false
          dataListShow.value = true
        })
      } else {
        router.push('/error')
      }
    })
  } else {
    router.push('/error')
  }
})

const statusList = ref([
  {
    text: 'fail',
    type: 'danger'
  },
  {
    text: 'success',
    type: 'success'
  }
])

const clickBack = () => history.back()
</script>

<template>
  <div class="body">
    <van-nav-bar left-text="返回" left-arrow @click-left="clickBack" />
    <van-pagination v-model="currentPage" :total-items="24" :items-per-page="5" />

    <!-- 加载 -->
    <div class="loadingBox" v-show="dataListLoading">
      <van-loading size="30" color="#1989fa" />
    </div>
    <div class="taskListWrap" v-show="dataListShow">
      <van-cell-group>
        <van-cell
          v-for="(task, index) in taskList"
          :title="task.username"
          :label="task.time"
          :key="index"
          center
        >
          <template #right-icon>
            <van-tag :type="statusList[task.status].type" size="medium">
              <div class="spanWrap">{{ statusList[task.status].text }}</div>
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
