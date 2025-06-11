<!-- 登录弹窗 -->
<script lang="ts" setup>
import {
  apiPostAccountLogin,
  apiPostCheckRegister,
  apiPostCodeBindAccount,
  apiPostMnpLogin,
  apiPostSendCode,
} from '@/api/user'
// import ConfirmModal from '@/components/ConfirmModal.vue';
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { ref, computed, onMounted } from 'vue'

import { useMessage } from 'wot-design-uni'
const message = useMessage('agree-message')

import BindMobile from './BindMobile.vue'
import ForgetMobile from './ForgetMobile.vue'
import Register from './Register.vue'

const appStore = useAppStore()
const userStore = useUserStore()

// 弹窗显示/隐藏
const popupVisible = ref(false)

// 微信登录/注册中
const loading = ref(false)

// 是否同意协议
const isAgreement = ref(false)
// 协议弹窗
const agreementPopupRef = ref()

// 验证码倒计时开关
const countdownSwitch = ref(false)

enum LoginWayEnum {
  /* 微信登录 */
  WECHAT = '1',
  /* 手机号登录 */
  MOBILE = '2',
  /* 账号密码登录 */
  ACCOUNT = '3',
}

enum otherWayEnum {
  /* 忘记密码 */
  FORGET = '4',
  /* 绑定手机号 */
  BIND = '5',
  /* 账号注册 */
  ACCOUNT_REGISTER = '6',
  /* 手机号注册 */
  MOBILE_REGISTER = '7',
}

// 是否显示微信登录-获取手机号时不显示
const isShowWXlogin = ref(true)

// 登录方法
const loginWay = ref<LoginWayEnum | otherWayEnum>(LoginWayEnum.ACCOUNT)

// 登录拿到的数据
const loginData = ref()

// 表单Ref
const form = ref()

// 表单数据
const formData = ref({
  mobile: '',
  password: '',
  code: '',
})

// 表单校验规则
const rules = {
  mobile: [
    {
      required: true,
      message: '请输入账号/手机号',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
    },
  ],
}

// 动态标题
const popupTitle = computed(() => {
  const titles: Record<string, string> = {
    [LoginWayEnum.WECHAT]: '微信登录',
    [LoginWayEnum.MOBILE]: '手机号登录',
    [LoginWayEnum.ACCOUNT]: '账号密码登录',
    [otherWayEnum.FORGET]: '找回密码',
    [otherWayEnum.BIND]: '绑定手机号',
    [otherWayEnum.ACCOUNT_REGISTER]: '账号注册',
    [otherWayEnum.MOBILE_REGISTER]: '手机号注册',
  }
  return titles[loginWay.value] || '用户登录'
})

// 判断登录方式
function isWay(way: LoginWayEnum | otherWayEnum) {
  return loginWay.value == way
}
// 判断登录方式是否开启
function checkWayStatus(way: LoginWayEnum | otherWayEnum) {
  return appStore.config.login.login_way.includes(way)
}

// 切换登录方式或其他操作
function changeWay(way: LoginWayEnum | otherWayEnum) {
  // 关闭当前页面倒计时
  countdownSwitch.value = false
  loginWay.value = way
}

// 获取验证码
async function handleCode() {
  const { valid } = await form.value.validate('mobile')
  if (!valid) return

  countdownSwitch.value = true
  apiPostSendCode({
    mobile: formData.value.mobile,
    scene: 'YZMDL',
  })
  console.log('发送获取验证码请求')
}

// 协议弹窗
const handleAgreement = () => {
  // isAgreement.value = true;
}

// 确定登录
const handleConfirm = async () => {
  console.log(2222)
  // 是否同意协议
  if (!isAgreement.value) {
    // agreementPopupRef.value?.open();
    message
      .confirm({ title: '服务协议与隐私政策', zIndex: 99999 })
      .then(() => {
        isAgreement.value = true
      })
      .catch(() => {})
    return
  }

  const { valid } = await form.value.validate()
  console.log(valid)
  if (!valid) return
  console.log(11122)
  if (isWay(LoginWayEnum.MOBILE)) {
    mobileLogin()
  } else if (isWay(LoginWayEnum.ACCOUNT)) {
    accountLogin()
  }
}

