<template>
  <div class="generator-container">
    <el-row :gutter="15">
      <el-col :span="6">
        <el-tree
          :props="layerProps"
          :data="layerData"
          class="layer-tree"
          empty-text="暂无数据"
          ref="layerTree"
          :expand-on-click-node="false"
          :current-node-key="cnodekey"
          :highlight-current="highcurrent"
          :render-after-expand="false"
          node-key="pid"
          default-expand-all
          @node-click="menuClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              {{ data.label }}
            </span>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="18">
        <queryForm ref="queryRef" :codegentor="true" @queryData="queryClick" />
        <el-table ref="tableRef" :data="tableData" border v-loading="tabloading" max-height="675" :element-loading-text="loadingText">
            <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
            <el-table-column v-for="item in tableColumns" align="center" :key="item.prop" :label="item.label">
              <template #default="{ row ,$index}">
                {{row[item.prop] ? row[item.prop] : '暂无数据'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="{ row ,$index}">
                  <el-button type="primary" @click="frontClick(row.tableName)">前端</el-button>
                  <el-button type="danger" @click="endClick(row.tableName)">后端</el-button>
                  <el-button type="warning" @click="hisClick(row.tableName)">历史生成</el-button>
                </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <endhisdialog ref="endhis" :end="ends" @getFront="getFront" />
    <frontdialog ref="front" />
  </div>
</template>

<script lang="ts" setup>
  import queryForm from './components/queryForm.vue';
  import type {queryPorps, TableProps, TabPorps} from "/@/views/generator/ts/Types.ts";
  import {getGenList, getTree, putConfig} from "./api/generatorapi.ts";
  import endhisdialog from "./components/endhisdialog.vue"
  import frontdialog from "./components/frontdialog.vue"
  import {ElLoading, ElMessage} from "element-plus";
  const route = useRoute()
  defineOptions({
    name: 'Generator',
  })
  const tableData = ref<TableProps[] | []>([])
  const tabloading = ref<boolean>(true)
  const loadingText = ref<string>('正在加载...')
  const queryRef = ref<any>()
  const tableRef = ref<any>()
  const tableColumns = ref<TabPorps[] | []>([])
  const total = ref<number>(0)
  const pageSizes = ref<number[]>([10,15,20,30])
  const pageSize = ref<number>(99)
  const pageNum = ref<number>(1)
  const formdata = ref<queryPorps>({})
  const layerTree = ref<any>()
  const layerData = ref<any>([]);
  const cnodekey = ref<number>(0)
  const endhis = ref<any>()
  const front = ref<any>()
  const ends = ref<boolean>(false)
  const layerProps = {
    children: 'children',
    label: 'label',
  }
  const highcurrent = ref<boolean>(true)
  const $baseMessage = inject<any>('$baseMessage')
  const $baseConfirm = inject<any>('$baseConfirm')

  const getTableColumns = ()=>{
    tableColumns.value = [
      {prop:'tableName',label:'表名称'},
      {prop:'des',label:'表说明'},
    ]
  }

  const menuClick = (data:any)=>{
    highcurrent.value = true
    if(typeof data.pid == 'number'){
      cnodekey.value = data.pid
      getTableList()
    }
  }

  const getTreeData = async ()=>{
    let {data} = await getTree()
    getLayerData(data)
    if(data.length>0){
      cnodekey.value = data[0].children[0].id
      await getTableList()
    } else {
    tableData.value = [];
    tabloading.value = false;
    ElMessage.warning('未获取到项目')
  }
    
  }

  const getLayerData = (arr:any)=>{
    layerData.value = arr.map((item:any)=>{
      return {
        pid:item.id,
        label:item.title,
        children:item.children && item.children.length > 0 ? getLayerData(item.children): null
      }
    })
    return layerData.value
  }

  const getTableList = async ()=>{
    let params = {pageNum:pageNum.value,pageSize:pageSize.value,pid:cnodekey.value}
    layerTree.value.setCurrentKey(cnodekey.value)
    let obj = formdata.value
    let arr = Object.keys(obj)
    for(let i in obj){
        if(arr.includes(i)){
          Object.assign(params,obj)
        }
    }
    let res:any = await getGenList(params)
    if(res.code == 200){
      tableData.value = res.data
      total.value = res.data.length
    }else {
      tableData.value = []
      total.value = 0
    }
    setTimeout(() => {
      tabloading.value = false
    }, 200)
  }

  const hisClick = (tabname:string)=>{
    endhis.value.showHistory(tabname,cnodekey.value)
    ends.value = false
  }

  const frontClick = async (tabname:string)=>{
    let data = {tablename:tabname,datasourcepid:cnodekey.value}
    let res:any = await putConfig(data)
    if(res.code == 200){
      front.value.showFront(res.data)
    }else {
      $baseMessage('添加关联配置失败','error')
    }
  }

  const getFront = (uid:string)=>{
    const loading = ElLoading.service({
      lock: true,
      text: '打开中...',
      background: 'rgba(255, 255, 255, 0.5)',
    })
    front.value.showFront(uid)
    loading.close()
  }

  const endClick = (tabname:string)=>{
    endhis.value.showEnd(cnodekey.value,tabname)
    ends.value = true
  }

  const queryClick  = (obj:queryPorps)=>{
    formdata.value = obj
    getTableList()
  }
  watch(()=>route.path,async(newValue,oldValue)=>{
    await getTreeData()
    getTableColumns()
    
  })
  tryOnMounted(async ()=>{
    await getTreeData()
    getTableColumns()

  })

</script>
<style lang="scss" scoped>
@use './style/generator.scss';
</style>
