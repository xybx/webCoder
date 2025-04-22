import request from '/@/utils/request';

export const getSourceList = (params:object)=>{
  return request({
    url:'/datasource/selectByList',
    method:'get',
    params
  })
}

export function putSource(data:object){
  return request({
    url:'/datasource/add',
    method:'post',
    data
  })
}

export function editSource(data:object){
  return request({
    url:'/datasource/update',
    method:'post',
    data
  })
}

export function delSource(data:object){
  return request({
    url:'/datasource/del',
    method:'post',
    data
  })
}

export const getSource = (params:object)=>{
  return request({
    url:'/datasource/selectByPid',
    method:'get',
    params
  })
}

export const getSourceSelect = ()=>{
  return request({
    url:'/projectinfo/getIntegerSelectedByUser',
    method:'get',
  })
}

export const getSourceMsg = ()=>{
  return request({
    url:'/drivernamemsg/getSelected',
    method:'get',
  })
}

export const getSourceTest = (params:object)=>{
  return request({
    url:'/datasource/testConnect',
    method:'get',
    params
  })
}