// 账号密码登录
async function accountLogin() {
  await userStore.login({
    account: formData.value.mobile,
    password: formData.value.password,
    scene: 3, // 账号密码登录
  })
  await LoginAfterHandle()
}

// 手机号登录
async function mobileLogin() {
  await userStore.login({
    account: formData.value.mobile,
    code: formData.value.code,
    scene: 2, // 手机验证码登录
  })
  await LoginAfterHandle()
}

// 微信登录
async function wxLogin() {
  // 是否同意协议
  if (!isAgreement.value) {
    agreementPopupRef.value?.open()
    return
  }

  // 是否登录中
  if (loading.value) {
    return
  } else {
    loading.value = true
  }

  // #ifdef MP-WEIXIN
  await mnpLogin()
  // #endif
}

// 获取code
const getCode = async () => {
  const { code }: any = await uni.login({
    provider: 'weixin',
  })
  return code
}

// 小程序登录
async function mnpLogin() {
  try {
    let code = await getCode()
    // 根据微信小程序code获取对应账号信息-有账号就登录，没有就注册且绑定手机号
    const { data: codedData } = await apiPostCodeBindAccount({
      code,
    })
    console.log('根据微信小程序code获取对应账号信息', codedData)

    if (codedData?.token) {
      // 有账号-直接登录
      // 重新获取code
      code = await getCode()
      await userStore.wxLogin({
        code,
      })
      await LoginAfterHandle()
    } else {
      // 无账号-登录注册（先获取手机号，有账号提示账号登录，没有注册后绑定手机号）
      // 登录注册
      isShowWXlogin.value = false
    }

    loading.value = false
  } catch (err) {
    loading.value = false
    console.log('请求失败：', err)
  }
}

// 验证手机号是否已注册
const checkRegister = async () => {
  try {
    await apiPostCheckRegister({ mobile: formData.value.mobile })
    // 手机号已注册, 提示用户并切换到手机号登录
    useToast('该手机号已注册，请使用手机号登录', { duration: 3000 })
    changeWay(LoginWayEnum.MOBILE)
  } catch (err) {
    // 手机号未注册，执行注册并登录
    console.log('手机号未注册', err)
    const code = await getCode()
    await userStore.wxLogin({
      code,
      mobile: formData.value.mobile,
    })
    await LoginAfterHandle()
  }
}

// 获取登录数据
const LoginAfterHandle = async () => {
  // 需要强制绑定手机号
  if (appStore.config.login?.coerce_mobile && !userStore.userInfo?.mobile) {
    loginWay.value = otherWayEnum.BIND
    return
  }
  // 关闭弹窗
  popupVisible.value = false
}

// 去协议页面
function toAgreement(type: string) {
  uni.navigateTo({
    url: `/bundle/pages/agreement/index?type=${type}`,
  })
}

onMounted(async () => {
  await appStore.initAppConfig()
  loginWay.value =
    (appStore.config.login?.default_login_way as LoginWayEnum) || LoginWayEnum.ACCOUNT
  console.log(loginWay.value)
  // 已登录-开启强制绑定手机号-且未绑定手机号
  if (userStore.isLogin && appStore.config.login?.coerce_mobile && !userStore.userInfo?.mobile) {
    loginWay.value = otherWayEnum.BIND
  }
})

defineExpose({
  // 打开弹窗
  open: () => {
    popupVisible.value = true
  },
  close: () => {
    popupVisible.value = false
  },
})
</script>

