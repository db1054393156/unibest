import { SiteConfig } from './common.typings'
import { http } from '@/utils/http'
/**
 * 获取通用配置
 * @returns SiteConfig 通用配置
 */
export const apiGetConfig = () => {
  return http.get<SiteConfig>('/index/config')
}
