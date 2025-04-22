<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{title}}</span>
      </div>
    </template>
    <div class="text item">
      <menuNav ref="menuRef" @tabClick="handleClick" />
      <buttonRef ref="btnRef" :leftBtn="leftBtnObj" :rightBtn="rightBtnObj" @leftClick="leftClick" @rightClick="rightClick" />
      <queryRef ref="queRef" v-model:queryForm="queryForm" :queryData="queryList" v-model:labelwidth="labelwidth" />
      <tableRef ref="tableRefs"
                v-model:tableData="tableData"
                v-model:tableColumns="tableColumns"
                v-model:tabloading="tabloading"
                v-model:loadingText="loadingText"
                v-model:operateBtn="operateBtn"
                @sortClick="sortChange"
                @rowClick="rowClick"
                @selectClick="handleSelectionChange"
                @operateClick="operateClick"
                @formatData="formatStatus"/>
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="pageSizes" background layout="total, sizes , prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      <editDialog ref="editRef" v-model:dialogList="dialogList"  @getData="getTableList" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import buttonRef from '/@/components/global/buttonRef.vue'
  import queryRef from '/@/components/global/queryRef.vue'
  import menuNav from '/@/components/global/menuNav.vue'
  import tableRef from '/@/components/global/tableRef.vue'
  import editDialog from '/@/components/global/editDialog.vue'
  import type {TableColumnProps, TableProps, ButtonProps, JsonProps, DialogProps} from "/@/types/listTypes.ts";
  import {getSourceList} from "/@/api/listapi.ts";
  import {translate} from "/@/i18n";
  import { getTopButton } from '/@/utils/Button.ts'
  defineOptions({
    name:'List'
  })

  const route = useRoute()
  let title:any = route.meta.title
  const btnRef = ref<any>()
  const queRef = ref<any>()
  const tableRefs = ref<any>()
  const tableData = ref<TableProps[]| []>([])
  const tabloading = ref<boolean>(true)
  const tableColumns = ref<TableColumnProps[] | []>([])
  const loadingText = ref<string>('')
  const total = ref<number>(0)
  const pageSizes = ref<number[]>([10,15,20,30])
  const pageSize = ref<number>(10)
  const pageNum = ref<number>(1)
  const leftBtnObj = ref<ButtonProps[]|[]>([])
  const rightBtnObj = ref<ButtonProps[]|[]>([])
  const operateBtn = ref<ButtonProps[]|[]>([])
  const sortColumn= ref<string | null>('pid')
  const sortType= ref<string | null>('DESC')
  const editRef = ref<any>()
  const tailRef = ref<any>()
  const menuRef = ref<any>()
  const labelwidth = ref<string>('80px')
  const queryList = ref<JsonProps[]|[]>([])
  const tableList = ref<JsonProps>({})
  let queryForm = reactive<any>({})
  const dialogList = ref<DialogProps>({});

  // 获取头部左侧及右侧按钮配置或自己配置json
  const getButton = ()=>{
    leftBtnObj.value = getTopButton([{name:'新增',funName:'addClick'},{name:'批量删除',funName:'batchDel'}]) as ButtonProps[]
    rightBtnObj.value = getTopButton([{name:'搜索',funName:'searchClick'},{name:'重置',funName:'resetClick'}]) as ButtonProps[]
  }

  //头部切换事件
  const handleClick = (val:number)=>{
    let arr = [1,2,3]
    if(arr.includes(val)){

    }
  }


  const getTableOptions = ()=>{
    // tableList.value = {
    //   parentEleTag:'el-table',
    //   parentOptions:{
    //     data:tableData.value,
    //     border:true,
    //     stripe:true,
    //     'tooltip-effect':'light',
    //     'tooltip-options':{
    //       placement:'bottom',teleported:true
    //     },
    //     'default-sort':{
    //       prop: 'pid',
    //       order: 'descending'
    //     },
    //     'v-loading':tabloading.value,
    //     'element-loading-text':loadingText.value
    //   },
    //   parentEvent:{
    //
    //   },
    //   childEleTag:'',
    //   childOptions:{
    //
    //   },
    //   tableColumns:[],
    //   formatColumns:'',
    //   opearEleTag:'',
    //   opearOptions:{},
    //   opearBtnTag:'',
    //   opearBtnData:[]
    // }
  }

  // 获取查询条件接口或json
  const getQueryList = ()=>{
    queryList.value = [
      {
        parentEleTag:'el-form-item',
        parentOptions:{
           label:'项目名称:',
        },
        bindVal: 'name',
        curEleTag: 'el-input',
        curOptions: {
          placeholder:translate('请输入项目名称'),
          clearable:true,
          autocomplete:"off",
          type:'text'
        }
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
           label:'项目类型:',
        },
        bindVal: 'projectType',
        curEleTag: 'el-select',
        childEleTag: 'el-option',
        curOptions: {
          placeholder: translate('请选择项目类型'),
          clearable:true,
        },
        childOptions:[
          { value: 1, label: '类型一' },
          { value: 1, label: '类型二' }
        ]
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
           label:'项目时间:',
        },
        bindVal: 'date',
        curEleTag: 'el-date-picker',
        curOptions: {
          placeholder:translate('选择项目时间'),
          clearable:true,
          type:'datetime',
          'value-format':'yyyy-MM-dd HH:mm:ss'
        }
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
           label:'委托单位:',
        },
        bindVal: 'depart',
        curEleTag: 'el-input',
        curOptions: {
          placeholder:translate('请输入委托单位'),
          clearable:true,
          autocomplete:"off",
          type:'text'
        }
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
           label:'编制名称:',
        },
        bindVal: 'pname',
        curEleTag: 'el-input',
        curOptions: {
          placeholder:translate('请输入项目名称'),
          clearable:true,
          autocomplete:"off",
          type:'text'
        }
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
           label:'编制类型:',
        },
        bindVal: 'pType',
        curEleTag: 'el-select',
        childEleTag: 'el-option',
        curOptions: {
          placeholder: translate('请选择项目类型'),
          clearable:true,
        },
        childOptions:[
          { value: 1, label: '类型一' },
          { value: 2, label: '类型二' }
        ]
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
           label:'编制时间:',
        },
        bindVal: 'pdate',
        curEleTag: 'el-date-picker',
        curOptions: {
          placeholder:translate('选择项目时间'),
          clearable:true,
          type:'datetime',
          'value-format':'yyyy-MM-dd HH:mm:ss'
        }
      },
      {
        parentEleTag:'el-form-item',
        parentOptions:{
          label:'编制单位:',
        },
        bindVal: 'pdepart',
        curEleTag: 'el-input',
        curOptions: {
          placeholder:translate('请输入委托单位'),
          clearable:true,
          autocomplete:"off",
          type:'text'
        }
      },
    ]
  }
  //格式化表格某些字段的数据
  const formatStatus = (obj:any)=>{
      return obj == 0 ? '未办理' : '已办理'
  }

  //列表字段数据获取或json配置
  const getTableColumns = ()=>{
    tableColumns.value = [
      {prop:'pid',label:'序号'},
      {prop:'projectinfoname',label:'项目名称'},
      {prop:'name',label:'委托单位'},
      {prop:'url',label:'编制单位'},
      {prop:'status',label:'状态'},
      {prop:'drivermsgname',label:'规划编制范围'},
      {prop:'schemaname',label:'项目进度'},
      {prop:'dsname',label:'多数据源标识'},
      {prop:'drivermsgname',label:'规划编制范围'},
      {prop:'schemaname',label:'项目进度'},
      {prop:'dsname',label:'多数据源标识'},
    ]
  }

  const getOperate = ()=>{
    operateBtn.value = getTopButton([{name:'编辑',funName:'editClick'},{name:'查看',funName:'lookClick'},{name:'删除',funName:'delClick'}]) as ButtonProps[]
  }

  //添加事件
  const addClick = ()=>{
    console.log('add')
  }

  //批量删除
  const batchDel = ()=>{
    console.log('del')
  }

  //获取模板
  const getTemplate = ()=>{

  }

  //导入
  const getImport = ()=>{

  }

  //导出
  const getExport = ()=>{

  }

  //查询搜索事件
  const querySearch = ()=>{
    getTableList()
  }

  //重置
  const queryReset = ()=>{
    queryForm = {}
    getTableList()
  }

  const leftClick = (name:string)=>{
    const func = eval(name)
    func()
  }

  const rightClick = (name:string)=>{
    const func = eval(name);
    func()
  }

  //排序事件
  const sortChange = async (column:any)=>{
    console.log(column)
      if(column.order != null && column.prop != null){
        sortColumn.value = column.prop;
        if (column.order == 'ascending') {
            sortType.value = 'ASC'
        } else if (column.order == 'descending') {
            sortType.value = 'DESC'
        }
      } else {
        sortType.value = null
        sortColumn.value = null
      }
      pageNum.value = 1
      await getTableList()
  }

  //列表行点击事件
  const rowClick = (row:any, column:any, event:any)=>{

  }

  //列表勾选事件
  const handleSelectionChange = (rows:any)=>{

  }

  //编辑事件
  const editClick = (pid:number)=>{

  }

  //查看事件
  const lookClick = (pid:number)=>{

  }

  //删除事件
  const delClick = (pid:number)=>{

  }

  //字符串转函数方法
  const operateClick = (name:string,pid:number)=>{
    const func = eval(name);
    func(pid)
  }

  //获取列表数据事件
  const getTableList = async ()=>{
    let params = {pageNum:pageNum.value,pageSize:pageSize.value}
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

  //分页条数事件
  const handleSizeChange = (val:number)=>{
    pageSize.value = val
    getTableList()
  }

  //页码切换事件
  const handleCurrentChange = (val:number)=>{
    pageNum.value = val
    getTableList()
  }

  //生命周期hooks
  onMounted(async () => {
    await getQueryList()
    await getButton()
    await getTableColumns()
    await getOperate()
    await getTableList()
  })





</script>

<style scoped lang="scss">
@use '/@/styles/base/base.scss';
@use '/@/styles/listpage/listpage.scss';
</style>
