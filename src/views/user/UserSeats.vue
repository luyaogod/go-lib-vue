<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  userAuth,
  userAllSeat,
  type DetailItem,
  updateSeat,
  convertDetailItemsToPostSeatItems
} from '@/api/user'
import { useRouter } from 'vue-router'
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

//页面加载
const dataListLoading = ref(true)
const mainShow = ref(false) //主体显示

//router,pinia
const store = useUUIDStore()
const router = useRouter()

////座位列表
const seatList = ref<DetailItem[]>([]) //数据

function iniSeatList(): DetailItem[] {
  //未绑定初始化函数
  const dataList = [] as DetailItem[]
  let i = 0
  while (i < 6) {
    let iniSeatItem: DetailItem = {
      seat_data: {
        id: 0,
        seat_key: '',
        seat_id: 0,
        lib_id: 0
      },
      seat_lib: {
        id: 0,
        lib_name: '请选择楼层',
        lib_id: 0
      }
    }
    dataList.push(iniSeatItem)
    i++
  }
  return dataList
}

const uuid = store.getUUID
//挂载事件数据拉取
onMounted(() => {
  if (uuid === '') router.push('/error')
  else {
    userAuth(uuid)
      .catch(() => {
        router.push('error')
      }) //fail validate
      .then((ret) => {
        if (ret === false)
          router.push('error') //fail validate
        else {
          //success validate拉取数据初始化
          userAllSeat(uuid)
            .catch(() => {
              dangerMsg('用户座位获取失败，请稍后再试！')
            })
            .then((ret) => {
              if (!ret) seatList.value = iniSeatList()
              else if (ret === -1) seatList.value = iniSeatList()
              else seatList.value = ret
              //数据更新完成
              dataListLoading.value = false
              mainShow.value = true
            })
        }
      })
  }
})

//返回事件
const clickBack = () => history.back()

//更换座位相关
const libs = [
  { text: '请选择楼层', value: 0 },
  { text: '郑东校区-2楼西阅览区', value: 10073 },
  { text: '郑东校区-2楼东阅览区', value: 10065 },
  { text: '郑东校区-2楼东电子阅览区', value: 10071 },
  { text: '郑东校区-2楼西电子阅览区', value: 10072 },
  { text: '郑东校区-3楼西电子阅览区', value: 10080 },
  { text: '郑东校区-3楼东电子阅览区', value: 10081 },
  { text: '郑东校区-3楼东阅览区', value: 10082 },
  { text: '郑东校区-3楼西阅览区', value: 10083 },
  { text: '郑东校区-3楼中阅览区', value: 10084 },
  { text: '郑东校区-4楼西电子阅览区', value: 10085 },
  { text: '郑东校区-4楼东电子阅览区', value: 10086 },
  { text: '郑东校区-4楼西阅览区', value: 10087 },
  { text: '郑东校区-4楼东阅览区', value: 10088 },
  { text: '郑东校区-4楼中阅览区', value: 10089 },
  { text: '郑东校区-5楼西阅览区', value: 10090 },
  { text: '郑东校区-5楼东阅览区', value: 10091 },
  { text: '郑东校区-5楼中阅览区', value: 10092 },
  { text: '郑东校区-6楼西阅览区', value: 11019 },
  { text: '郑东校区-6楼中阅览区', value: 11033 },
  { text: '郑东校区-6楼东阅览区', value: 11040 },
  { text: '郑东校区-6楼北阅览区', value: 11300 },
  { text: '郑东校区-7楼西阅览区', value: 11054 },
  { text: '郑东校区-7楼中阅览区', value: 11061 },
  { text: '郑东校区-7楼东阅览区', value: 11068 },
  { text: '郑东校区-8楼电子西阅览区', value: 11075 },
  { text: '郑东校区-8楼东阅览区', value: 11096 },
  { text: '郑东校区-8楼西阅览区', value: 11117 },
  { text: '郑东校区-8楼中阅览室', value: 11131 },
  { text: '郑东校区-8楼电子东阅览区', value: 11138 },
  { text: '郑东校区-9楼西阅览区', value: 11082 },
  { text: '郑东校区-9楼中阅览区', value: 11103 },
  { text: '郑东校区-9楼东阅览区', value: 11124 },
  { text: '文北校区-2楼自主学习室', value: 11748 }
]
const showPicker = ref(false) //选择器显示
const clickIndex = ref(-1)

function changeLib(index: number) {
  clickIndex.value = index
  showPicker.value = true
}

interface Option {
  text: string
  value: number
}

const onConfirm = ({ selectedOptions }: { selectedOptions: Option[] }) => {
  showPicker.value = false
  seatList.value[clickIndex.value].seat_lib.lib_name = selectedOptions[0].text
  seatList.value[clickIndex.value].seat_lib.lib_id = selectedOptions[0].value
}

//提交数据
const sumbitButtonLoading = ref(false)

function dataSubmit() {
  sumbitButtonLoading.value = true
  const dataRow = seatList.value
  if (dataRow === undefined) {
    sumbitButtonLoading.value = false
    dangerMsg('出错了！数据为空')
  } else {
    const cleanData = convertDetailItemsToPostSeatItems(dataRow)
    const postdata = {
      seats: cleanData
    }
    updateSeat(store.getUUID, postdata)
      .then((rep) => {
        if (rep.status === 'success') successMsg('保存成功')
        else {
          dangerMsg(rep.detail)
        }
        sumbitButtonLoading.value = false
      })
      .catch((error) => {
        dangerMsg('保存失败')
        sumbitButtonLoading.value = false
        console.log(error)
      })
  }
}
</script>

<template>
  <div class="body">
    <van-nav-bar
      left-text="返回"
      left-arrow
      @click-left="clickBack"
      style="border-bottom: 1px solid #1989fa"
    />

    <!-- 加载样式 -->
    <div class="loadingBox" v-show="dataListLoading">
      <van-loading size="30" color="#1989fa" />
    </div>

    <div class="main" v-show="mainShow">
      <van-cell-group>
        <van-cell
          v-for="(i, index) in seatList"
          :label="i.seat_lib.lib_name"
          center
          :key="index"
          size="large"
        >
          <template #title>
            <input v-model="i.seat_data.seat_id" placeholder="请输入座位号" style="border: none" />
          </template>

          <template #right-icon>
            <van-button type="primary" size="small" @click="changeLib(index)">更换楼层</van-button>
          </template>
        </van-cell>
      </van-cell-group>

      <van-divider :style="{ color: '#ee0a24', borderColor: '#ee0a24', padding: '0 16px' }">
        必须绑定6个座位
      </van-divider>

      <van-button type="primary" block @click="dataSubmit" :loading="sumbitButtonLoading"
        >保存</van-button
      >
    </div>

    <!-- 选择器 -->
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker :columns="libs" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
  </div>

  <!-- 消息弹窗 -->
  <MsgPop :detail="successDetail" v-model="showSuccess" type="success" />
  <MsgPop :detail="dangerDetail" v-model="showDanger" type="danger" />
</template>

<style scoped>
.loadingBox {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
