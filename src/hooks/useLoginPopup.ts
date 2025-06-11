import { ref } from 'vue'

type LoginPopExpose = {
  open: () => void
  close: () => void
}

export const loginPopRef = ref<LoginPopExpose | null>(null)

/**
 * 打开登录弹窗
 */
export function openLoginPopup() {
  loginPopRef.value?.open()
}
