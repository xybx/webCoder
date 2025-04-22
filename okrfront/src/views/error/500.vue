<template>
  <div class="error-container">
    <div class="error-content">
      <div class="pic-error">
        <vab-icon class="error-svg" icon="500" is-custom-svg />
      </div>
      <div class="bullshit">
        <div class="bullshit-oops">{{ oops }}</div>
        <div class="bullshit-headline">{{ headline }}</div>
        <div class="bullshit-info">{{ info }}</div>
        <router-link v-slot="{ navigate }" custom to="/">
          <el-button type="primary" @click="navigate">{{ btn }}</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const oops = ref<string>('抱歉！')
const headline = ref<string>('服务器发生错误。')
const info = ref<string>('请稍后重试，或点击下面的按钮返回首页。')
const btn = ref<string>('返回首页')
</script>

<style lang="scss">
@import './scss/error';
</style>
