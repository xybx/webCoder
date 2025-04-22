<template>
  <el-drawer v-model="drawerVisible" append-to-body class="vab-drawer" direction="rtl" size="300px" :title="translate('主题配置')">
    <el-scrollbar height="calc(100vh - 120px)">
      <el-form ref="form" label-position="left" :model="theme">
        <el-form-item v-if="device !== 'mobile' && routeName !== 'SeparateLayout'" class="vab-shop-item1">
          <template #label>
            {{ translate('布局') }}
          </template>
          <el-radio-group v-model="theme.layout" class="vab-shop-layout">
            <el-radio-button v-for="item in layoutList" :key="item" :label="item">
              <template #default>
                <vab-icon :icon="item" is-custom-svg />
              </template>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="translate('主题')">
          <el-radio-group v-model="theme.themeName" @change="_updateTheme">
            <el-radio-button v-for="item in themeNameList" :key="item.label" :label="item.label">
              <template #default>{{ translate(item.title) }}</template>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="'technology' != theme.themeName && 'plain' != theme.themeName && route.path !== '/goods/posterDesign'"
          :label="translate('暗黑模式')"
        >
          <vab-dark />
        </el-form-item>
        <el-form-item v-if="'technology' != theme.themeName" :label="translate('配色')">
          <vab-color-picker />
        </el-form-item>
        <el-form-item v-if="'default' === theme.themeName && mode !== 'dark'" :label="translate('菜单背景跟随配色')">
          <el-switch v-model="theme.isFollow" @change="updateIsFollow" />
        </el-form-item>
        <el-form-item v-if="theme.layout !== 'horizontal'" :label="translate('菜单宽度')">
          <el-select v-model="theme.menuWidth" @change="updateMenuWidth">
            <el-option v-for="item in menuWidthList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="translate('标签')">
          <el-switch v-model="theme.showTabs" @change="handleShowTabs" />
        </el-form-item>
        <el-form-item v-if="theme.showTabs">
          <template #label>
            {{ translate('持久化标签') }}
          </template>
          <el-switch v-model="persistenceTab" @change="handlePersistenceTab" />
        </el-form-item>
        <el-form-item v-if="theme.showTabs">
          <template #label>
            {{ translate('标签图标') }}
          </template>
          <el-switch v-model="theme.showTabsIcon" />
        </el-form-item>
        <el-form-item v-if="theme.showTabs">
          <template #label>
            {{ translate('标签风格') }}
          </template>
          <el-select v-model="theme.tabsBarStyle">
            <el-option v-for="item in tabsBarStyleList" :key="item.value" :label="translate(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="translate('页脚')">
          <el-switch v-model="theme.showFooter" @change="handleShowFooter" />
        </el-form-item>
        <el-form-item :label="translate('右侧浮窗')">
          <el-switch v-model="theme.showThemeSetting" />
        </el-form-item>
        <el-form-item v-if="theme.layout === 'column'">
          <template #label>
            {{ translate('分栏风格') }}
          </template>
          <el-select v-model="theme.columnStyle">
            <el-option v-for="item in columnStyleList" :key="item.value" :label="translate(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="translate('圆角')">
          <el-input-number v-model="theme.radius" :max="26" :min="3" @change="handleRadius" />
        </el-form-item>
        <el-form-item :label="translate('色弱')">
          <el-switch v-model="theme.colorWeakness" @change="handleColorWeakness" />
        </el-form-item>
        <el-form-item :label="translate('头部固定')">
          <el-switch v-model="theme.fixedHeader" />
        </el-form-item>
        <el-form-item :label="translate('暗黑组件')">
          <el-switch v-model="theme.showDark" />
        </el-form-item>
        <el-form-item :label="translate('颜色选择器')">
          <el-switch v-model="theme.showColorPicker" />
        </el-form-item>
        <el-form-item :label="translate('国际化')">
          <el-switch v-model="theme.showLanguage" />
        </el-form-item>
        <el-form-item :label="translate('进度条')">
          <el-switch v-model="theme.showProgressBar" />
        </el-form-item>
        <el-form-item :label="translate('刷新')">
          <el-switch v-model="theme.showRefresh" />
        </el-form-item>
        <el-form-item :label="translate('搜索')">
          <el-switch v-model="theme.showSearch" />
        </el-form-item>
        <el-form-item :label="translate('通知')">
          <el-switch v-model="theme.showNotice" />
        </el-form-item>
        <el-form-item :label="translate('全屏')">
          <el-switch v-model="theme.showFullScreen" />
        </el-form-item>
        <el-form-item :label="translate('锁屏')">
          <el-switch v-model="theme.showLock" />
        </el-form-item>
        <el-form-item :label="translate('页面动画')">
          <el-select v-model="theme.pageTransition">
            <el-option v-for="item in pageTransitionList" :key="item.value" :label="translate(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button type="primary" @click="handleSaveTheme">
        {{ translate('保存') }}
      </el-button>
      <el-button @click="setDefaultTheme">
        {{ translate('恢复默认') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'VabThemeDrawer',
})

