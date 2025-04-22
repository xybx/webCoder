import request from '/@/utils/request';

export const getUsualAddressList = (params:object)=>{
  return request({
    url:'/usualaddress/selectByUsualaddress',
    method:'get',
    params
  })
}

export function putUsualAddress(data:object){
  return request({
    url:'/usualaddress/add',
    method:'post',
    data
  })
}

export function editUsualAddress(data:object){
  return request({
    url:'/usualaddress/update',
    method:'post',
    data
  })
}

export function delUsualAddress(data:object){
  return request({
    url:'/usualaddress/del',
    method:'post',
    data
  })
}

export const getUsualAddress = (params:object)=>{
  return request({
    url:'/usualaddress/selectByPid',
    method:'get',
    params
  })
}
export const getUsualAddressShow = (params:object)=>{
  return request({
    url:'/usualaddress/selectList',
    method:'get',
    params
  })
}

export const getUsualAddressTypeSelected = ()=>{
  return request({
    url:'/usualaddresstype/getSelected',
    method:'get'
  })
}

export const getUsualAddressGroupSelected = ()=>{
  return request({
    url:'/usualaddressgroup/getSelected',
    method:'get'
  })
}

export const getLink = (params:object)=>{
  return request({
    url:'/usualaddress/selectListByTypeGroupByGroupname',
    method:'get',
    params
  })
}
