<template>
  <div class="login-container animate__animated animate__backInLeft">
    <el-row>
      <el-col :span="24">
        <div class="top-container">
            <h2 class="animate__animated animate__backInDown animate__delay-1s">{{ loginBigTit }}</h2>
            <span class="enbox animate__animated animate__fadeInLeft animate__delay-1s">{{ loginEnTit }}</span>
        </div>
        <div class="body-container">
          <div class="leftbg animate__animated animate__pulse animate__slower animate__infinite animate__delay-1s"></div>
          <el-card class="formbox animate__animated animate__swing animate__delay-2s">
             <h3>{{ FormTitle }}</h3>
              <el-form ref="loginFormRef" :model="loginData" :rules="loginRules" class="login-form">
                <el-form-item prop="username">
                  <div class="itembox">
                    <span class="leftbox"><i class="iconfont icon-shoujihao"></i></span>
                    <el-input v-model="loginData.username" autocomplete="off" placeholder="请输入手机号"/>
                  </div>
                </el-form-item>
                <el-form-item prop="password">
                  <div class="itembox">
                    <span class="leftbox"><i class="iconfont icon-ziyuanxhdpi"></i></span>
                    <el-input v-model="loginData.password" placeholder="请输入密码" type="password" @keyup="checkCapslock" show-password/>
                  </div>
                </el-form-item>
                <el-form-item prop="captchaCode">
                  <div class="itembox">
                    <span class="leftbox"><i class="iconfont icon-yanzhengma"></i></span>
                    <el-input v-model="loginData.captchaCode" autocomplete="off" placeholder="请输入验证码" @keyup.enter="handleLogin"/>
                  </div>
                </el-form-item>
                <el-button :loading="loading" type="primary" size="large" class="logbtn" @click.prevent="handleLogin">登 录</el-button>
            </el-form>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {useRouter,useRoute} from "vue-router";
import { ElLoading , ElMessage, ElForm} from 'element-plus'
import type {OptionProps,LoginData} from "/@/types/loginTypes.ts";
defineOptions({
  name: 'Login',
})
const loginBigTit = ref<string>('')
const loginEnTit = ref<string>('')
const FormTitle = ref<string>('')
const loading = ref<boolean>(false)
const loginData = ref<LoginData>({
  username: "",
  password: "",
})
const loginRules = computed(() => {
  return {
    username: [{required: true, trigger: "blur", message: "请输入手机号"}],
    password: [{required: true, trigger: "blur", message: "请输入密码"}, {min: 6, message: "密码长度不能少于6位", trigger: "blur",}],
    captchaCode: [{required: true, trigger: "blur", message: "请输入验证码",}],
  }
})

const getLoginTitle = ()=>{
  let str = 'jishuzhongtaigongjudiedai'
  loginBigTit.value = '技术中台工具迭代'
  loginEnTit.value = str.toUpperCase()
  FormTitle.value = '欢迎登录'
}

const checkCapslock = ()=>{

}

const handleLogin = ()=>{

}


onMounted(async ()=>{
  await getLoginTitle()
})

</script>
<style scoped lang="scss">
@use '../../styles/login/logined.scss';
</style>