const route = useRoute()
const $sub = inject<any>('$sub')
const $pub = inject<any>('$pub')
const $baseLoading = inject<any>('$baseLoading')
const $baseMessage = inject<any>('$baseMessage')
const settingsStore = useSettingsStore()
const routeName = ref<any>(route.name)
const { theme, device, mode, persistenceTab } = storeToRefs<any>(settingsStore)
const { saveTheme, resetTheme, updateTheme, updateCaughtTabs, setCssVar } = settingsStore
const drawerVisible = ref<boolean>(false)
const layoutList = ref<any>(['column', 'vertical', 'horizontal', 'comprehensive'])
const tabsBarStyleList = ref<any>([
  { label: '卡片', value: 'card' },
  { label: '灵动', value: 'smart' },
  { label: '圆滑', value: 'smooth' },
  { label: '矩形', value: 'rect' },
])
const menuWidthList = ref<any>(['266px', '277px', '288px', '299px'])
const themeNameList = ref<any>([
  { label: 'default', title: '默认' },
  { label: 'plain', title: '简洁' },
  { label: 'technology', title: '科技' },
])
const columnStyleList = ref<any>([
  { value: 'vertical', label: '纵向' },
  { value: 'horizontal', label: '横向' },
  { value: 'card', label: '卡片' },
  { value: 'arrow', label: '箭头' },
  { value: 'semicircle', label: '半圆' },
])
const pageTransitionList = ref<any>([
  { value: '', label: '无动画' },
  { value: 'el-fade-in-linear', label: 'fade-in-linear' },
  { value: 'el-fade-in', label: 'fade-in' },
  { value: 'el-zoom-in-center', label: 'zoom-in-center' },
  { value: 'el-zoom-in-top', label: 'zoom-in-top' },
  { value: 'el-zoom-in-bottom', label: 'zoom-in-bottom' },
])

const handleOpenTheme = () => {
  drawerVisible.value = true
}

const updateMenuWidth = (value: any) => {
  theme.value.menuWidth = value
  setCssVar()
}

const updateIsFollow = (value: any) => {
  theme.value.isFollow = value
  setCssVar()
}

const handleShowFooter = (value: any) => {
  theme.value.showFooter = value
  setCssVar()
}

const handleRadius = (value: any) => {
  theme.value.radius = value
  setCssVar()
}

const handleColorWeakness = (value: any) => {
  theme.value.colorWeakness = value
  setCssVar()
}

const handleShowTabs = (value: any) => {
  const el = ref<any>(null)
  if (!value) useCssVar('--el-tabs-height', el).value = '0px'
  else useCssVar('--el-tabs-height', el).value = '50px'
}

const handlePersistenceTab = (value: any) => {
  updateCaughtTabs(value)
}

