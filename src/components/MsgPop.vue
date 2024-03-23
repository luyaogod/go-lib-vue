<script setup lang="ts">
import { computed, defineProps } from 'vue'

interface PopupProps {
  detail?: string
  type?: string // 新增：定义一个接受字符串类型的prop
}

const props = defineProps<PopupProps>()

const popShow = defineModel()

// 根据type计算背景颜色
const popupBgColor = computed(() => {
  switch (props.type) {
    case 'success':
      return '#07c160'
    case 'warning':
      return '#f4ac00'
    case 'danger':
      return '#ee0a24'
    default:
      return '#1989fa'
  }
})

function closeClock() {
  setTimeout(() => {
    popShow.value = false
  }, 2000)
}
</script>

<template>
  <van-popup
    :style="{ backgroundColor: popupBgColor, ...{ height: '6%' } }"
    v-model:show="popShow"
    position="top"
    :overlay="false"
    round
    @open="closeClock()"
  >
    <div class="popDetailWrap">{{ props.detail }}</div>
  </van-popup>
</template>

<style scoped>
.popDetailWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ffffff;
  font-size: 15px;
}
</style>
