<template>
    <el-dialog :modelValue="dialogVisible" :title="title" width="68%" class="frontbox" :close-on-click-modal="false" :before-close="handleClose" :append-to-body="true" align-center center>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in tabsData" :key="index" :label="item.label" :name="index+1">
            <code-editor :modleValue="item.code" class="codeEdit" />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="large" @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts">
  import CodeEditor from './codemirror.vue'
  import {ArrayTypeProps} from "/@/views/login/ts/loginType.ts";
  import {TabsPaneContext} from "element-plus";
  import {getAddCodes, getListCodes, putTailCode} from "/@/views/generator/api/generatorapi.ts";
  const dialogVisible = ref<boolean>(false)
  const title = ref<string>('')
  const activeName = ref<any>()
  const tabsData = ref<ArrayTypeProps[]| []>([])

  const showCode = async (uid:number,arr:number[],index:number)=>{
    title.value = '在线预览'
    let pids = arr.join(',')
    let params = {pids:pids,uuid:uid}
    let res:any = index == 1 ? await getListCodes(params) : index == 2 ? await getAddCodes(params) : await putTailCode(params)
    if(res.code == 200){
      tabsData.value = res.data.length > 0 ? res.data.map((item:any)=>{
        return {
          label:item.filename,
          code:item.code
        }
      }) : []
    }
    activeName.value = 1
    dialogVisible.value = true
  }

  const handleClick = (tab: TabsPaneContext, event: Event)=>{
    activeName.value = tab.props.name
  }

  const handleClose = ()=>{
    title.value = ''
    activeName.value = 1
    tabsData.value = []
    dialogVisible.value = false
  }


  defineExpose({
    showCode
  })

</script>

<style scoped lang="scss">

</style>
