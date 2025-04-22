import request from '/@/utils/request';

export const getUsersList = (params:object)=>{
  return request({
    url:'/user/selectByUser',
    method:'get',
    params
  })
}

export function putUsers(data:object){
  return request({
    url:'/user/add',
    method:'post',
    data
  })
}

export function editUsers(data:object){
  return request({
    url:'/user/update',
    method:'post',
    data
  })
}

export function delUsers(data:object){
  return request({
    url:'/user/del',
    method:'post',
    data
  })
}

export const getUsers = (params:object)=>{
  return request({
    url:'/user/selectByPid',
    method:'get',
    params
  })
}
