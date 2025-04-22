import type {ButtonProps} from "/@/types/listTypes.ts";

const getTopButton = (arr:ButtonProps[])=>{
  let BtnArr= ref<ButtonProps[] | []>([])
  BtnArr.value = [
    {name:'新增',icon:'icon-tianjia1',color:'#48914D',funName:'AddClick'},
    {name:'批量删除',icon:'icon-xiazai1',color:'#4484E8',funName:'batchDel'},
    {name:'获取模板',icon:'icon-xiazai1',color:'#af993e',funName:'getTemplate'},
    {name:'导入',icon:'icon-xiazai1',color:'#da1c6b',funName:'getImport'},
    {name:'导出',icon:'icon-xiazai1',color:'#31ada2',funName:'getExport'},
    {name:'搜索',color:'#4484E8',funName:'searchClick'},
    {name:'重置',color:'#A3A5B0',funName:'resetClick'},
    {name:'编辑',color:'#4484E8',funName:'editClick'},
    {name:'查看',color:'#48914D',funName:'lookClick'},
    {name:'删除',color:'#E32E2E',funName:'delClick'}
  ]
  let krr = ref<any[]>([])
  if(Array.isArray(arr)){
    if(Object.prototype.toString.call(arr) === '[object Array]'){
      for(let i=0;i < BtnArr.value.length;i++){
        for(let n=0;n<arr.length;n++){
          if(BtnArr.value[i].name == arr[n].name){
              BtnArr.value[i].funName = arr[n].funName && arr[n].funName != '' ? arr[n].funName : BtnArr.value[i].funName
              krr.value.push(BtnArr.value[i])
          }
        }
      }
      return krr.value
    }
  }else {
    let err = '页面按钮数据加载异常'
    throw err
  }
}


export { getTopButton }
