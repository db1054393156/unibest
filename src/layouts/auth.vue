<template>
  <wd-config-provider :themeVars="themeVars">
    <slot />
    <wd-toast />
    <wd-message-box />
    <privacy-popup />
  </wd-config-provider>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { themeVars } = storeToRefs(themeStore)
</script>
