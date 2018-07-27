import { stringify } from 'qs';
import request from '../utils/request';



export async function querysavePlatform(params) { //平台新增
  return request('/api/platform/savePlatform', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryupdatePlatform(params) { //平台编辑
  return request('/api/platform/updatePlatform', {
    method: 'PUT',
    body: {
      ...params
    },
  });
}

export async function querysearchplatformlist(params) {  //平台搜索假数据
  return request(`/api/getsearchplatformlist?${stringify(params)}`);
}



export async function queryPlatformLists(params) {
  return request(`/api/platform/listPlatformWithPage?${stringify(params)}`);
}

export async function queryplatformenableState(params) {
  return request('/api/platform/enableStateById', {
    method: 'PUT',
    body: {
      ...params
    },
  });
}

export async function queryplatformcloseState(params) {
  return request('/api/platform/closeStateById', {
    method: 'PUT',
    body: {
      ...params
    },
  });
}

export async function queryplatformdeleteState(params) {
  return request('/api/platform/deleteStateById', {
    method: 'DELETE',
    body: {
      ...params
    },
  });
}

export async function queryplatformlistAll(params) {
  return request(`/api/platform/listPlatformAll?${stringify(params)}`);
}

export async function queryVersionList(params) { //模块版本列表
  return request(`/api/schoolVersion/getVersionList?${stringify(params)}`);
}


export async function queryupdatePayment(params) {
  return request('/api/platform/updatePayment', {
    method: 'PUT',
    body: {
      ...params
    },
  });
}



export async function queryNetschoolList(params) {
  return request(`/api/netschool_list?${stringify(params)}`);
}

export async function queryfindSchoolList(params) { //根据条件分页查询网校
  return request(`/api/school/findSchoolByCondition?${stringify(params)}`);
}


export async function querysaveSchool(params) {
  return request('/api/school/saveSchool', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryupdateSchoolState(params) {
  return request('/api/school/updateSchoolState', {
    method: 'PUT',
    body: {
      ...params
    },
  });
}

export async function queryfindBySchoolId(params) {
  return request(`/api/school/findBySchoolId?${stringify(params)}`);
}

export async function queryupdateSchool(params) {
  return request('/api/school/updateSchool', {
    method: 'PUT',
    body: {
      ...params
    },
  });
}


export async function querysavePaymentSystem(params) {
  return request('/api/school/savePaymentSystem', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function queryupdateLanguageVersion(params) {
  return request('/api/school/updateLanguageVersion', {
    method: 'PUT',
    body: {
      ...params
    },
  });
}


