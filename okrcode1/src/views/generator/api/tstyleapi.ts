import request from '/@/utils/request';

export const getTemStyleList = (params:object)=>{
  return request({
    url:'/templatestyle/selectByTemplatestyle',
    method:'get',
    params
  })
}

export function putTemStyle(data:object){
  return request({
    url:'/templatestyle/add',
    method:'post',
    data
  })
}

export function editTemStyle(data:object){
  return request({
    url:'/templatestyle/update',
    method:'post',
    data
  })
}

export function delTemStyle(data:object){
  return request({
    url:'/templatestyle/del',
    method:'post',
    data
  })
}

export function getTemStyle(params:object){
  return request({
    url:'/templatestyle/selectByPid',
    method:'get',
    params
  })
}

export function getTemStyleAll(){
  return request({
    url:'/templatestyle/getAllList',
    method:'get'
  })
}
