<template>
  <el-dialog :modelValue="dialogVisible" :title="title" width="36%" class="dialogbox" :close-on-click-modal="false" :before-close="handleClose" :append-to-body="true" align-center center>
    <el-form ref="codesRef" :model="codeform" :rules="codeRules" label-width="120px" status-icon>
      <el-form-item :label="translate('模板名称')" prop="name">
        <el-input type="text" v-model="codeform.name" :placeholder="translate('请输入模板名称')" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="translate('模板类型')" prop="typepid">
        <el-select v-model="codeform.typepid" placeholder="请选择模板类型" clearable :filterable="true">
          <el-option v-for="item in codeData" :key="item.pid" :value="item.pid as number" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="translate('预览图路径')" prop="img">
        <el-input type="text" v-model="codeform.img" :placeholder="translate('请输入预览图路径')" autocomplete="off" clearable />
        <span class="remark">(注：vue静态图片加载路径)</span>
      </el-form-item>
      <el-form-item :label="translate('模板文件路径')" prop="path">
        <el-input type="textarea" v-model="codeform.path" :placeholder="translate('请输入模板文件路径')" :rows="3" autocomplete="off" clearable />
        <span class="remark">(注：后端部署地址下所在”qianduan”文件夹的路径)</span>
      </el-form-item>
      <el-form-item :label="translate('模板描述')">
        <el-input type="textarea" v-model="codeform.des" :placeholder="translate('请输入模板描述')" :rows="5" clearable />
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
import {translate} from "/@/i18n";
import type {queryPorps} from "/@/views/generator/ts/Types.ts";
import type { ArrayTypeProps } from "/@/views/login/ts/loginType.ts";
import {editCode, getCode, getTemsStyle, putCode} from "../api/comcodeapi.ts";
import {ElLoading} from "element-plus";

const dialogVisible = ref<boolean>(false)
const title = ref<string>('')
const createFormData = ()=>({
    name:'',
    typepid:'',
    img:'',
    path:'',
    des:''
})
let codeform = ref<queryPorps>(createFormData())
const codesRef = ref<any>()
const keys = ref<any>(null)
const codeData = ref<ArrayTypeProps[] | []>([])
const $baseMessage = inject<any>('$baseMessage')
const props = defineProps<{tempid:number}>()
const emit = defineEmits(['getData'])

const codeRules = reactive<any>({
  name: [{required: true, trigger: 'blur', message: '请输入模板名称',}],
  typepid:[{required: true, trigger: 'change', message: '请选择模板类型',}],
  img:[{required: true, trigger: 'blur', message: '请输入预览图路径',}],
  path:[{required: true, trigger: 'blur', message: '请输入模板文件路径',}],
})

const showCode = async (pid:string|number,index:number)=>{
  keys.value = index
  title.value = index == 1 ? '通用代码模板添加' : '通用代码模板编辑'
  await getTems()
  if(pid) await getCodeInfo(pid)
  dialogVisible.value = true
}

const getCodeInfo = async (pid:string|number)=>{
  let { data } = await getCode({pid:pid})
  codeform.value = data
}

const getTems = async ()=>{
  let {data} = await getTemsStyle()
  codeData.value = data.length > 0 ? data.map((item:any)=>{
    return {
      pid:item.value,
      label:item.text
    }
  }) : []
}

const saveData = ()=>{
   if(codesRef.value){
      codesRef.value.validate(async (valid:any)=>{
        if(valid){
          const loading = ElLoading.service({
            lock: true,
            text: '保存中...',
            background: 'rgba(0, 0, 0, 0.5)',
          })
          try {
            let data = Object.assign({},codeform.value,{templatestylepid:props.tempid})
            let res:any = keys.value == 1 ? await putCode(data) : await editCode(data)
            if(res.code == 200){
              setTimeout(() => {
                loading.close()
                $baseMessage('保存成功','success')
                getData()
                handleClose()
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
    codesRef.value.resetFields()
    Object.assign(codeform.value,createFormData())
    dialogVisible.value = false
}


const getData = ()=>{
    emit('getData')
}

defineExpose({
  showCode
})




</script>

<style scoped lang="scss">

</style>
