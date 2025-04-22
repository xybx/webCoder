import request from '/@/utils/request';

export const getUsersList = (params:object)=>{
  return request({
    url:'/user/selectByUser',
    method:'get',
    params
  })
}


// 重置密码
export const getresetPassword = (params:object)=>{
  return request({
    url:'/user/resetPassword',
    method:'get',
    params
  })
}

// 获得用户角色
export const getCheckSysManage = ()=>{
  return request({
    url:'/user/checkSysManage',
    method:'get',
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
    url:'/user/selectInfoByPid',
    // url:'/user/selectByPid',
    method:'get',
    params
  })
}
