import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConfigProviderThemeVars } from 'wot-design-uni'

const defaultThemeVars: ConfigProviderThemeVars = {
  colorTheme: 'rgb(9, 87, 222)',
  buttonPrimaryBgColor: '#0957DE',
  buttonPrimaryColor: '#ffffff',
  colorSuccess: '#34d19d',
  colorWarning: '#f0883a',
  colorDanger: '#fa4350',
  colorBorder: '#e4e7ed',
  colorBg: '#f5f5f5',
}

export const useThemeStore = defineStore(
  'theme',
  () => {
    const themeVars = ref<ConfigProviderThemeVars>({ ...defaultThemeVars })
    const setThemeVars = (vars: Partial<ConfigProviderThemeVars>) => {
      themeVars.value = { ...themeVars.value, ...vars }
    }
    return {
      themeVars,
      setThemeVars,
    }
  },
  {
    persist: true,
  },
)
