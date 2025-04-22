import request from '/@/utils/request';

export const getDictList = (params:object)=>{
  return request({
    url:'/dictionary/selectByList',
    method:'get',
    params
  })
}

export function putDict(data:object){
  return request({
    url:'/dictionary/add',
    method:'post',
    data
  })
}

export function editDict(data:object){
  return request({
    url:'/dictionary/update',
    method:'post',
    data
  })
}

export function delDict(data:object){
  return request({
    url:'/dictionary/del',
    method:'post',
    data
  })
}

export function getDict(params:object){
  return request({
    url:'/dictionary/selectByPid',
    method:'get',
    params
  })
}

