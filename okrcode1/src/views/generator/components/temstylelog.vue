<template>
  <el-dialog :modelValue="dialogVisible" :title="title" width="36%" class="dialogbox" :close-on-click-modal="false" :before-close="handleClose" :append-to-body="true" align-center center>
     <el-form ref="temsRef" :model="temform" :rules="temRules" label-width="120px" status-icon>
      <el-form-item :label="translate('模板风格名称')" prop="name">
        <el-input type="text" v-model="temform.name" :placeholder="translate('请输入模板风格名称')" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="translate('模板风格描述')">
        <el-input type="textarea" v-model="temform.des" :placeholder="translate('请输入模板风格描述')" :rows="5" />
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
  import { ElLoading } from 'element-plus'
  import {editTemStyle, getTemStyle, putTemStyle} from "/@/views/generator/api/tstyleapi.ts";
  const dialogVisible = ref<boolean>(false)
  const title = ref<string>('')
  const createFormData = ()=>({
    name:'',
    des:'',
  })
  let temform = ref<queryPorps>(createFormData())
  const temsRef = ref<any>()
  const keys = ref<any>(null)
  const $baseMessage = inject<any>('$baseMessage')
  const emit = defineEmits(['getData'])

  const temRules = reactive<any>({
    name: [{required: true, trigger: 'blur', message: '请输入项目名称',}]
  })

  const showTem = async (pid:string|number,index:number)=>{
    keys.value = index
    title.value = index == 1 ? '模板风格添加' : '模板风格编辑'
    if(pid) await getTemInfo(pid)
    dialogVisible.value = true
  }

  const getTemInfo = async (pid:string|number)=>{
    let { data } = await getTemStyle({pid:pid})
    temform.value = data
  }

  const saveData = ()=>{
    if(temsRef.value){
      temsRef.value.validate(async (valid:any)=>{
        if(valid){
          const loading = ElLoading.service({
            lock: true,
            text: '保存中...',
            background: 'rgba(0, 0, 0, 0.5)',
          })
          try {
            let data = Object.assign({},temform.value)
            let res:any = keys.value == 1 ? await putTemStyle(data) : await editTemStyle(data)
            if(res.code == 200){
              setTimeout(() => {
                $baseMessage('保存成功','success')
                getData()
                handleClose()
                loading.close()
              }, 1000)
            }else {
              $baseMessage('保存失败','error')
            }
          } finally {
            setTimeout(() => {
              loading.close()
            }, 1000)
          }
        }else {
          return
        }
      })
    }else {
      return
    }
  }

  const handleClose = ()=>{
      title.value = ''
      keys.value = null
      temsRef.value.resetFields()
      Object.assign(temform.value,createFormData())
      dialogVisible.value = false
  }

 const getData = ()=>{
    emit('getData')
  }

  defineExpose({
    showTem,
  })

</script>

<style scoped lang="scss">

</style>
