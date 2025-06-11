/**
 * 通用配置信息
 */
export type SiteConfig = {
  domain: string
  login: {
    login_way: string[]
    register_way: string[]
    coerce_mobile: number
    login_agreement: number
    third_auth: number
    wechat_auth: number
    qq_auth: number
    default_login_way: '1' | '2' | '3'
  }
  website: {
    shop_name: string
    shop_logo: string
    h5_favicon: string
  }
  siteStatistics: { clarity_code: null }
  version: string
  copyright: { key: string; value: string }[]
  admin_url: string
  unit: { power: string }
  qrcode: { oa: string; mnp: string }
  share_image: string
  // IOS 交易设置
  transaction: {
    // 是否开启 IOS 交易； 1-开启， 2-关闭
    is_buy_btn: number
    // 交易文字
    is_buy_btn_desc: string
  }
  // 首页功能菜单
  feature: {
    // AI 文案合成
    ai_generate_open: number
    // 热门话题
    hot_topic_open: number
    // 话题推荐
    topic_recommend_open: number
    // 翻译
    translate_open: number
  }
}
