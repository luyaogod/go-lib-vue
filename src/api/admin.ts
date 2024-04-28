import axio from '@/utils/requests'

//身份验证接口
export interface simpleRespose {
  status: string
  detail: string
}

export async function adminAuth(uuid: string): Promise<boolean> {
  try {
    const rep = await axio.get(`/admin/admin_auth/${uuid}`)
    const data = rep.data as simpleRespose
    if (data.status === 'success') return true
    return false
  } catch (error) {
    return false
  }
}

//用户列表接口
export interface userItem {
  id: number
  username: string
  uuid: string
  balance: number
}

export async function getUserList(uuid: string): Promise<userItem[]> {
  try {
    const rep = await axio.get(`/admin/all_user/${uuid}`)
    return rep.data as userItem[]
  } catch {
    return []
  }
}

//用户创建接口
export interface createUserData {
  username: string
  balance: number
}

export async function createUser(uuid: string, data: createUserData): Promise<boolean> {
  try {
    const response = await axio.post(`/admin/create_user/${uuid}`, data)
    const rep = response.data as simpleRespose
    if (rep.status === 'success') {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

//用户删除接口
export async function deleteUser(uuid: string, userId: number): Promise<boolean> {
  try {
    const response = await axio.get(`/admin/delete_user/${userId}/${uuid}`)
    const rep = response.data as simpleRespose
    if (rep.status === 'success') return true
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}

//用户更新接口
export interface updateUserData {
  id: number
  username: string
  balance: number
}

export async function updateUser(uuid: string, data: updateUserData): Promise<boolean> {
  try {
    const postData = {
      username: data.username,
      balance: data.balance
    }
    const response = await axio.post(`/admin/update_user/${data.id}/${uuid}`, postData)
    const rep = response.data as simpleRespose
    if (rep.status === 'success') return true
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}

//任务列表接口
export interface taskItem {
  user_id: number
  id: number
  open: boolean
  status: number
  add_time: string
  username: string
}

export async function getTaskList(uuid: string): Promise<taskItem[]> {
  try {
    const rep = await axio.get(`/admin/all_tasks/${uuid}`)
    return rep.data as taskItem[]
  } catch {
    return []
  }
}

//任务状态列表接口状态
export interface tasrRetItem {
  user_id: number
  id: number
  status: number
  time: string
  username: string
}

export async function getTaskRet(offset: number, uuid: string): Promise<tasrRetItem[]> {
  try {
    const rep = await axio.get(`/admin/task_ret/${offset}/${uuid}`)
    return rep.data as tasrRetItem[]
  } catch {
    return []
  }
}
