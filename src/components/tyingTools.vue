// Typewriter.vue
<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue'

interface Props {
  text: string
  typingSpeed: number // 打字速度，单位毫秒
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  typingSpeed: 100
})

const displayedText = ref('')
const { text, typingSpeed } = toRefs(props)

let currentCharacterIndex = 0

onMounted(() => {
  function type() {
    if (currentCharacterIndex < text.value.length) {
      displayedText.value += text.value.charAt(currentCharacterIndex)
      currentCharacterIndex++
      setTimeout(type, typingSpeed.value)
    }
  }

  type()
})
</script>

<template>
  <div class="typewriter">
    <p v-text="displayedText"></p>
  </div>
</template>

<style scoped>
.typewriter {
  font-weight: 400;
  font-size: 20px;
  color: #34495e;
}
</style>
