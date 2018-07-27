import {
  querysearchplatformlist
} from '../services/apimack';

export default {
  namespace: 'usermanage',

  state: {
   
  },

  effects: {
    *fetchsearchplatformlist({ payload, callback }, { call, put }) { //平台搜索假数据
      const response = yield call(querysearchplatformlist, payload);
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
    clear() {
      return {
        
      };
    },
  },
};
