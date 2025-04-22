<template>
  <vab-app />
</template>

<script lang="ts" setup>
import { noDebugger } from '/@/config'
import { useSettingsStore } from '/@/store/modules/settings'

defineOptions({
  name: 'App',
})

onBeforeMount(() => {
  if (!location.hostname.includes('127') && !location.hostname.includes('localhost')) {
    if (noDebugger) {
      ;(() => {
        const block = () => {
          useIntervalFn(() => {
            ;(function () {
              return false
            })
              ['constructor']('debugger')
              ['call']()
          }, 50)
        }

        try {
          block()
        } catch (err) {
          /* empty */
        }
      })()
    }
  }
})
</script>
