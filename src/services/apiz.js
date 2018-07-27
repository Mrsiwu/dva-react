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

export async function addVersion(params) {
  return request('/api/schoolVersion/add', {
    method: 'POST',
    body: {
      params
    },
  });
}

export async function updateVersion(params) {
  return request('/api/schoolVersion/edit', {
    method: 'PUT',
    body: {
      params,
    },
  });
}

export async function deleteVersion(params) {
  return request('/api/schoolVersion/deleteVersion', {
    method: 'DELETE',
    body: {
      params
    },
  });
}

export async function addRights(params) {
  return request('/api/schoolVersion/addRights', {
    method: 'POST',
    body: {
      params
    },
  });
}
//用户列表
export async function addUser(params) {
  return request('/api/user/addUser', {
    method: 'POST',
    body: {
      params
    },
  });
}

export async function updateUserRole(params) {
  return request('/api/user/updateUserRole', {
    method: 'PUT',
    body: {
      params
    },
  });
}

export async function updateUserPwd(params) {
  return request('/api/user/updateUserPwd', {
    method: 'PUT',
    body: {
      params
    },
  });
}

export async function updateUserState(params) {
  return request('/api/user/updateUserState', {
    method: 'PUT',
    body: {
      params
    },
  });
}

export async function getUserById(params) {
  return request(`/api/user/getUserById?${stringify(params)}`);
}

export async function getUserListByCondition(params) {
  return request(`/api/user/getUserListByCondition?${stringify(params)}`);
}

export async function getRoleListByPid(params) {
  return request(`/api/user/getRoleListByPid?${stringify(params)}`);
}
// 角色
export async function getRoleListByCondition(params) {
  return request(`api/role/getRoleListByCondition?${stringify(params)}`);
}

export async function getRoleListByUserId(params) {
  return request(`/api/role/getRoleListByUserId?${stringify(params)}`);
}

export async function getRoleRightsByRoleId(params) {
  return request(`/api/role/getRoleRightsByRoleId?${stringify(params)}`);
}

export async function deleteRoleById(params) {
  return request('/api/role/deleteRoleById', {
    method: 'PUT',
    body: {
      params
    },
  });
}

export async function createRole(params) {
  return request('/api/role/createRole', {
    method: 'POST',
    body: {
      params
    },
  });
}

export async function modifyRole(params) {
  return request('/api/role/modifyRole', {
    method: 'PUT',
    body: {
      params
    },
  });
}

export async function modifyRoleRights(params) {
  return request('/api/role/modifyRoleRights', {
    method: 'PUT',
    body: {
      params
    },
  });
}
