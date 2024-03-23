import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUUIDStore = defineStore('mytoken', () => {
  const UUID = ref('')

  const getUUID = computed(() => {
    console.log(UUID.value)

    console.log(window.localStorage.getItem('UUID'))

    return UUID.value || window.localStorage.getItem('UUID') || ''
  })

  function saveUUID(data: string) {
    window.localStorage.setItem('UUID', data)
  }

  return { UUID, getUUID, saveUUID }
})
