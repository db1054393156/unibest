<script setup lang="ts">
import { apiPostAccountRegister, apiPostSendCode } from '@/api/user'
import { useToast } from 'wot-design-uni'

// 注册方式
enum RegisterWayEnum {
  /* 账号注册 */
  ACCOUNT_REGISTER = '6',
  /* 手机号注册 */
  MOBILE_REGISTER = '7',
}

const props = defineProps({
  type: {
    type: String,
    default: RegisterWayEnum.ACCOUNT_REGISTER,
  },
  isAgreement: {
    type: Boolean,
  },
})

const emits = defineEmits(['register'])

// 验证码倒计时开关
const countdownSwitch = ref(false)

// 表单Ref
const form = ref()

// 表单数据
const formData = ref({
  account: '',
  password: '',
  password_confirm: '',
  code: '',
})

// 表单校验规则
const rules = {
  account: [
    {
      required: true,
      message: '请输入账号/手机号',
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
  password_confirm: [
    {
      required: true,
      message: '请再次输入新密码',
      validator: async (val: string) => {
        if (val !== formData.value.password) {
          return '两次输入的密码不一致'
        }
        return true
      },
    },
  ],
}

// 获取验证码
const handleCode = () => {
  if (!formData.value.account) {
    useToast('请输入手机号')
    return
  }
  countdownSwitch.value = true
  apiPostSendCode({
    mobile: formData.value.account,
    scene: 'YZMZC',
  })
  console.log('发送获取验证码请求')
}

// 注册
const handleConfirm = async () => {
  // 是否同意协议
  if (!props.isAgreement) {
    useToast('请先阅读并同意服务及隐私协议')
    return
  }

  const { valid } = await form.value.validate()
  if (!valid) return

  const { code: wx_code }: any = await uni.login({
    provider: 'weixin',
  })
  // scene账号密码-3，手机验证码-2
  await apiPostAccountRegister({
    ...formData.value,
    wx_code,
    scene: props.type === RegisterWayEnum.MOBILE_REGISTER ? 2 : 3,
  })
  emits('register')
}
</script>

<template>
  <view w-full>
    <wd-form ref="form" :model="formData" :rules="rules">
      <wd-input
        v-model="formData.account"
        prop="account"
        prefix-icon="person"
        :placeholder="type === RegisterWayEnum.MOBILE_REGISTER ? '请输入手机号' : '请输入账号'"
        :prefix-icon-style="{
          'font-size': '32rpx',
        }"
        clearable
      />

      <!-- 验证码-手机号码注册 -->
      <wd-input
        v-if="type === RegisterWayEnum.MOBILE_REGISTER"
        v-model="formData.code"
        prop="code"
        prefix-icon="person"
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

      <!-- 密码 -->
      <wd-input
        v-model="formData.password"
        prop="password"
        prefix-icon="locked"
        placeholder="请输入密码"
        :prefix-icon-style="{
          'font-size': '32rpx',
        }"
        show-password
        clearable
      />

      <!-- 确认密码 -->
      <wd-input
        v-model="formData.password_confirm"
        prop="password_confirm"
        prefix-icon="locked"
        placeholder="请再次输入密码"
        :prefix-icon-style="{
          'font-size': '32rpx',
        }"
        show-password
        clearable
      />
    </wd-form>

    <view mt-4 w-full between gap-4>
      <wd-button block type="info" @click="$emit('register')">返回登录</wd-button>
      <wd-button block type="primary" @click="handleConfirm">立即注册</wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
