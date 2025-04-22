<template>
  <vab-app />
</template>

<script lang="ts" setup>
import { noDebugger } from '/@/config'
import { useSettingsStore } from '/@/store/modules/settings'
import {checkLogin} from "/@/api/user.ts";
import {useUserStore} from "/@/store/modules/user.ts";


defineOptions({
  name: 'App',
})

const settingsStore = useSettingsStore()
const { updateTheme, changeColor } = settingsStore
const worker = ref<any>(null);
const { token } = useUserStore()
const startCheckLogin = ()=>{
  worker.value = new Worker(new URL('./utils/worker.ts', import.meta.url))
  worker.value.postMessage({timer:15000,message:'heart'})
  worker.value.onmessage = (e:any)=>{
    console.log(e)
    if(e.data == 'heart'){
      getLogin()
    }
  }
}

const getLogin = async ()=>{
  if(token){
    let res:any = await checkLogin()
    console.log(res)
  }
}

onBeforeMount(() => {
  changeColor()
  updateTheme()

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

onMounted(async ()=>{
  await startCheckLogin()
})

onUnmounted(()=>{
  worker.value && worker.value.terminate()
})
</script>
