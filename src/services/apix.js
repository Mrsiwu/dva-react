import { stringify } from 'qs';
import request from '../utils/request';

//用户列表
export async function getGeneralUserlist(params) {
  return request(`/api/user/getGeneralUserlist?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}