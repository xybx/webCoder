import request from '/@/utils/request'

export async function login(data: any) {
  return request({
    url: '/login/login',
    method: 'post',
    data,
  })
}

// export function getUserInfo() {
//   return request({
//     url: '/userInfo',
//     method: 'get',
//   })
// }

export function logout() {
  return request({
    url: '/login/logout',
    method: 'get',
  })
}

export const getUserList = ()=>{
  return request({
    url: '/user/getStringSelected',
    method: 'get',
  })
}

export const checkLogin = ()=>{
  return request({
    url: '/login/checkLogin',
    method: 'get',
  })
}

