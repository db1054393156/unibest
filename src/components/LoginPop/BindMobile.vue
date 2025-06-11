<script setup lang="ts">
import { apiPostBindMobile, apiPostSendCode } from '@/api/user'

const emits = defineEmits(['bind'])

// 倒计时开关
const countdownSwitch = ref(false)

// 表单Ref
const form = ref()

// 表单数据
const formData = ref({
  mobile: '',
  code: '',
  type: 'bind' as 'bind' | 'change',
})

// 表单校验规则
const rules = {
  mobile: [
    {
      required: true,
      message: '请输入手机号',
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
    scene: 'BDSJHM',
  })
  console.log('发送获取验证码请求')
}

// 忘记密码
const handleConfirm = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  await apiPostBindMobile(formData.value)
  emits('bind')
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
    </wd-form>

    <view mt-4 between gap-4>
      <wd-button block type="primary" @click="handleConfirm">确定</wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
