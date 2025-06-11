/**
 * 账号登录返回的数据
 */
export type LoginResponse = {
  nickname: string
  sn: number
  mobile: string
  avatar: string
  token: string
}

export type WechatLoginResponse = {
  user_id: number
  tenant_id: number
  nickname: string
  token: string
  sn: number
  mobile: string
  avatar: string
  terminal: number
  expire_time: number
}

export type UserInfo = {
  id: number
  sn: number
  sex: string
  account: string
  nickname: string
  real_name: string
  avatar: string
  mobile: string
  create_time: string
  is_new_user: number
  is_auth: number
  user_money: string
  has_password: boolean
  static: { label: string; value: number }[]
}
