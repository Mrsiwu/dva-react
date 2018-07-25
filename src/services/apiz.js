import { stringify } from 'qs';
import request from '../utils/request';
// 模块列表
export async function rightsGetList(params) {
  return request(`/api/rights/getList?${stringify(params)}`);
}

export async function rightsAdd(params) {
  return request('/api/rights/add', {
    method: 'POST',
    body: {
      params
    },
  });
}

export async function rightsUpdate(params) {
  return request('/api/rights/update', {
    method: 'PUT',
    body: {
      params,
    },
  });
}

export async function rightsDelete(params) {
  return request('/api/rights/delete', {
    method: 'DELETE',
    body: {
      params
    },
  });
}
// 版本管理
export async function getVersionList(params) {
  return request(`/api/schoolVersion/getVersionList?${stringify(params)}`);
}

export async function deleteVersion(params) {
  return request('/api/schoolVersion/deleteVersion', {
    method: 'DELETE',
    body: {
      params
    },
  });
}
