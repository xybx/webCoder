<template>
  <div class="vab-app-main">
    <section>
      <vab-router-view />
      <vab-footer />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRoutesStore } from '/@/store/modules/routes'
import { handleActivePath } from '/@/utils/routes'

defineOptions({
  name: 'VabAppMain',
})

const route = useRoute()
const routesStore = useRoutesStore()
const { tab, activeMenu } = storeToRefs<any>(routesStore)

watch(
  route,
  () => {
    if (tab.value.data !== route.matched[0].name) tab.value.data = route.matched[0].name
    activeMenu.value.data = handleActivePath(route)
  },
  { immediate: true }
)
</script>
