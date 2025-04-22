<template>
  <div class="login-container">
    <div class="login-form">
      <img alt="" class="left-img" :src="leftImg" />
      <el-form ref="formRef" label-position="left" :model="form" :rules="rules" @submit.prevent>
        <div class="title">hello !</div>
        <div class="title-tips">{{ translate('欢迎来到') }}{{ title }}！</div>
        <el-form-item prop="username">
          <el-select v-model="form.userName" :placeholder="translate('请选择用户')" clearable :filterable="true">
            <template #prefix>
              <vab-icon icon="user-line" />
            </template>
             <template #default>
              <el-option v-for="item in userData" :key="item.pid" :value="item.pid as string" :label="item.label"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="passwordRef"
            v-model.trim="form.password"
            clearable
            :placeholder="translate('请输入密码')"
            show-password
            :type="passwordType"
          >
            <template #prefix>
              <vab-icon icon="lock-line" />
            </template>
          </el-input>
        </el-form-item>
        <el-button v-throttle="handleLogin" class="login-btn" :loading="loading" native-type="submit" type="primary">
          {{ translate('登录') }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import leftImg from '/@/assets/login_images/left_img_1.png'
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'
import { useUserStore } from '/@/store/modules/user'
import { isPassword } from '/@/utils/validate'
import type {ArrayTypeProps} from './ts/loginType.ts'
import {getUserList} from "/@/api/user.ts";

defineOptions({
  name: 'Login',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const { theme, title } = storeToRefs(settingsStore)
const login = (form: any) => userStore.login(form)
const loading = ref<boolean>(false)
const passwordType = ref<string>('password')
const redirect = ref<any>(undefined)
let timer: any
const formRef = ref<any>(null)
const passwordRef = ref<any>(null)
const form = reactive<any>({
  userName: '',
  password: '',
})
const userData = ref<ArrayTypeProps[] | []>([])

const validateUsername = (rule: any, value: any, callback: any) => {
  if ('' === value) callback(new Error(translate('用户名不能为空')))
  else callback()
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!isPassword(value)) callback(new Error(translate('密码不能少于6位')))
  else callback()
}

const rules = reactive<any>({
  userName: [
    {
      required: true,
      trigger: 'change',
      validator: validateUsername,
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword,
    },
  ],
})

const getUserOption = async ()=>{
  let { data } = await getUserList()
  userData.value = data.map((item:any)=>{
      return {
        pid:item.value,
        label:item.text
      }
  })
}

const handleRoute = () => {
  return redirect.value === '/404' || redirect.value === '/403' ? '/' : redirect.value
}

const handleLogin = async () => {
  if (formRef.value)
    formRef.value.validate(async (valid: any) => {
      if (valid)
        try {
          loading.value = true
          await login(form).catch(() => {
            loading.value = false
          })
          await router.push(handleRoute())
        } finally {
          loading.value = false
        }
    })
}


tryOnMounted(()=>{
  getUserOption()
})

watchEffect(() => {
  redirect.value = (route.query && route.query.redirect) || '/'
})

onBeforeRouteLeave((to, from, next) => {
  clearInterval(timer)
  next()
})
</script>

<style lang="scss" scoped>
@use './style/login.scss';
</style>
