

import request from '/@/utils/request';

export const changePassword = (data:object)=>{
  return request({
    url:'/user/changePassword',
    method:'post',
    data
  })
}
