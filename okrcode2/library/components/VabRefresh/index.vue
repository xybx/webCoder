<template>
  <vab-icon :class="className" icon="refresh-line" @click="refreshRoute" />
</template>

<script lang="ts" setup>
defineOptions({
  name: 'VabRefresh',
})

const $sub = inject<any>('$sub')
const $pub = inject<any>('$pub')
const className = ref<string>('')

const rotate = () => {
  className.value = 'rotate'
  useTimeoutFn(() => {
    className.value = ''
  }, 500)
}

const refreshRoute = () => {
  $pub('reload-router-view')
  rotate()
}

onBeforeMount(() => {
  $sub('refresh-rotate', () => {
    rotate()
  })
})
</script>
