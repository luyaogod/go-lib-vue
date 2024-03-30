import { userAuth } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUUIDStore } from '@/stores/userInfo'
const router = useRouter()

export async function userAuthFunc(uuid: string, store: ReturnType<typeof useUUIDStore>) {
  userAuth(uuid)
    .then((res) => {
      const status = res.status
      if (status == 'success') {
        store.UUID = uuid
        store.saveUUID(uuid)
      } else router.push('/error')
    })
    .catch(() => {
      router.push(`/error`)
    })
}
