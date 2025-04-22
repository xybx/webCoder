<template>
<!--  <el-dialog :modelValue="dialogVisible" :title="title" :width="dialogWidth" class="dialogBox" :close-on-click-modal="false" :before-close="handleClose" :append-to-body="true" align-center center>-->
<!--      <el-form ref="editsRef" :model="editForm" :rules="editRules" :label-width="labelWidth" status-icon>-->
<!--        &lt;!&ndash; 预留插槽 &ndash;&gt;-->
<!--        <slot name='first-form-item'></slot>-->
<!--        <template v-for="(item,index) in FormList" :key="index">-->
<!--          <el-form-item>-->

<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-form>-->
<!--  </el-dialog>-->

  <component :is="dialogList.parentEleTag" v-bind="dialogList.parentOptions" v-on="dialogList.parentEvent">
      <template v-if="dialogList.modeType == 'edit'">
        <component :is="dialogList.subEleTag" v-bind="dialogList.subOptions">
            <template v-for="(item,index) in dialogList.subData">
                <component :is="dialogList.subItemEleTag" ></component>
            </template>
        </component>
      </template>
  </component>

</template>

<script setup lang="ts">
  import type { DialogProps } from '/@/types/listTypes.ts'
  defineComponent({
    name:'editDialog'
  })
  const dialogVisible = ref<boolean>(false)
  const title = ref<string>('')
  const dialogWidth = ref<string>()
  const labelWidth = ref<string>()
  const FormList = ref<any>([])
  const dialogList = ref<DialogProps>({})
  // const createFormData = ()=>({
  //   // name:'',
  //   // typePid:'',
  //   // img:'',
  //   // path:'',
  //   // des:''
  // })
  // const editForm = ref<queryProps>(createFormData())
  const editRules = computed(()=>{
    return {
      name: [{required: true, trigger: 'blur', message: '请输入模板名称',}],
      typePid:[{required: true, trigger: 'change', message: '请选择模板类型',}],
      img:[{required: true, trigger: 'blur', message: '请输入预览图路径',}],
      path:[{required: true, trigger: 'blur', message: '请输入模板文件路径',}],
    }
  })

  const editDialogJson = ()=>{
    dialogList.value = {
      parentEleTag:'el-dialog',
      parentOptions:{
        modelValue:dialogVisible.value,
        title:title.value,
        width:dialogWidth.value,
        'close-on-click-modal':true,
        'append-to-body':true,
        'align-center':true,
        center:true
      },
      parentEvent:{

      },
      modeType:'edit',
      subEleTag:'el-form',
      subOptions:{

      },
      subItemEleTag:'el-form-item',
      subItemOptions:{

      },
    }
  }



  const handleClose = ()=>{

  }





</script>


<style scoped lang="scss">

</style>
