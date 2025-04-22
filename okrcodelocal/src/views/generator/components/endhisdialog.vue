<template>
  <el-dialog :modelValue="dialogVisible" :title="title" width="60%" class="endhisbox" :close-on-click-modal="false" :before-close="props.end ? handleClose : hisClose" :append-to-body="true" align-center center>
    <template v-if="!props.end">
      <el-table ref="tableRef" :data="tableData" border v-loading="tabloading" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column v-for="item in tableColumns" align="center" :key="item.prop" :label="item.label">
            <template #default="{ row ,$index}">
              {{row[item.prop] ? row[item.prop] : '暂无数据'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
              <template #default="{ row ,$index}">
                <el-button type="primary" @click="comeClick(row.uuid)">继续生成</el-button>
              </template>
          </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="pageSizes" background layout="total, sizes , prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </template>
    <template v-else>
      <el-form ref="endRef" :model="endform" :inline="true" :rules="endRules" label-width="120px" status-icon>
          <el-form-item :label="translate('包名前缀')" prop="packName">
            <el-input type="text" v-model="endform.packName" :placeholder="translate('请输入包名前缀')" autocomplete="off" clearable @input="packChange" />
          </el-form-item>
          <el-form-item :label="translate('controller包名')" prop="controllerName">
            <el-input type="text" v-model="endform.controllerName" :placeholder="translate('请输入controller包名')" autocomplete="off" clearable @input="conChange" />
          </el-form-item>
          <el-form-item :label="translate('实体类包名')" prop="domianName">
              <el-input type="text" v-model="endform.domianName" :placeholder="translate('请输入实体类包名')" autocomplete="off" clearable @input="domainChange" />
            </el-form-item>
          <el-form-item :label="translate('service包名')" prop="serviceName">
            <el-input type="text" v-model="endform.serviceName" :placeholder="translate('请输入service包名')" autocomplete="off" clearable @input="serviceChange" />
          </el-form-item>
          <el-form-item :label="translate('impl包名')" prop="serviceImplName">
            <el-input type="text" v-model="endform.serviceImplName" :placeholder="translate('请输入impl包名')" autocomplete="off" clearable @input="implChange" />
          </el-form-item>
          <el-form-item :label="translate('mapper包名')" prop="mapperName">
            <el-input type="text" v-model="endform.mapperName" :placeholder="translate('请输入mapper包名')" autocomplete="off" clearable @input="mapperChange" />
          </el-form-item>
          <el-form-item :label="translate('xml位置')" prop="xmlName">
            <el-input type="text" v-model="endform.xmlName" :placeholder="translate('请输入xml包名')" autocomplete="off" clearable @input="xmlChange" />
          </el-form-item>
          <el-form-item :label="translate('vo包名')" prop="pojoName">
            <el-input type="text" v-model="endform.pojoName" :placeholder="translate('请输入vo包名')" autocomplete="off" clearable @input="voChange" />
          </el-form-item>
      </el-form>
      <el-divider />
      <dl class="hlist">
        <dt>文件路径预览</dt>
        <div class="filewarp">
          <dd v-for="(item,index) in previewList" :key="index">
            <label>{{item.label}}:</label>
            <span>{{item.value}}</span>
          </dd>
        </div>
      </dl>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="props.end" type="primary" @click="zipData">生成zip</el-button>
        <el-button v-if="props.end" @click="handleClose">关闭</el-button>
        <el-button v-if="!props.end" @click="hisClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import type {queryPorps, TableProps, TabPorps} from "/@/views/generator/ts/Types.ts";
  import {translate} from "/@/i18n";
  import {ArrayTypeProps} from "/@/views/login/ts/loginType.ts";
  import {getFormObj, getHistoryList, putEnd} from "/@/views/generator/api/generatorapi.ts";
  import {ElLoading} from "element-plus";
  const dialogVisible = ref<boolean>(false)
  const title = ref<string>('')
  const tableData = ref<TableProps[] | []>([])
  const tabloading = ref<boolean>(true)
  const loadingText = ref<string>('正在加载...')
  const tableRef = ref<any>()
  const tableColumns = ref<TabPorps[] | []>([])
  const total = ref<number>(0)
  const pageSizes = ref<number[]>([10,15,20,30])
  const pageSize = ref<number>(10)
  const pageNum = ref<number>(1)
  const dspid = ref<string| number>()
  const tablename = ref<string>('')
  let epid = ref<string| number>()
  let htabname = ref<string>('')
  const props = defineProps<{end?:boolean}>()
  const $baseMessage = inject<any>('$baseMessage')
  const emit = defineEmits(['getData','getFront'])
  let createFormData = ()=>({
    packName:'',
    controllerName:'',
    domianName:'',
    serviceName:'',
    serviceImplName:'',
    mapperName:'',
    xmlName:'',
    pojoName:''
  })
  let endform = ref<queryPorps>(createFormData())
  const endRef = ref<any>()
  const previewList = ref<ArrayTypeProps[]| []>([])
  const endRules = reactive<any>({
    packName: [{required: true, trigger: 'blur', message: '请输入包名前缀',}],
    controllerName: [{required: true, trigger: 'blur', message: '请输入controller包名',}],
    domianName:[{required: true, trigger: 'blur', message: '请输入实体类包名',}],
    serviceName:[{required: true, trigger: 'blur', message: '请输入service包名',}],
    serviceImplName:[{required: true, trigger: 'blur', message: '请输入impl包名',}],
    mapperName:[{required: true, trigger: 'blur', message: '请输入mapper包名',}],
    xmlName:[{required: true, trigger: 'blur', message: '请输入xml位置',}],
    pojoName:[{required: true, trigger: 'blur', message: '请输入vo包名',}]
  })

  const getPreview = ()=>{
    previewList.value = [
      {label:'controller',value:`src/main/java/${endform.value.packName ? `${endform.value.packName.replaceAll('.','/')}/`:''}${endform.value.controllerName ? `${endform.value.controllerName.replaceAll('.','/')}`:''}`},
      {label:'service',value:`src/main/java/${endform.value.packName ? `${endform.value.packName.replaceAll('.','/')}/`:''}${endform.value.serviceName ? `${endform.value.serviceName.replaceAll('.','/')}` : ''}`},
      {label:'impl',value:`src/main/java/${endform.value.packName ? `${endform.value.packName.replaceAll('.','/')}/`:''}${endform.value.serviceImplName ? `${endform.value.serviceImplName.replaceAll('.','/')}` : ''}`},
      {label:'实体类',value:`src/main/java/${endform.value.packName ? `${endform.value.packName.replaceAll('.','/')}/`:''}${endform.value.domianName ? `${endform.value.domianName.replaceAll('.','/')}` : ''}`},
      {label:'mapper',value:`src/main/java/${endform.value.packName ? `${endform.value.packName.replaceAll('.','/')}/`:''}${endform.value.mapperName ? `${endform.value.mapperName.replaceAll('.','/')}` : ''}`},
      {label:'xml',value:`src/main/java/${endform.value.packName ? `${endform.value.packName.replaceAll('.','/')}/`:''}${endform.value.xmlName ? `${endform.value.xmlName.replaceAll('.','/')}` : ''}`},
      {label:'vo',value:`src/main/java/${endform.value.packName ? `${endform.value.packName.replaceAll('.','/')}/`:''}${endform.value.pojoName ? `${endform.value.pojoName.replaceAll('.','/')}` : ''}`},
    ]
  }

  const getTableColumns = ()=>{
    tableColumns.value = [
      {prop:'uuid',label:'uuid'},
      {prop:'tablename',label:'表名'},
      {prop:'creater',label:'创建人'},
      {prop:'createtime',label:'创建时间'}
    ]
  }

  const getTableList = async ()=>{
    let params = {pageNum:pageNum.value,pageSize:pageSize.value,datasourcepid:dspid.value,tablename:htabname.value}
    let res:any = await getHistoryList(params)
    if(res.code == 200){
      tableData.value = res.data.list
      total.value = res.data.total
    }else {
      tableData.value = []
      total.value = 0
    }
    setTimeout(() => {
      tabloading.value = false
    }, 200)
  }

  const handleSizeChange = (val:number)=>{
    pageSize.value = val
    getTableList()
  }

  const handleCurrentChange = (val:number)=>{
    pageNum.value = val
    getTableList()
  }

  const showEnd = async (pid:string|number,tabname:string)=>{
    title.value = '后端代码生成'
    epid.value = pid
    tablename.value = tabname
    await getObjectData()
    await getPreview()
    dialogVisible.value = true
  }

  const getObjectData = async ()=>{
    let res:any = await getFormObj({pid:epid.value})
    if(res.code == 200){
      endform.value = res.data
    }
  }

  const showHistory = async (tabname:string,pid:string|number)=>{
    title.value = '历史配置'
    dspid.value = pid
    htabname.value = tabname
    getTableColumns()
    await getTableList()
    dialogVisible.value = true
  }

  const zipData = ()=>{
    if(endRef.value){
      endRef.value.validate(async (valid:any)=>{
        if(valid){
          const loading = ElLoading.service({
            lock: true,
            text: '下载中...',
            background: 'rgba(0, 0, 0, 0.5)',
          })
          try {
            let a = document.createElement("a");
            let event = new MouseEvent("click");
            a.download = '文件下载.zip';
            a.href = `${import.meta.env.VITE_APP_BASE_URL}/datasource/generatorHD?pid=${epid.value}&tableName=${tablename.value}&packName=${endform.value.packName}&domianName=${endform.value.domianName}&controllerName=${endform.value.controllerName}&serviceName=${endform.value.serviceName}&serviceImplName=${endform.value.serviceImplName}&mapperName=${endform.value.mapperName}&xmlName=${endform.value.xmlName}&pojoName=${endform.value.pojoName}`
            a.dispatchEvent(event);
            setTimeout(() => {
              loading.close()
              $baseMessage('操作成功，稍后请在下载列表查看','success')
              getData()
              handleClose()
            }, 1000)
          } catch (e) {
            $baseMessage(e,'error')
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

  const packChange = (val:string)=>{
      getPreview()
  }

  const conChange = (val:string)=>{
      getPreview()
  }

  const domainChange = (val:string)=>{
      getPreview()
  }

  const serviceChange = (val:string)=>{
      getPreview()
  }

  const implChange = (val:string)=>{
      getPreview()
  }

  const mapperChange = (val:string)=>{
      getPreview()
  }

  const xmlChange = (val:string)=>{
      getPreview()
  }

  const voChange = (val:string)=>{
    getPreview()
  }

  const getData = ()=>{
    emit('getData')
  }

  const comeClick = (uid:string)=>{
    emit('getFront',uid)
    title.value = ''
    dialogVisible.value = false
  }

  const handleClose = ()=>{
    title.value = ''
    endRef.value.resetFields()
    Object.assign(endform.value,createFormData())
    dialogVisible.value = false
  }

  const hisClose = ()=>{
    title.value = ''
    tableData.value = []
    tableColumns.value = []
    dialogVisible.value = false
  }

  tryOnMounted(()=>{

  })

  defineExpose({
    showEnd,
    showHistory
  })

</script>

<style scoped lang="scss">

</style>
