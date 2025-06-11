import { LoginResponse, UserInfo } from './user.typings'
import { http } from '@/utils/http'

/**
 * 账号密码登录
 * @param data code: 验证码, account: 账号, email: 邮箱, password: 密码
 */
export const apiPostAccountLogin = (data: {
  code?: string
  account?: string
  email?: string
  password?: string
  scene: 1 | 2 | 3
}) => {
  return http.post<LoginResponse>('/login/account', data)
}

/**
 * 用户登录
 * @param data code: 微信小程序code
 */
export const apiPostCodeBindAccount = (data: { code: string }) => {
  return http.post<LoginResponse>('/login/codeBindAccount', data)
}

/**
 * 小程序登录/注册
 * @param data code: 微信小程序code mobile: 手机号
 */
export const apiPostMnpLogin = (data: { code: string; mobile?: string }) => {
  return http.post<LoginResponse>('/login/mnpLogin', data)
}
/**
 * 小程序获取手机号
 * @param data code: 微信小程序code
 */
export const apiGetMobileByMnp = (data: { code: string }) => {
  return http.post<LoginResponse>('/user/getMobileByMnp', data)
}

/**
 * 用户注册
 * @param data account: 账号, email: 邮箱, password: 密码 password_confirm: 密码确认码 scene: 注册方式(账号密码-3，手机验证码-2) wx_code: 微信uni.login code
 */
export const apiPostAccountRegister = (data: {
  account?: string
  email?: string
  password?: string
  password_confirm?: string
  /** 注册渠道: 1-微信小程序 2-微信公众号 3-手机H5 4-电脑PC 5-苹果APP 6-安卓APP */
  channel?: 1 | 2 | 3 | 4 | 5 | 6
  /** 终端: 1-微信小程序 2-微信公众号 3-手机H5 4-电脑PC 5-苹果APP 6-安卓APP */
  terminal?: 1 | 2 | 3 | 4 | 5 | 6
  code?: string
  // 账号密码-3，手机验证码-2
  scene: 2 | 3
  // 微信uni.login code
  wx_code: string
}) => {
  return http.post<LoginResponse>('/user/register', data)
}

export type CodeSence = 'YZMDL' | 'YZMZC' | 'BDSJHM' | 'ZHDLMM' | 'BGSJHM'
/**
 * 发送验证码
 * @param data mobile: 手机号, scene: 验证码类型(YZMDL-验证码登录，YZMZC-验证码注册，BDSJHM-绑定手机，ZHDLMM-找回密码，BGSJHM-更换手机)
 */
export const apiPostSendCode = (data: { mobile?: string; scene: CodeSence }) => {
  return http.post<[]>('/sms/sendCode', data)
}

/**
 * 重置密码
 * @param data mobile: 手机号, code: 验证码, password: 新密码, password_confirm: 确认新密码
 */
export const apiPostResetPassword = (data: {
  mobile: string
  code: string
  password: string
  password_confirm: string
}) => {
  return http.post<[]>('/user/resetPassword', data)
}

/**
 * 修改密码
 * @param data password: 新密码, password_confirm: 确认新密码, old_password: 原密码
 */
export const apiPostChangePassword = (data: {
  password: string
  password_confirm: string
  old_password: string
}) => {
  return http.post<[]>('/user/changePassword', data)
}

/**
 * 设置密码
 * @param data password: 新密码, password_confirm: 确认新密码
 */
export const apiPostSetPassword = (data: { password: string; password_confirm: string }) => {
  return http.post<[]>('/user/setPassword', data)
}

/**
 * 检查手机号是否注册
 * @param data mobile: 手机号
 */
export const apiPostCheckRegister = (data: { mobile: string }) => {
  return http.post<[]>('/login/checkRegister', data)
}

/**
 * 设置用户信息 - 单个字段
 * @param data field: 字段名, value: 值
 */
export const apiPostSetUserInfoSingle = (data: { field: 'nickname' | 'avatar'; value: string }) => {
  return http.post<[]>('/user/setInfo', data)
}

/**
 * 绑定手机号
 * @param data mobile: 手机号, code: 验证码 type: 绑定类型(bind-绑定，change-更换)
 */
export const apiPostBindMobile = (data: {
  mobile: string
  code: string
  type: 'bind' | 'change'
}) => {
  return http.post<[]>('/user/bindMobile', data)
}

/**
 * 获取用户信息
 */
export const apiGetUser = () => {
  return http.post<UserInfo>('/user/center')
}
