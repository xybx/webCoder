import request from '/@/utils/request'


// 编辑获得属性
export const selectById = (params: any) => {
    return request({
        method: 'GET',
        url: '/datasource22/selectVoByPid',
        params,

    });
}
// 增加列表项
export const add = (data: any) => {
    return request({
        method: 'POST',
        url: '/datasource22/add',
        data,

    });
}
// 编辑列表项
export const update = (data: any) => {
    return request({
        method: 'POST',
        url: '/datasource22/update',
        data,

    });
}

    export const getselectformSelectDataApi= ()=>{
        return request({
            url: '/datasource22/getStringSelected',
            method:'get',
        })
    }
