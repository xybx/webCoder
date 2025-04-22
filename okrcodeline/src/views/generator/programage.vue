<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{title}}</span>
      </div>
    </template>
    <div class="text item">
      <queryForm ref="queryRef" :grams="true" @queryData="queryClick" @handleAdd="handleAdd" @exportGram="handleExport" />
      <el-table ref="tableRef" :data="tableData" border v-loading="tabloading" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column v-for="item in tableColumns" align="center" :key="item.prop" :label="item.label">
            <template v-if="item.prop == 'owner'" #default="{ row ,$index}">
                {{ row[item.prop] == userid ? '创建' : '关联'}}
            </template>
            <template v-else #default="{ row ,$index}">
              {{row[item.prop] ? row[item.prop] : '暂无数据'}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
              <template #default="{ row ,$index}">
                <el-button v-if="row.owner == userid" type="primary" @click="editClick(row.pid)">编辑</el-button>
                <el-button type="danger" @click="delClick(row.pid,row.owner)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="pageSizes" background layout="total, sizes , prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <gramDialog ref="gramRef" :exportBtn="exportBtn" @getData="getTableList" />
  </el-card>
</template>

<script setup lang="ts">
  import type {queryPorps, TableProps, TabPorps} from "./ts/Types.ts";
  import queryForm from './components/queryForm.vue';
  import gramDialog from './components/gramDialog.vue';
  import {delGram, getGramList} from "./api/gramapi.ts";

  defineOptions({
    name: 'Programage',
  })

  const route = useRoute()
  let title:any = route.meta.title
  const tableData = ref<TableProps[] | []>([])
  const tabloading = ref<boolean>(true)
  const loadingText = ref<string>('正在加载...')
  const queryRef = ref<any>()
  const tableRef = ref<any>()
  const gramRef = ref<any>()
  const tableColumns = ref<TabPorps[] | []>([])
  const total = ref<number>(0)
  const pageSizes = ref<number[]>([10,15,20,30])
  const pageSize = ref<number>(10)
  const pageNum = ref<number>(1)
  const formdata = ref<queryPorps>({})
  const exportBtn =ref<boolean>(false)
  const $baseMessage = inject<any>('$baseMessage')
  const $baseConfirm = inject<any>('$baseConfirm')
  let userid = JSON.parse(sessionStorage.getItem('userinfo') as string).pid

  const getTableColumns = ()=>{
    tableColumns.value = [
      {prop:'name',label:'项目名称'},
      {prop:'type',label:'项目类型'},
      {prop:'des',label:'项目描述'},
      {prop:'owner',label:'项目所有'},
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
    let res:any = await getGramList(params)
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

  const handleExport = ()=>{
     exportBtn.value = true
     gramRef.value.showProam()
  }

  const queryClick = (obj:queryPorps)=>{
    formdata.value = obj
    getTableList()
  }

  const handleAdd = ()=>{
    gramRef.value.showGram(null,1)
    exportBtn.value = false
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
    gramRef.value.showGram(pid,2)
    exportBtn.value = false
  }

  const delClick = (pid:number,owner:number)=>{
     $baseConfirm(`${owner == userid ? '删除此项目将删除所有项目相关内容，确定要删除吗？' : '你确定要删除吗？' }`,'删除提示',async ()=>{
       let res:any = await delGram({pid:pid})
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
