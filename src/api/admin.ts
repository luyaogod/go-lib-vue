import axio from '@/utils/requests'

//身份验证接口
export interface simpleRespose {
  status: string
  detail: string
}
export async function adminAuth(uuid: string) {
  const response = await axio.get(`/admin/admin_auth/${uuid}`)
  return response.data as simpleRespose
}

//用户列表接口
export interface userItem {
  id: number
  username: string
  uuid: string
}

export async function getUserList(uuid: string) {
  const response = await axio.get(`/admin/all_user/${uuid}`)
  return response.data as userItem[]
}

//用户创建接口
export interface createUserData {
  username: string
}

export async function createUser(uuid: string, data: createUserData) {
  const response = await axio.post(`/admin/create_user/${uuid}`, data)
  return response.data as simpleRespose
}

//用户删除接口
export async function deleteUser(uuid: string, userId: number) {
  const response = await axio.get(`/admin/delete_user/${userId}/${uuid}`)
  return response.data as simpleRespose
}
