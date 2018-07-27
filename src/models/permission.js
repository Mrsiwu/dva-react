import { notification  } from 'antd';
import {
  addUser,
  updateUserRole,
  updateUserPwd,
  updateUserState,
  getUserById,
  getUserListByCondition,
  getRoleListByPid,
  getRoleListByCondition,
  getRoleListByUserId,
  getRoleRightsByRoleId,
  deleteRoleById,
  createRole,
  modifyRole,
  modifyRoleRights
} from '../services/apiz';

export default {
  namespace: 'permission',

  state: {
    userList: [],
    roleList: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) { // 获取模块列表
      const response = yield call(getUserListByCondition, payload);
      yield put({
        type: 'userList',
        payload: Array.isArray(response.data.rows) ? response.data.rows : [],
      });

      if(callback) callback(response);
    },
    *updateUser({ payload, callback }, { call, put }) { // 获取模块列表
      const response = yield call(updateUserState, payload);

    },
    *roleFetch({ payload, callback }, { call, put }) { // 获取模块列表
      const response = yield call(getRoleListByCondition, payload);
      yield put({
        type: 'roleList',
        payload: Array.isArray(response.data) ? response.data : [],
      });

      if(callback) callback(response);
    }
  },

  reducers: {
    userList(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
    roleList(state, action) {
      return {
        ...state,
        roleList: action.payload,
      };
    },
    clear() {
      return {
        userList: [],
        roleList: [],
      }
    }
  },
};
