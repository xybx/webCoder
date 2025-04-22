<template>
  <div class="login-container animate__animated animate__backInLeft">
    <el-row>
      <el-col :span="24">
        <div class="top-container">
            <h2 class="animate__animated animate__backInDown animate__delay-1s" :title="loginBigTit">{{ loginBigTit }}</h2>
            <span class="enbox animate__animated animate__fadeInLeft animate__delay-1s">{{ loginEnTit }}</span>
        </div>
        <el-card class="formbox animate__animated animate__pulse animate__delay-2s">
          <h3>{{ FormTitle }}</h3>
          <el-form ref="loginFormRef" :model="loginData" :rules="loginRules" class="login-form">
            <el-form-item prop="depart">
              <div class="itembox">
                <span class="leftbox"><i class="iconfont icon-keshi"></i></span>
                <el-select v-model="loginData.depart" :placeholder="translate('请选择科室')" clearable :filterable="true">
                  <el-option v-for="item in departData" :value="item.pid" :label="item.label"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item prop="userName">
              <div class="itembox">
                <span class="leftbox"><i class="iconfont icon-fl-renyuan"></i></span>
                <el-select v-model="loginData.userName" :placeholder="translate('请选择人员')" clearable :filterable="true">
                  <el-option v-for="item in userData" :value="item.pid as string" :label="item.label"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="itembox">
                <span class="leftbox"><i class="iconfont icon-ziyuanxhdpi"></i></span>
                <el-input v-model="loginData.password" :placeholder="translate('请输入密码')" type="password" @keyup="checkCapslock" show-password/>
              </div>
            </el-form-item>
            <el-form-item prop="captchaCode">
              <div class="itembox">
                <span class="leftbox"><i class="iconfont icon-yanzhengma"></i></span>
                <el-input v-model="loginData.captchaCode" auto-complete="off" :placeholder="translate('请输入验证码')" @keyup.enter="handleLogin"/>

              </div>
            </el-form-item>
            <el-button :loading="loading" type="primary" size="large" class="logbtn" @click.prevent="handleLogin">登 录</el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ElForm} from 'element-plus'
import type {OptionProps,LoginData} from "/@/types/loginTypes.ts";
import { translate } from '/@/i18n'
import { useUserStore } from '/@/store/modules/user'
import {getUserList} from "/@/api/user.ts";

defineOptions({
  name: 'Login',
})
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const login = (form: any) => userStore.login(form)
const redirect = ref<any>(undefined)
const loading = ref<boolean>(false); // 按钮loading
const isCapslock = ref<boolean>(false); // 是否大写锁定
const loginFormRef = ref(ElForm); // 登录表单ref
const loginBigTit = ref<string>('')
const loginEnTit = ref<string>('')
const FormTitle = ref<string>('')
const departData = ref<any>([])
const userData = ref<OptionProps[]|[]>([])
const loginData = ref<LoginData>({
  userName:"",
  password:"",
});

const loginRules = computed(() => {
  return {
    // depart:[{required: true, trigger: "change", message: "请选择科室"}],
    userName: [{required: true, trigger: "change", message: "请选择人员"}],
    password: [{required: true, trigger: "blur", message: "请输入密码",}, {min: 6, message: "密码长度不能少于6位", trigger: "blur"}],
    // captchaCode: [{required: true, trigger: "blur", message: "请输入验证码"}]
  }
})

const getLoginTitle = ()=>{
  let str = 'jishuzhongtaigongjudiedai'
  loginBigTit.value = '技术中台工具迭代'
  loginEnTit.value = str.toUpperCase()
  FormTitle.value = '欢迎登录'
}

const getUser = async ()=>{
  let res = await getUserList()
  userData.value = res.data.length > 0 ? res.data.map((item:any)=>{
    return {
      pid:item.value,
      label:item.text
    }
  }) : []
}

const handleLogin = async ()=>{
  if(loginFormRef.value)
  loginFormRef.value.validate(async (valid:boolean)=>{
    if(valid){
      try {
        loading.value = true
        await login(loginData.value).catch(() => {
            loading.value = false
        })
        await router.push(handleRoute())
      }finally {
        loading.value = false
      }
    }
  })
}
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

const handleRoute = () => {
  return redirect.value === '/404' || redirect.value === '/403' ? '/' : redirect.value
}

onMounted(async () => {
  getLoginTitle()
  await getUser()
})

watchEffect(() => {
  redirect.value = (route.query && route.query.redirect) || '/'
})

onBeforeRouteLeave((to, from, next) => {
  next()
})
</script>
<style scoped lang="scss">
@use '/@/styles/login/loginst.scss';
</style>
