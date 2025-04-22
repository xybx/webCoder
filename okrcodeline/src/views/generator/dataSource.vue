<template>
   <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{title}}</span>
      </div>
    </template>
    <div class="text item">
      <queryForm ref="queryRef" :source="true" @queryData="queryClick" @handleAdd="handleAdd" />
      <el-table ref="tableRef" :data="tableData" border v-loading="tabloading" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column v-for="item in tableColumns" align="center" :key="item.prop" :label="item.label">
            <template #default="{ row ,$index}">
              {{row[item.prop] ? row[item.prop] : '暂无数据'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
              <template #default="{ row ,$index}">
                <el-button type="primary" @click="editClick(row.pid)">编辑</el-button>
                <el-button type="danger" @click="delClick(row.pid)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="pageSizes" background layout="total, sizes , prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <sourceDialog ref="sourceRef" @getData="getTableList" />
  </el-card>
</template>

<script setup lang="ts">
  import type {queryPorps, TableProps, TabPorps} from "/@/views/generator/ts/Types.ts";
  import queryForm from './components/queryForm.vue'
  import sourceDialog from './components/sourceDialog.vue'
  import { delSource, getSourceList } from "./api/sourceapi.ts"

  defineOptions({
    name: 'DataSource',
  })

  const route = useRoute()
  let title:any = route.meta.title
  const tableData = ref<TableProps[] | []>([])
  const tabloading = ref<boolean>(true)
  const loadingText = ref<string>('正在加载...')
  const queryRef = ref<any>()
  const tableRef = ref<any>()
  const sourceRef = ref<any>()
  const tableColumns = ref<TabPorps[] | []>([])
  const total = ref<number>(0)
  const pageSizes = ref<number[]>([10,15,20,30])
  const pageSize = ref<number>(10)
  const pageNum = ref<number>(1)
  const formdata = ref<queryPorps>({})
  const $baseMessage = inject<any>('$baseMessage')
  const $baseConfirm = inject<any>('$baseConfirm')

   const getTableColumns = ()=>{
    tableColumns.value = [
      {prop:'projectinfoname',label:'项目名称'},
      {prop:'name',label:'数据源名称'},
      {prop:'url',label:'数据库连接地址'},
      {prop:'drivermsgname',label:'驱动名称'},
      {prop:'schemaname',label:'模式/空间名称'},
      {prop:'dsname',label:'多数据源标识'},
    ]
  }

  const getTableList = async ()=>{
    let params = {pageNum:pageNum.value,pageSize:pageSize.value}
    let obj = formdata.value
    let arr = Object.keys(obj)
    for(let i in obj){
        if(arr.includes(i)){
          Object.assign(params,obj)
        }
    }
    let res:any = await getSourceList(params)
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

  const queryClick = (obj:queryPorps)=>{
    formdata.value = obj
    getTableList()
  }

  const handleAdd = ()=>{
    sourceRef.value.showSource(null,1)
  }

  const handleSizeChange = (val:number)=>{
    pageSize.value = val
    getTableList()
  }

  const handleCurrentChange = (val:number)=>{
    pageNum.value = val
    getTableList()
  }

  const editClick = (pid:number)=>{
    sourceRef.value.showSource(pid,2)
  }

  const delClick = (pid:number)=>{
     $baseConfirm('你确定要删除吗？','删除提示',async ()=>{
       let res:any = await delSource({pid:pid})
       if(res.code == 200){
         $baseMessage('已删除成功','success')
         getTableList()
       }else {
         $baseMessage('删除失败','error')
       }
     })
  }
  watch(()=>route.path,async(newValue,oldValue)=>{
    getTableColumns()
    await getTableList()
    
  })
  tryOnMounted(async ()=>{
    getTableColumns()
    await getTableList()
  })
</script>

<style scoped lang="scss">
@use './style/manage.scss';
</style>
