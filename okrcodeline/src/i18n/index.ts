import enLocale from 'element-plus/dist/locale/en'
import zhLocale from 'element-plus/dist/locale/zh-cn'
import { App } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './en.json'
import pinia from '/@/store'
import { useSettingsStore } from '/@/store/modules/settings'

export { enLocale, zhLocale }

const messages: Record<LanguageType, any> = {
  en: {
    ...en,
  },
  zh: {},
}

const getLanguage = () => {
  const { getLanguage } = useSettingsStore(pinia)
  return getLanguage
}

export const i18n = createI18n({
  legacy: false,
  locale: getLanguage(),
  fallbackLocale: 'zh',
  messages,
})

export const setupI18n = (app: App<Element>) => {
  app.use(i18n)
  return i18n
}

export const translate = (message: string | undefined) => {
  if (!message) return ''
  return [getLanguage(), 'vabI18n', message].reduce((o, k) => (o || {})[k], messages as any) || message
}
