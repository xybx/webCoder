<template>
  <footer v-if="theme.showFooter" class="vab-footer">
    Copyright
    <vab-icon icon="copyright-line" />
    {{ fullYear }} {{ title }}
  </footer>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabFooter',
})

const fullYear = new Date().getFullYear()
const settingsStore = useSettingsStore()
const { title, theme } = storeToRefs(settingsStore)
</script>

<style lang="scss" scoped>
.vab-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--el-footer-height);
  padding: 0 var(--el-padding) 0 var(--el-padding);
  margin-top: var(--el-margin);
  color: var(--el-color-grey);
  background: var(--el-color-white);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  transition: var(--el-transition);

  i {
    margin: 0 3px;
  }
}
</style>