const _updateTheme = (value: any = '') => {
  if (value == 'default') $pub('shop-vite-reset-dark')
  if (theme.value.themeName == 'technology') $pub('shop-vite-reset-color')

  const loading = $baseLoading()
  useTimeoutFn(() => {
    updateTheme()
  }, 500)

  useTimeoutFn(() => {
    loading.close()
    $baseMessage('切换成功', 'success', 'hey')
  }, 1000)

  saveTheme()
}

const setDefaultTheme = () => {
  drawerVisible.value = false
  const loading = $baseLoading()

  useTimeoutFn(() => {
    resetTheme()
    $pub('shop-vite-reset-color')
    $pub('shop-vite-reset-dark')
  }, 500)

  useTimeoutFn(() => {
    loading.close()
    $baseMessage('切换成功', 'success', 'hey')
    if (device.value === 'mobile') location.reload()
  }, 1000)
}

const handleSaveTheme = () => {
  saveTheme()
  drawerVisible.value = false
  //if (device.value === 'mobile') location.reload()
}

watch(
  route,
  () => {
    routeName.value = route.name
  },
  { immediate: true }
)

onBeforeMount(() => {
  $sub('shop-vite-open-theme', () => {
    handleOpenTheme()
  })
  $sub('shop-vite-reset-theme', () => {
    setDefaultTheme()
  })
  $sub('shop-vite-save-theme', () => {
    saveTheme()
  })
  $sub('shop-vite-change-theme', (value: string) => {
    theme.value.themeName = value
    _updateTheme()
  })
})
</script>

<style lang="scss">
.vab-drawer {
  .el-drawer__header {
    padding: var(--el-padding) var(--el-padding) 0 var(--el-padding);
    margin-bottom: 0;
  }

  .el-drawer__body {
    padding-right: 0;

    .el-scrollbar__wrap {
      height: calc(100vh - 80px);
      padding-right: var(--el-padding);

      .el-form-item {
        display: flex;
        align-items: center;
        margin-bottom: 17.5px;

        &__label {
          flex: 1 1;

          i {
            cursor: pointer;
          }
        }

        &__content {
          flex: 0 0 auto;
        }

        &.vab-item-custom {
          display: block !important;
          height: 130px;
        }

        &.vab-shop-item1 {
          display: block !important;

          .el-form-item__content {
            .vab-shop-layout {
              .el-radio-button {
                position: relative;
                display: block;
                float: left;
                width: 50px;
                height: 50px;
                padding: 0;
                margin: 10px 10px 5px 4px;
                cursor: pointer;
                background: transparent;
                border: 0;
                box-shadow: none;

                &.is-disabled {
                  cursor: not-allowed;
                  opacity: 0.6;
                }

                .el-radio-button__orig-radio {
                  display: none;
                }

                .el-radio-button__original-radio:checked + .el-radio-button__inner {
                  background: transparent;

                  .vab-icon {
                    box-shadow: 0 0 2px 2px var(--el-color-primary);
                  }
                }

                .el-radio-button__inner {
                  position: absolute;
                  top: 0;
                  left: 0;
                  display: block;
                  width: 50px;
                  height: 50px;
                  padding: 0;
                  margin: 0;
                  border: 0;
                  box-shadow: none;

                  .vab-icon {
                    width: 50px;
                    height: 50px;
                    padding: 0;
                    margin: 0;
                    border: 1px solid var(--el-border-color);
                    border-radius: var(--el-border-radius-base);
                  }
                }
              }

              .el-radio-button:last-child {
                margin-right: 0;
              }
            }
          }
        }

        .el-input,
        .el-input-number {
          width: 105px;
        }
      }
    }
  }

  .el-drawer__footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: calc(var(--el-z-index) + 1);
    padding: calc(var(--el-padding) / 2);
    background: var(--el-color-white);
    border-top: 1px solid var(--el-border-color);
  }
}
</style>