<template>
  <wd-popup
    v-model="popupVisible"
    position="bottom"
    custom-style="border-radius: 24rpx 24rpx 0 0;"
    :close-on-click-modal="false"
    :safe-area-inset-bottom="true"
    style="z-index: 99"
  >
    <view
      class="rounded-t-[var(--ui-radius)] login-bg"
      w-full
      center
      flex-col
      bg-background-bold
      px-6
      box-border
    >
      <!-- 登录方式 -->
      <view flex="~ items-center justify-around" my-8 w-full text="lg primary">
        <view>
          {{ popupTitle }}
        </view>
      </view>
      <wd-icon name="add-circle" color="red" />
      <image src="/static/login/account.svg" />
      <!--            <image src="/static/app/icons/20x20.png"/>-->
      <!-- 账号密码、手机号登录 -->
      <view v-if="isWay(LoginWayEnum.MOBILE) || isWay(LoginWayEnum.ACCOUNT)" w-full>
        <wd-form ref="form" :model="formData" :rules="rules">
          <wd-input
            v-model="formData.mobile"
            prop="mobile"
            prefix-icon="static/login/account.svg"
            :placeholder="isWay(LoginWayEnum.MOBILE) ? '请输入手机号' : '请输入账号/手机号'"
            :prefix-icon-style="{
              'font-size': '32rpx',
            }"
            clearable
          ></wd-input>

          <!-- 密码 -->
          <wd-input
            v-if="isWay(LoginWayEnum.ACCOUNT)"
            v-model="formData.password"
            prop="password"
            prefix-icon="locked"
            placeholder="请输入密码"
            :prefix-icon-style="{
              'font-size': '32rpx',
            }"
            show-password
            clearable
          >
            <template #suffix>
              <view text="primary" pl-2 @tap="changeWay(otherWayEnum.FORGET)">忘记密码</view>
            </template>
          </wd-input>

          <!-- 验证码 -->
          <wd-input
            v-if="isWay(LoginWayEnum.MOBILE)"
            v-model="formData.code"
            prop="code"
            prefix-icon="locked"
            placeholder="请输入验证码"
            :prefix-icon-style="{
              'font-size': '32rpx',
            }"
            clearable
          >
            <template #suffix>
              <VerificationCode
                v-model:countdown-switch="countdownSwitch"
                :second="59"
                @handle-code="handleCode"
              />
            </template>
          </wd-input>
        </wd-form>
      </view>

      <!-- 忘记密码 -->
      <view w-full>
        <forget-mobile
          v-if="isWay(otherWayEnum.FORGET)"
          @forget="changeWay(LoginWayEnum.ACCOUNT)"
        />
      </view>

      <!-- 绑定手机号 -->
      <view w-full>
        <bind-mobile v-if="isWay(otherWayEnum.BIND)" @bind="LoginAfterHandle" />
      </view>

      <!-- 账号注册 -->
      <view w-full>
        <register
          v-if="isWay(otherWayEnum.ACCOUNT_REGISTER)"
          :is-agreement="isAgreement"
          :agreement-popup-ref="agreementPopupRef"
          :type="otherWayEnum.ACCOUNT_REGISTER"
          @register="changeWay(LoginWayEnum.ACCOUNT)"
        />
      </view>

      <!-- 手机号注册 -->
      <view w-full>
        <register
          v-if="isWay(otherWayEnum.MOBILE_REGISTER)"
          :is-agreement="isAgreement"
          :agreement-popup-ref="agreementPopupRef"
          :type="otherWayEnum.MOBILE_REGISTER"
          @register="changeWay(LoginWayEnum.MOBILE)"
        />
      </view>

      <!-- 底部按钮 -->
      <view
        v-if="
          isWay(LoginWayEnum.MOBILE) || isWay(LoginWayEnum.ACCOUNT) || isWay(LoginWayEnum.WECHAT)
        "
        mt-4
        w-full
        between
        gap="4"
      >
        <!-- #ifdef MP-WEIXIN -->
        <wd-button
          v-if="isWay(LoginWayEnum.WECHAT) && isShowWXlogin"
          block
          type="primary"
          :loading="loading"
          :disabled="loading"
          @click="wxLogin"
        >
          微信登录/注册
        </wd-button>
        <!-- 微信登录验证手机号 -->
        <view v-if="isWay(LoginWayEnum.WECHAT) && !isShowWXlogin" w-full center flex-col>
          <view mb-4 w-full>
            <wd-input
              v-model="formData.mobile"
              prefix-icon="person"
              placeholder="请输入微信手机号"
              :prefix-icon-style="{
                'font-size': '32rpx',
              }"
              clearable
            />
          </view>
          <wd-button block type="primary" @click="checkRegister">确定</wd-button>
        </view>
        <!-- #endif -->

        <wd-button
          v-if="!isWay(LoginWayEnum.WECHAT) && isWay(LoginWayEnum.ACCOUNT)"
          block
          type="info"
          @click="changeWay(otherWayEnum.ACCOUNT_REGISTER)"
        >
          账号注册
        </wd-button>
        <wd-button
          v-if="!isWay(LoginWayEnum.WECHAT) && isWay(LoginWayEnum.MOBILE)"
          block
          type="info"
          @click="changeWay(otherWayEnum.MOBILE_REGISTER)"
        >
          手机号注册
        </wd-button>
        <wd-button v-if="!isWay(LoginWayEnum.WECHAT)" block type="primary" @click="handleConfirm">
          登录
        </wd-button>
      </view>

      <view text="foreground/40 xs" mt-4>其他方式登录</view>

      <view class="flex gap-3 pb-6 pt-4">
        <!-- #ifdef MP-WEIXIN -->
        <view
          v-if="!isWay(LoginWayEnum.WECHAT) && checkWayStatus(LoginWayEnum.WECHAT)"
          class="h-8 w-8 center rounded-full bg-foreground/10"
          @click="changeWay(LoginWayEnum.WECHAT)"
        >
          <wd-icon name="logo-wechat" size="32rpx" />
        </view>
        <!-- #endif -->
        <view
          v-if="!isWay(LoginWayEnum.ACCOUNT) && checkWayStatus(LoginWayEnum.ACCOUNT)"
          class="h-8 w-8 center rounded-full bg-foreground/10"
          @click="changeWay(LoginWayEnum.ACCOUNT)"
        >
          <wd-icon name="lock-on" size="32rpx" />
        </view>
        <view
          v-if="!isWay(LoginWayEnum.MOBILE) && checkWayStatus(LoginWayEnum.MOBILE)"
          class="h-8 w-8 center rounded-full bg-foreground/10"
          @click="changeWay(LoginWayEnum.MOBILE)"
        >
          <wd-icon name="phone" size="32rpx" />
        </view>
      </view>
      <!-- 协议 -->
      <view v-if="appStore.config.login?.login_agreement" class="center pb-14 text-center text-sm">
        <wd-checkbox v-model="isAgreement" shape="circle" checked-color="#4D80F0">
          <span text-foreground-muted>已阅读并同意</span>
          <span text-primary @click.stop="toAgreement('service')">《服务协议》</span>
          <span text-foreground-muted>和</span>
          <span text-primary @click.stop="toAgreement('privacy')">《隐私协议》</span>
        </wd-checkbox>
      </view>
    </view>
  </wd-popup>
  <wd-message-box selector="agree-message">
    <view class="flex flex-col gap-20rpx">
      <view class="text-28rpx text-#333">请您阅读并同意</view>
      <view class="text-24rpx text-#666">
        <text class="text-#FF8000">《服务协议》</text>
        和
        <text class="text-#FF8000">《隐私政策》</text>
      </view>
    </view>
  </wd-message-box>
  <!--    <confirm-modal-->
  <!--        ref="agreementPopupRef"-->
  <!--        title="服务协议及隐私协议"-->
  <!--        cancel-text="取消"-->
  <!--        confirm-text="确定"-->
  <!--        :confirm-callback="handleAgreement"-->
  <!--    >-->
  <!--        <view text-foreground-muted> 请您阅读并同意 </view>-->
  <!--        <view text-primary> 《服务协议》和《隐私协议》 </view>-->
  <!--    </confirm-modal>-->
</template>

<style lang="scss" scoped>
.login-bg {
  background: var(--login-bg-color);
}
.footer {
  // padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
  // /* #ifdef H5 */
  // padding-bottom: calc(env(safe-area-inset-bottom) + 124rpx);
  // /* #endif */
}
</style>
