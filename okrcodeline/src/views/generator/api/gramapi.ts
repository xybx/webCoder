import request from '/@/utils/request';

export const getGramList = (params:object)=>{
  return request({
    url:'/projectinfo/selectByUser',
    method:'get',
    params
  })
}

export function putGram(data:object){
  return request({
    url:'/projectinfo/add',
    method:'post',
    data
  })
}

export function editGram(data:object){
  return request({
    url:'/projectinfo/update',
    method:'post',
    data
  })
}

export function delGram(data:object){
  return request({
    url:'/projectinfo/del',
    method:'post',
    data
  })
}

export const getGram = (params:object)=>{
  return request({
    url:'/projectinfo/selectByPid',
    method:'get',
    params
  })
}

export const getImportList = (params:object)=>{
  return request({
    url:'/projectinfo/selectByProjectinfo',
    method:'get',
    params
  })
}

export const putImport = (data:object)=>{
  return request({
    url:'/user-project/addRelevance',
    method:'post',
    data
  })
}
