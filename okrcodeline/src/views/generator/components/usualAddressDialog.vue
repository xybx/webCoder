<template>
  <el-dialog :modelValue="dialogVisible" :title="title" width="32%" class="dialogbox" :close-on-click-modal="false" :before-close="handleClose" :append-to-body="true" align-center center>
    <el-form ref="usualAddressRef" :model="usualAddressform" label-width="90px" status-icon>
      <el-form-item :label="translate('网址名称')" prop="name">
        <el-input type="text" v-model="usualAddressform.name" :placeholder="translate('请输入网址名称')" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="translate('网址类型')" prop="group">
        <el-select v-model="usualAddressform.typepid" placeholder="请选择网址类型" clearable :filterable="true">
          <el-option v-for="item in typeData" :key="item.value" :value="item.pid as string" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="translate('网址分组')" prop="group">
        <el-select v-model="usualAddressform.grouppid" placeholder="请选择网址分组" clearable :filterable="true">
          <el-option v-for="item in groupData" :key="item.value" :value="item.pid as string" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="translate('网址地址')" prop="url">
        <el-input type="text" v-model="usualAddressform.url" :placeholder="translate('请输入网址地址')" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="translate('排序')" prop="sort">
        <el-input type="text" v-model="usualAddressform.sort" :placeholder="translate('请输入排序')" autocomplete="off" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="saveData">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import type {queryPorps} from '../ts/Types.ts'
  import {translate} from "/@/i18n";
  import type { ArrayTypeProps } from "/@/views/login/ts/loginType.ts";
  import {editUsualAddress,getUsualAddress,putUsualAddress,getUsualAddressTypeSelected,getUsualAddressGroupSelected} from "/@/views/generator/api/usualapi.ts";
  import { ElLoading } from 'element-plus'
  const dialogVisible = ref<boolean>(false)
  const title = ref<string>('')
  const createFormData = ()=>({
    name:'',
    password:'',
    username:''
  })
  let usualAddressform = ref<queryPorps>(createFormData())
  const usualAddressRef = ref<any>()
  const keys = ref<any>(null)
  const $baseMessage = inject<any>('$baseMessage')
  const emit = defineEmits(['getData'])
  const groupData =ref<ArrayTypeProps[]|[]>([])
  const typeData =ref<ArrayTypeProps[]|[]>([])

  const showUsualAddressform = async (pid:string|number,index:number)=>{
    keys.value = index
    title.value = index == 1 ? '网址添加' : '网址编辑'
    await getGroup()
    await getType()
    if(pid) await getUsualAddressform(pid)
    dialogVisible.value = true
  }

  const getUsualAddressform = async (pid:string|number)=>{
    let { data } = await getUsualAddress({pid:pid})
    usualAddressform.value = data
  }

  const getGroup = async ()=>{
    let { data } = await getUsualAddressGroupSelected()
    groupData.value = data.length > 0 ? data.map((item:any)=>{
      return {
        pid:item.value,
        label:item.text
      }
    }) : []
  }
  const getType = async ()=>{
    let { data } = await getUsualAddressTypeSelected()
    typeData.value = data.length > 0 ? data.map((item:any)=>{
      return {
        pid:item.value,
        label:item.text
      }
    }) : []
  }

  const saveData = ()=>{
    if (usualAddressRef.value){
      usualAddressRef.value.validate(async (valid:any)=>{
         if(valid){
          const loading = ElLoading.service({
            lock: true,
            text: '保存中...',
            background: 'rgba(0, 0, 0, 0.5)',
          })
          try {
            let data = Object.assign({},usualAddressform.value)
            let res:any = keys.value == 1 ? await putUsualAddress(data) : await editUsualAddress(data)
            if(res.code == 200){
              $baseMessage('保存成功','success')
              getData()
              handleClose()
            }else {
              $baseMessage('保存失败','error')
            }
          } finally {
            setTimeout(() => {
              loading.close()
            }, 1000)
          }
         }else {
           return false
         }
      })
    }else {
      return
    }
  }

  const getData = ()=>{
      emit('getData')
  }

  const handleClose = ()=>{
    title.value = ''
    keys.value = null
    usualAddressRef.value.resetFields()
    Object.assign(usualAddressform.value,createFormData())
    dialogVisible.value = false
  }

  defineExpose({
    showUsualAddressform,
  })
</script>

<style scoped lang="scss">
@use '../style/manage.scss';
</style>
