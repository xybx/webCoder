<template>
  <el-table ref="tableRef" class="tableref" :data="tableData" border stripe tooltip-effect="light" :tooltip-options="{placement:'bottom'}" :default-sort="{prop: 'pid', order: 'descending'}" v-loading="tabloading" :element-loading-text="loadingText" @sort-change='sortChange' @row-click='rowClick' @selection-change='handleSelectionChange'>
    <el-table-column type="selection" align="center" width="60px"></el-table-column>
    <el-table-column v-for="item in tableColumns" align="center" sortable show-overflow-tooltip :key="item.prop" :prop="item.prop" :label="item.label" :width="item.prop === 'pid' ?'80':'220'">
      <template v-if="item.prop == 'status'" #default="{ row ,$index}">
        {{ formatData(row[item.prop]) }}
      </template>
      <template v-if="item.list" #default="{ row ,$index}">
        {{
              row[item.prop]
                ?item.list.filter((val: any) => val.value == row[item.prop])
                    .length > 0? item.list.filter((val: any) => val.value == row[item.prop])[0].label
                : "暂未找到该条数据，或已删除"
                : "暂无数据"
            }}
      </template>
      <template #default="{ row ,$index}">
        {{ row[item.prop] ? row[item.prop] : '暂无数据' }}
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" align="center" width="300">
      <template #default="{ row ,$index}">
        <el-button v-for="item in operateBtn" :color="item.color ? item.color : ''" :size="item.size ? item.size : 'default'" @click="operateClick(item.funName as string,row.pid)">
          <template v-if="item.icon" #icon>
              <i class="iconfont" :class="item.icon ? item.icon : ''"></i>
          </template>
          {{item.name ? item.name : ''}}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
<!--  <component :is="tableList.tabeleTag" v-bind="tableList.tabOptions" v-on="tableList.tabevents">-->
<!--    <template v-if="tableList.elechildTag && tableList.tableColumns.length > 0">-->
<!--      <component v-for="item in tableList.tableColumns" :is="tableList.elechildTag" :prop="item.prop" :label="item.label" v-bind="tableList.childOptions">-->
<!--        <template v-if="tableList.formatColumns.split(',').indexOf(item.prop) > -1">-->
<!--          <template v-for="val in tableList.formatColumns.split(',')" #default="{ row ,$index}">-->
<!--            {{ formatData(row[val]) }}-->
<!--          </template>-->
<!--        </template>-->
<!--        <template v-else #default="{ row ,$index}">-->
<!--          {{ row[item.prop] ? row[item.prop] : '暂无数据' }}-->
<!--        </template>-->
<!--      </component>-->
<!--      <component :is="tableList.opeareleTag" v-bind="tableList.opearOptions">-->
<!--        <template v-if="tableList.opearBtnTag && tableList.opearBtnData.length > 0" #default="{ row ,$index}">-->
<!--          <component :is="tableList.opearBtnTag" v-for="item in tableList.opearBtnData" :color="item.color ? item.color : ''" :size="item.size ? item.size : 'default'" @click="operateClick(item.funName as string,row.pid)">-->
<!--            <template v-if="item.icon" #icon>-->
<!--              <i class="iconfont" :class="item.icon ? item.icon : ''"></i>-->
<!--            </template>-->
<!--            {{ item.name ? item.name : '' }}-->
<!--          </component>-->
<!--        </template>-->
<!--      </component>-->
<!--    </template>-->
<!--  </component>-->
</template>
<script setup lang="ts">
import type {ButtonProps, TableColumnProps, TableProps} from "/@/types/listTypes.ts";

  defineComponent({
    name:'tableRef'
  })
  const tableData = defineModel<TableProps[]>('tableData')
  const tableColumns = defineModel<TableColumnProps[]>('tableColumns')
  const tabloading = defineModel<boolean>('tabloading')
  const loadingText = defineModel<string>('loadingText')
  const operateBtn = defineModel<ButtonProps[]>('operateBtn')
  const tableList = defineModel<any>('tableList')
  const emits = defineEmits(['sortClick','rowClick','selectClick','operateClick','formatData'])


  const formatData = (obj:any)=>{
    emits('formatData',obj)
  }


  const sortChange = (column:any)=>{
    emits('sortClick',column)
  }

  const rowClick = (row:any, column:any, event:any)=>{
    emits('rowClick',row,column,event)
  }

  const handleSelectionChange = (rows:any)=>{
    emits('selectClick',rows)
  }

  const operateClick = (name:string,pid:number)=>{
    emits('operateClick',name,pid)
  }



</script>
<style scoped lang="scss">
@use '/@/styles/table/table.scss';
</style>
