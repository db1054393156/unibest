export enum ClientEnum {
  MP_WEIXIN = 1, // 微信-小程序
  OA_WEIXIN = 2, // 微信-公众号
  H5 = 3, // H5
  IOS = 5, //苹果
  ANDROID = 6, //安卓
}

const getClient = (): ClientEnum | null => {
  // #ifdef MP-WEIXIN
  return ClientEnum.MP_WEIXIN
  // #endif

  // #ifdef H5
  if (typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent)) {
    return ClientEnum.OA_WEIXIN
  }
  return ClientEnum.H5
  // #endif

  // #ifdef APP-PLUS
  const system = uni.getSystemInfoSync()
  if (system.platform === 'ios') {
    return ClientEnum.IOS
  }
  return ClientEnum.ANDROID
  // #endif

  return null
}

export const client = getClient()

/**
 * @description 判断是否为微信小程序
 * @return {boolean}
 */
export const isMPWeixinClient = (): boolean => client === ClientEnum.MP_WEIXIN

/**
 * @description 判断是否为微信公众号环境
 * @return {boolean}
 */
export const isOAWeixinClient = (): boolean => client === ClientEnum.OA_WEIXIN

/**
 * @description 判断是否为安卓App环境
 * @return {boolean}
 */
export const isAndroidApp = (): boolean => client === ClientEnum.ANDROID

/**
 * @description 判断是否为iOS App环境
 * @return {boolean}
 */
export const isIOSApp = (): boolean => client === ClientEnum.IOS

/**
 * @description 判断H5环境是否为安卓设备
 * @return {boolean}
 */
export const isAndroidBrowser = (): boolean => {
  // #ifdef H5
  const u = navigator.userAgent
  return u.includes('Android') || u.includes('Adr')
  // #endif
}

/**
 * @description 获取当前端对应的字符串标识
 * @return {string}
 */
export const getClientString = (): string => {
  if (client === ClientEnum.OA_WEIXIN) {
    return 'wechat'
  }
  if (client === ClientEnum.H5) {
    return 'jump'
  }
  return ''
}
