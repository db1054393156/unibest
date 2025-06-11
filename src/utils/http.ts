import { CustomRequestOptions } from '@/interceptors/request'

enum RequestCodeEnum {
  /** 未安装 */
  NOT_INSTALL = -2,
  /** 登陆过期 */
  LOGIN_FAILURE = -1,
  /** 请求错误 */
  FAIL = 0,
  /** 请求成功 */
  SUCCESS = 1,
  /** 打开页面 */
  OPEN_NEW_PAGE = 2,
  /** 没有权限 */
  FORBIDDEN = 3,
  /** 租户不存在 */
  NOT_FOUND = 4,
}

export const http = <T>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const data = res.data as { code: RequestCodeEnum; msg: string; data: any }
          // 2.1 提取核心数据 res.data
          switch (data.code) {
            case RequestCodeEnum.SUCCESS:
              // 2.1 提取核心数据 res.data
              resolve(res.data as IResData<T>)
              break
            case RequestCodeEnum.OPEN_NEW_PAGE:
              // 打开新页面
              // #ifdef H5
              window.open(typeof data.data === 'string' ? data.data : (data.data as any).url)
              // #endif
              // #ifndef H5
              uni.showToast({
                icon: 'none',
                title: data.msg || '无法跳转新页面',
              })
              reject(res)
              // #endif
              // 打开新页面也算成功

              break
            case RequestCodeEnum.LOGIN_FAILURE:
              // 登录过期 -> 清理用户信息，跳转到登录页
              // userStore.clearUserInfo()
              // uni.navigateTo({ url: '/pages/login/login' })
              reject(res)
              break
            case RequestCodeEnum.NOT_INSTALL:
            case RequestCodeEnum.FAIL:
            case RequestCodeEnum.FORBIDDEN:
            case RequestCodeEnum.NOT_FOUND:
              // 其他错误 -> 根据后端错误信息轻提示
              !options.hideErrorToast &&
                uni.showToast({
                  icon: 'none',
                  title: data.msg || '请求错误',
                })
              reject(res)
              break
            default:
              // 未知错误
              !options.hideErrorToast &&
                uni.showToast({
                  icon: 'none',
                  title: `未知错误 ${data.code}`,
                })
              reject(res)
              break
          }
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          // userStore.clearUserInfo()
          // uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: (res.data as IResData<T>).msg || '请求错误',
            })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param header 请求头，默认为json格式
 * @returns
 */
export const httpGet = <T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    method: 'GET',
    header,
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @param header 请求头，默认为json格式
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
    header,
  })
}
/**
 * PUT 请求
 */
export const httpPut = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    data,
    query,
    method: 'PUT',
    header,
  })
}

/**
 * DELETE 请求（无请求体，仅 query）
 */
export const httpDelete = <T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    method: 'DELETE',
    header,
  })
}

http.get = httpGet
http.post = httpPost
http.put = httpPut
http.delete = httpDelete
