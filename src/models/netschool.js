import {
  querysavePlatform,
  queryupdatePlatform,
  queryNetschoolList,
  queryPlatformLists,
  queryplatformenableState,
  queryplatformcloseState,
  queryplatformdeleteState,
  queryupdateSchoolState,
  queryplatformlistAll,
  queryupdatePayment,
  queryVersionList,
  queryfindSchoolList,
  querysaveSchool,
  queryfindBySchoolId,
  querysavePaymentSystem,
  queryupdateLanguageVersion,
  querysearchplatformlist
} from '../services/apimack';

export default {
  namespace: 'netschool',

  state: {
    netschoolList: [],
    total: 50,
    platformList:[],
    platformtotal:0
  },

  effects: {
    *fetchsearchplatformlist({ payload, callback }, { call, put }) { //平台搜索假数据
      const response = yield call(querysearchplatformlist, payload);
      if (callback) callback(response);
    },

    *fetchsavePlatform({ payload, callback }, { call, put }) { //平台添加
      const response = yield call(querysavePlatform, payload);
      if (callback) callback(response);
    },

    *fetchupdatePlatform({ payload, callback }, { call, put }) { //平台编辑
      const response = yield call(queryupdatePlatform, payload);
      if (callback) callback(response);
    },

    *fetchNetschoolLists({ payload, callback }, { call, put }) {
      const response = yield call(queryfindSchoolList, payload);
      console.log(response)
      if (callback) callback(response);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },

    *fetchPlatformListss({ payload, callback }, { call, put }) {  
      const response = yield call(queryPlatformLists, payload);
      if (callback) callback(response.data.rows);
      yield put({
        type: 'saveplatformlist',
        payload: response,
      });
    },
    *fetchplatformenableState({ payload, callback }, { call, put }) {
      const response = yield call(queryplatformenableState, payload);
      if (callback) callback(response);
    },
    
    *fetchplatformcloseState({ payload, callback }, { call, put }) {
      const response = yield call(queryplatformcloseState, payload);
      if (callback) callback(response);
    },

    *fetchplatformdeleteState({ payload, callback }, { call, put }) {
      const response = yield call(queryplatformdeleteState, payload);
      if (callback) callback(response);
    },

    *fetchplatformlistAll({ payload, callback }, { call, put }) {
      const response = yield call(queryplatformlistAll, payload);
      if (callback) callback(response);
    },
    *fetchupdatePayment({ payload, callback }, { call, put }) {
      const response = yield call(queryupdatePayment, payload);
      if (callback) callback(response);
    },

    *fetchVersionList({ payload, callback }, { call, put }) {
      const response = yield call(queryVersionList, payload);
      if (callback) callback(response);
    },
    
    
    
    *fetchupdateSchoolState({ payload, callback }, { call, put }) {
      const response = yield call(queryupdateSchoolState, payload);
      if (callback) callback(response);
    },
    
    *fetchfindBySchoolId({ payload, callback }, { call, put }) {  
      const response = yield call(queryfindBySchoolId, payload);
      if (callback) callback(response);
    },
    *fetchaddnetSchool({ payload, callback }, { call, put }) {  
      const response = yield call(querysaveSchool, payload);
      if (callback) callback(response);
    },
    *fetchsavePaymentSystem({ payload, callback }, { call, put }) {  
      const response = yield call(querysavePaymentSystem, payload);
      if (callback) callback(response);
      console.log(response)
    },
    *fetchupdateLanguageVersion({ payload, callback }, { call, put }) {  
      const response = yield call(queryupdateLanguageVersion, payload);
      console.log(response)
      if (callback) callback(response);
    },
    
    
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        list: payload.data.rows || [],
        total:parseInt(payload.data.total) || 0
      };
    },
    saveplatformlist(state, { payload }) {
      return {
        ...state,
        platformList: payload.data.rows || [],
        platformtotal: parseInt(payload.data.total) || 0
      };
    },
    clear() {
      return {
        netschoolList: [],
        total: 50,
        platformList:[],
        platformtotal:0
      };
    },
  },
};
