import axio from '@/utils/requests'

//用户认证接口
export interface userInfo {
  id: number
  uuid: string
  username: string
  balance: number
}

export interface userAuthResponse {
  status: string
  detail: userInfo
}

export async function userAuth(uuid: string) {
  try {
    const response = await axio.get(`/user/get_user/${uuid}`)
    const data = response.data as userAuthResponse
    if (data.status === 'success') return true
    else return false
  } catch (error) {
    return false
  }
}

export async function userDetail(uuid: string): Promise<userInfo | undefined> {
  try {
    const response = await axio.get(`/user/get_user/${uuid}`)
    const data = response.data as userAuthResponse
    if (data.status === 'success') return data.detail as userInfo
    else return undefined
  } catch (error) {
    return undefined
  }
}

//用户座位信息接口
export interface SeatData {
  id: number
  seat_key: string
  seat_id: number
  lib_id: number
}

export interface SeatLib {
  id: number
  lib_name: string
  lib_id: number
}

export interface DetailItem {
  seat_data: SeatData
  seat_lib: SeatLib
}

export interface Response {
  status: string
  detail: DetailItem[]
}

export async function userAllSeat(uuid: string): Promise<DetailItem[] | -1> {
  const response = await axio.get(`/user/get_all_lib/${uuid}`)
  const data = response.data as Response
  try {
    if (data.status === 'success') {
      return data.detail
    } else return -1 //error
  } catch (error) {
    return -1 //error
  }
}

//更新座位列表接口
export interface simpleRespose {
  status: string
  detail: string
}

export interface postSeatItem {
  lib_id: number
  seat_name_id: number
}

export interface postSeatData {
  seats: postSeatItem[]
}

export async function updateSeat(uuid: string, data: postSeatData) {
  const response = await axio.post(`/user/update_seat_list/${uuid}`, data)
  return response.data as simpleRespose
}

//数据处理
export function convertDetailItemsToPostSeatItems(detailItems: DetailItem[]): postSeatItem[] {
  return detailItems.map((detailItem) => ({
    lib_id: detailItem.seat_lib.lib_id,
    seat_name_id: detailItem.seat_data.seat_id
  }))
}

//提交任务
export async function submitTask(url: string, uuid: string) {
  const postData = {
    wx_url: url
  }
  const response = await axio.post(`/user/add_task/${uuid}`, postData)
  return response.data as simpleRespose
}
