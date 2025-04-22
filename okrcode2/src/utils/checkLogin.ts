
import request from '/@/utils/request';

export const checkLogin = ()=>{
  return request({
    url:'login/checkLogin',
    method:'get',
  })
}