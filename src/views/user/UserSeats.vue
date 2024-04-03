<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUUIDStore } from '@/stores/userInfo'
import { ref } from 'vue'
import {
  userAllSeat,
  type DetailItem,
  updateSeat,
  convertDetailItemsToPostSeatItems
} from '@/api/user'
import MsgPop from '@/components/MsgPop.vue'

const store = useUUIDStore()
const router = useRouter()
//消息提示组件
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

//初始用户座位数据请求

const useResponse = ref<DetailItem[]>()

const newUser: DetailItem[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
]

userAllSeat(store.getUUID)
  .then((res) => {
    if (res.status == 'success') {
      useResponse.value = res.detail
    } else {
      useResponse.value = newUser
    }
  })
  .catch((error) => {
    useResponse.value = []
    dangerMsg(`出错了！${error}`)
  })

//更改座位
const columns = [
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
const showPicker = ref(false)
const clickIndex = ref()

function changeLib(index: number) {
  clickIndex.value = index
  showPicker.value = true
  console.log('修改按钮')
  console.log(index)
  if (useResponse.value !== undefined) {
    console.log(useResponse.value[index].seat_lib.lib_id)
    console.log(useResponse.value[index].seat_lib.lib_name)
  } else dangerMsg('数据不存在')
}

interface Option {
  text: string
  value: number
}

const onConfirm = ({ selectedOptions }: { selectedOptions: Option[] }) => {
  showPicker.value = false
  if (useResponse.value !== undefined) {
    console.log('selectedOptions-', selectedOptions)

    useResponse.value[clickIndex.value].seat_lib.lib_name = selectedOptions[0].text
    useResponse.value[clickIndex.value].seat_lib.lib_id = selectedOptions[0].value
    console.log(useResponse.value)
  } else dangerMsg('数据不存在')
}

//提交数据
const sumbitButtonLoading = ref(false)

function dataSubmit() {
  sumbitButtonLoading.value = true
  const dataRow = useResponse.value
  if (dataRow !== undefined) {
    const cleanData = convertDetailItemsToPostSeatItems(dataRow)
    console.log(cleanData)
    const postdata = {
      seats: cleanData
    }
    console.log('postdata', postdata)

    //更新
    updateSeat(store.getUUID, postdata)
      .then((rep) => {
        if (rep.status === 'success') {
          sumbitButtonLoading.value = false
          successMsg('保存成功')
          router.push('/user-seats')
          //刷新数据
        } else {
          sumbitButtonLoading.value = false
          dangerMsg(`保存失败${rep.detail}`)
        }
      })
      .catch((error) => {
        sumbitButtonLoading.value = false
        dangerMsg(`出错了！${error}`)
      })
  } else {
    sumbitButtonLoading.value = false
    dangerMsg('出错了！数据为空')
  }
}

const clickBack = () => history.back()
</script>

<template>
  <div class="body">
    <van-nav-bar left-text="返回" left-arrow @click-left="clickBack" />
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
      常用座位绑定
    </van-divider>

    <div class="main_content">
      <div class="item" v-for="(i, index) in useResponse" :key="index">
        <van-cell-group inset>
          <van-cell :title="`常用座位${index + 1}`" :value="i.seat_lib.lib_name" />
          <van-field v-model="i.seat_data.seat_id" center label="座位号" placeholder="请输入座位号">
            <template #button>
              <van-button size="small" type="primary" @click="changeLib(index)"
                >更改楼层</van-button
              >
            </template>
          </van-field>
        </van-cell-group>
      </div>
    </div>

    <van-divider :style="{ color: '#f34824', borderColor: '#f34824', padding: '0 16px' }">
      必须绑满6个座位
    </van-divider>

    <div class="button_wrap">
      <van-button
        class="submit_button"
        type="success"
        @click="dataSubmit"
        :loading="sumbitButtonLoading"
        >保存设置</van-button
      >
    </div>
  </div>

  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
  </van-popup>

  <MsgPop :detail="successDetail" v-model="showSuccess" type="success" />
  <MsgPop :detail="dangerDetail" v-model="showDanger" type="danger" />
</template>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
}
.main_content {
  flex-grow: 1;
}
.item {
  margin-bottom: 10px;
}
.button_wrap {
  margin-top: 30px;
  width: 100%;
  /* padding: 10px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.submit_button {
  width: 90%;
}
</style>
