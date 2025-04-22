import request from '/@/utils/request';

export const getGenList = (params:object)=>{
  return request({
    url:'/datasource/getTableInfo',
    method:'get',
    params
  })
}

export function getTree(){
  return request({
    url:'/projectinfo/getTree',
    method:'get'
  })
}

export function getHistoryList(params:object){
  return request({
    url:'/config/selectByConfig',
    method:'get',
    params
  })
}

export function putEnd(params:object){
  return request({
    url:'/datasource/generatorHD',
    method:'get',
    params
  })
}

export function putConfig(data:object){
  return request({
    url:'/config/add',
    method:'post',
    data
  })
}

export function getUidData(params:object){
  return request({
    url:'/config/getInfoByUuid',
    method:'get',
    params
  })
}

export function getTemSelect(){
  return request({
    url:'/templatestyle/getSelected',
    method:'get'
  })
}

export function getTabsName(params:object){
  return request({
    url:'/templatemsg/selectTyleByTemplatestylepid',
    method:'get',
    params
  })
}

export function getCheckData(params:object){
  return request({
    url:'/templatemsg/selectByTemplatestylepidAndTypepid',
    method:'get',
    params
  })
}

export function getTableListData(params:object){
  return request({
    url:'/tableconfig/selectByTableconfig',
    method:'get',
    params
  })
}

export function getTableAddData(params:object){
  return request({
    url:'/formconfig/selectByFormconfig',
    method:'get',
    params
  })
}

export function getDictData(params:object){
  return request({
    url:'/dictionary/getSelectedByUuid',
    method:'get',
    params
  })
}

export function getTimeData(){
  return request({
    url:'/timemodule/getStringSelected',
    method:'get'
  })
}

export function getFormData(){
  return request({
    url:'/formmodule/getStringSelected',
    method:'get'
  })
}

export function getSearchData(){
  return request({
    url:'/tablesearchtype/getSelected',
    method:'get'
  })
}


export function putField(params:object){
  return request({
    url:'/tableconfig/addByuuid',
    method:'get',
    params
  })
}

export function putForm(params:object){
  return request({
    url:'/formconfig/addByuuid',
    method:'get',
    params
  })
}




export function putListData(data:object){
  return request({
    url:'/tableconfig/update',
    method:'post',
    data
  })
}

export function putAddData(data:object){
  return request({
    url:'/formconfig/update',
    method:'post',
    data
  })
}

export function getListCodes(params:object){
  return request({
    url:'/tableconfig/generatorcode',
    method:'get',
    params
  })
}

export function getAddCodes(params:object){
  return request({
    url:'/formconfig/generatorcode',
    method:'get',
    params
  })
}

export function getTailList(params:object){
  return request({
    url:'/detailconfig/selectByDetailconfig',
    method:'get',
    params
  })
}

export function putTail(params:object){
  return request({
    url:'/detailconfig/addByuuid',
    method:'get',
    params
  })
}

export function editTail(data:object){
  return request({
    url:'/detailconfig/update',
    method:'post',
    data
  })
}

export function putTailCode(params:object){
  return request({
    url:'/detailconfig/generatorcode',
    method:'get',
    params
  })
}

export const getFormObj = (params:object)=>{
  return request({
    url:'/datasource/getDatasourcePath',
    method:'get',
    params
  })
}







