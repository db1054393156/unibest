<script setup lang="ts">
import { apiPostResetPassword, apiPostSendCode } from '@/api/user'

const emits = defineEmits(['forget'])

// 倒计时开关
const countdownSwitch = ref(false)

// 表单Ref
const form = ref()

// 表单数据
const formData = ref({
  mobile: '',
  password: '',
  password_confirm: '',
  code: '',
})

// 表单校验规则
const rules = {
  mobile: [
    {
      required: true,
      message: '请输入手机号',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入新密码',
    },
  ],
  password_confirm: [
    {
      required: true,
      message: '请再次输入新密码',
      validator: async (val: string) => {
        if (!val) {
          return '请再次输入新密码'
        }
        if (val !== formData.value.password) {
          return '两次输入的密码不一致'
        }
        return true
      },
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
    },
  ],
}

// 获取验证码
const handleCode = () => {
  if (!formData.value.mobile) {
    useToast('请输入手机号')
    return
  }
  countdownSwitch.value = true
  apiPostSendCode({
    mobile: formData.value.mobile,
    scene: 'ZHDLMM',
  })
  console.log('发送获取验证码请求')
}

// 忘记密码
const handleConfirm = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  await apiPostResetPassword(formData.value)
  emits('forget')
}
</script>

<template>
  <view w-full>
    <wd-form ref="form" :model="formData" :rules="rules">
      <wd-input
        v-model="formData.mobile"
        prop="mobile"
        prefix-icon="person"
        placeholder="请输入手机号"
        :prefix-icon-style="{
          'font-size': '32rpx',
        }"
        clearable
      />

      <!-- 验证码 -->
      <wd-input
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

      <!-- 新密码 -->
      <wd-input
        v-model="formData.password"
        prop="password"
        prefix-icon="locked"
        placeholder="请输入新密码"
        :prefix-icon-style="{
          'font-size': '32rpx',
        }"
        show-password
        clearable
      />

      <!-- 确认新密码 -->
      <wd-input
        v-model="formData.password_confirm"
        prop="password_confirm"
        prefix-icon="locked"
        placeholder="请再次输入新密码"
        :prefix-icon-style="{
          'font-size': '32rpx',
        }"
        show-password
        clearable
      />
    </wd-form>

    <view mt-4 between gap-4>
      <wd-button block type="info" @click="$emit('forget')">返回登录</wd-button>
      <wd-button block type="primary" @click="handleConfirm">确定修改</wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
