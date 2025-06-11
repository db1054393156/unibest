import { logout as _logout, getWxCode } from '@/api/login'
import {
  apiGetUser as _getUserInfo,
  apiPostAccountLogin as _login,
  apiPostMnpLogin as _wxLogin,
} from '@/api/user'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from '@/utils/toast'
import type { UserInfo } from '@/api/user.typings'

// 初始化状态
const userInfoState: UserInfo = {
  id: 0,
  sn: 0,
  sex: '未知',
  account: '',
  nickname: '',
  real_name: '',
  avatar: '/static/images/default-avatar.png',
  mobile: '',
  create_time: '',
  is_new_user: 0,
  is_auth: 0,
  user_money: '0',
  has_password: false,
  static: [],
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<UserInfo>({ ...userInfoState })
    const token = ref(uni.getStorageSync('token') || '')
    // 用户是否登录
    const isLogin = computed(() => !!token.value)
    const setToken = (t: string) => {
      token.value = t
      uni.setStorageSync('token', t)
    }
    // 设置用户信息
    const setUserInfo = (val: UserInfo) => {
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.avatar) {
        val.avatar = userInfoState.avatar
      } else {
        val.avatar = 'https://oss.laf.run/ukw0y1-site/avatar.jpg?feige'
      }
      userInfo.value = val
      console.log('userInfo', userInfo.value)
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
      console.log('设置用户头像', avatar)
      console.log('userInfo', userInfo.value)
    }
    // 删除用户信息
    const removeUserInfo = () => {
      userInfo.value = { ...userInfoState }
      token.value = ''
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
    }
    /**
     * 用户登录
     * @param credentials 登录参数
     * @returns R<IUserLogin>
     */
    const login = async (credentials: {
      account?: string
      password?: string
      code?: string
      scene: 1 | 2 | 3
    }) => {
      const res = await _login(credentials)
      console.log('登录信息', res)
      setToken(res.data.token)
      toast.success('登录成功')
      await getUserInfo()
      return res
    }
    /**
     * 获取用户信息
     */
    const getUserInfo = async () => {
      const res = await _getUserInfo()
      const userInfoData = res.data
      setUserInfo(userInfoData)
      uni.setStorageSync('userInfo', userInfoData)
      // TODO 这里可以增加获取用户路由的方法 根据用户的角色动态生成路由
      return res
    }
    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      await _logout()
      removeUserInfo()
    }
    /**
     * 微信登录
     */
    const wxLogin = async (credentials: { code: string; mobile?: string }) => {
      const res = await _wxLogin(credentials)
      setToken(res.data.token)
      await getUserInfo()
      return res
    }

    return {
      userInfo,
      isLogin,
      token,
      login,
      wxLogin,
      getUserInfo,
      setUserAvatar,
      logout,
      setToken,
    }
  },
  {
    persist: true,
  },
)
