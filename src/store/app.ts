import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiGetConfig } from '@/api/common'
import { SiteConfig } from '@/api/common.typings'

/**
 * 初始化配置状态
 *
 * 使用SiteConfig类型的空值作为初始化状态
 * 这样当API更新SiteConfig类型时，只需修改common.typings.ts中的定义
 */
const initConfig: SiteConfig = {
  domain: '',
  login: {
    login_way: [],
    register_way: [],
    coerce_mobile: 0,
    login_agreement: 0,
    third_auth: 0,
    wechat_auth: 0,
    qq_auth: 0,
    default_login_way: '1',
  },
  website: {
    shop_name: '',
    shop_logo: '',
    h5_favicon: '',
  },
  siteStatistics: { clarity_code: null },
  version: '',
  copyright: [],
  admin_url: '',
  unit: { power: '' },
  qrcode: { oa: '', mnp: '' },
  share_image: '',
  transaction: {
    is_buy_btn: 0,
    is_buy_btn_desc: '',
  },
  feature: {
    ai_generate_open: 0,
    hot_topic_open: 0,
    topic_recommend_open: 0,
    translate_open: 0,
  },
}

export const useAppStore = defineStore(
  'app',
  () => {
    // 定义配置信息
    const config = ref<SiteConfig>({ ...initConfig })

    // 初始化配置
    const initAppConfig = async () => {
      try {
        const res = await apiGetConfig()
        if (res && res.data) {
          config.value = res.data
          console.log('系统配置初始化成功', config.value)
        }
      } catch (error) {
        console.error('获取系统配置失败', error)
      }
    }

    // 设置配置信息
    const setConfig = (newConfig: SiteConfig) => {
      config.value = newConfig
    }

    // 重置配置信息
    const resetConfig = () => {
      config.value = { ...initConfig }
    }

    return {
      config,
      initAppConfig,
      setConfig,
      resetConfig,
    }
  },
  {
    persist: true, // 持久化存储
  },
)
