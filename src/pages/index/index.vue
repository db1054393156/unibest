<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view
    class="bg-white overflow-hidden pt-2 px-4"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  >
    <view class="mt-12">
      <image src="/static/logo.svg" alt="" class="w-28 h-28 block mx-auto" />
    </view>
    <view class="text-center text-4xl main-title-color mt-4">unibest</view>
    <view class="text-center text-2xl mt-2 mb-8">最好用的 uniapp 开发模板</view>

    <view class="text-justify max-w-100 m-auto text-4 indent mb-2">{{ description }}</view>
    <view class="text-center mt-8">
      当前平台是：
      <text class="text-green-500">{{ PLATFORM.platform }}</text>
    </view>
    <view class="text-center mt-4">
      模板分支是：
      <text class="text-green-500">base</text>
    </view>
    <view class="text-center mt-4" v-if="appStore.config.website.shop_name">
      网站名称：
      <text class="text-blue-500">{{ appStore.config.website.shop_name }}</text>
    </view>
    <view class="text-center mt-4" v-if="appStore.config.version">
      系统版本：
      <text class="text-blue-500">{{ appStore.config.version }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import PLATFORM from '@/utils/platform'
import { useAppStore } from '@/store'

defineOptions({
  name: 'Home',
})

// 获取app store中的配置
const appStore = useAppStore()

// 获取屏幕边界到安全区域距离
let safeAreaInsets
// #ifdef MP-WEIXIN
// 微信小程序使用新的API
const wxSystemInfo = wx.getWindowInfo()
safeAreaInsets = wxSystemInfo.safeArea
  ? {
      top: wxSystemInfo.safeArea.top,
      right: wxSystemInfo.windowWidth - wxSystemInfo.safeArea.right,
      bottom: wxSystemInfo.windowHeight - wxSystemInfo.safeArea.bottom,
      left: wxSystemInfo.safeArea.left,
    }
  : null
// #endif

// #ifndef MP-WEIXIN
// 其他平台继续使用uni API
const uniSystemInfo = uni.getSystemInfoSync()
safeAreaInsets = uniSystemInfo.safeAreaInsets
// #endif
const author = ref('菲鸽')
const description = ref(
  'unibest 是一个集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite6 + UnoCss + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。',
)
// 测试 uni API 自动引入
onLoad(() => {
  console.log('项目作者:', author.value)
})
</script>

<style>
.main-title-color {
  color: #d14328;
}
</style>
