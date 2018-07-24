import { queryNetschoolList } from '../services/api';

export default {
  namespace: 'netschool',

  state: {
    netschoolList: [],
    total: 50,
  },

  effects: {
    *fetchNetschoolLists({ payload, callback }, { call, put }) {
      const response = yield call(queryNetschoolList, payload);
      if (callback) callback(response);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
