import { notification  } from 'antd';
import { rightsGetList, rightsAdd, rightsUpdate, rightsDelete, getVersionList, deleteVersion } from '../services/apiz';

export default {
  namespace: 'module',

  state: {
    list: [],
    version: [],
    loading: true
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) { // 获取模块列表
      const response = yield call(rightsGetList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data : [],
      });

      if(callback) callback(response);
    },
    *addFetch({ payload, callback }, { call, put }) { // 添加模块

      const response = yield call(rightsAdd, payload);

      if (response.success) {
        notification['success']({
          message: '添加模块成功',
          description: response.message,
        });
      } else {
        notification['error']({
          message: '添加模块失败',
          description: response.message,
        });
      }

      if(callback) callback()
    },
    *updateFetch({ payload, callback }, { call, put }) { // 编辑模块

      const response = yield call(rightsUpdate, payload);

      if (response.success) {
        notification['success']({
          message: '编辑模块成功',
          description: response.message,
        });
      } else {
        notification['error']({
          message: '编辑模块失败',
          description: response.message,
        });
      }

      if(callback) callback()
    },
    *deleteFetch({ payload, callback }, { call, put }) { // 删除模块

      const response = yield call(rightsDelete, payload);

      if (response.success) {
        notification['success']({
          message: '删除模块成功',
          description: response.message,
        });
      } else {
        notification['error']({
          message: '删除模块失败',
          description: response.message,
        });
      }

      if(callback) callback()
    },
    *versionFetch({ payload, callback }, { call, put }) {
      const response = yield call(getVersionList, payload);
      yield put({
        type: 'queryVersion',
        payload: Array.isArray(response.data) ? response.data : [],
      });

      if(callback) callback(response);
    },
    *deleteVersionFetch({ payload, callback }, { call, put }) {
      const response = yield call(deleteVersion, payload);

      if (response.success) {
        notification['success']({
          message: '删除版本成功',
          description: response.message,
        });
      } else {
        notification['error']({
          message: '删除版本失败',
          description: response.message,
        });
      }

      if(callback) callback()
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    queryVersion(state, action) {
      return {
        ...state,
        version: action.payload,
      };
    },
    clear() {
      return {
        list: [],
        loading: true,
      }
    }
  },
};
