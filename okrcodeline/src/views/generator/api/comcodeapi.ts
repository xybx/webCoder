import request from '/@/utils/request';

export const getCodeList = (params:object)=>{
  return request({
    url:'/templatemsg/selectByList',
    method:'get',
    params
  })
}

export function putCode(data:object){
  return request({
    url:'/templatemsg/add',
    method:'post',
    data
  })
}

export function editCode(data:object){
  return request({
    url:'/templatemsg/update',
    method:'post',
    data
  })
}

export function delCode(data:object){
  return request({
    url:'/templatemsg/del',
    method:'post',
    data
  })
}

export function getCode(params:object){
  return request({
    url:'/templatemsg/selectByPid',
    method:'get',
    params
  })
}

export function getCodeTree(){
  return request({
    url:'/templatestyle/getTree',
    method:'get'
  })
}

export function getTemsStyle(){
  return request({
    url:'/templatetype/getIntegerSelected',
    method:'get'
  })
}


