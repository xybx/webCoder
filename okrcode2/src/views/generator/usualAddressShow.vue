<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{title}}</span>
      </div>
    </template>
    <div class="text item">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabsData" :key="item.pid as number" :label="item.label" :name="item.pid">
          <dl class="hlist" v-for="(item,index) in hrefData" :key="index">
            <dt>{{item.label}}:</dt>
            <dd v-for="val in item.children" :key="val.pid">
              <el-link :href="val.url" target="_blank">{{val.label}}</el-link>
            </dd>
          </dl>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import {getLink, getUsualAddressTypeSelected} from "./api/usualapi.ts";
  import type {ArrayTypeProps} from "/@/views/login/ts/loginType.ts";
  import {ElLoading, TabsPaneContext} from 'element-plus'
  defineOptions({
    name: 'usualAddressShow'
  })

  const route = useRoute()
  let title:any = route.meta.title
  const activeName = ref<any>()
  const tabsData = ref<ArrayTypeProps[]| []>([])
  const hrefData = ref<ArrayTypeProps[]| []>([])
  const loadUsualAddressShow = async ()=>{
    let res:any = await getUsualAddressTypeSelected()
    tabsData.value = res.data.length > 0 ? res.data.map((item:any)=>{
      return {
        pid:item.value,
        label:item.text
      }
    }) : []
    activeName.value = tabsData.value[0].pid
  }

  const getLinkData = async()=>{
    let params = {type:activeName.value}
    let {data} = await getLink(params)
    hrefData.value = data.length > 0 ? data.map((item:any)=>{
      return {
        label:item[0].groupname,
        children:item.map((val:any)=>{
          return {
            pid:val.pid,
            label:val.name,
            url:val.url
          }
        })
      }
    }) : []
  }

  const handleClick = async (tab: TabsPaneContext, event: Event)=>{
    activeName.value = tab.props.name
    await getLinkData()
  }


  tryOnMounted(async ()=>{
    await loadUsualAddressShow()
    await getLinkData()
  })



</script>
<style scoped lang="scss">
@use 'style/manage.scss';
</style>
