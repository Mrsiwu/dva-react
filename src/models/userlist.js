import { notification  } from 'antd';
import { getGeneralUserlist } from '../services/apix';

export default {
  namespace: 'userlist',

  state: {
   list:[]
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {//获取用户列表
      const response = yield call(getGeneralUserlist, payload);
      console.log(response)
       if (response.success) {
	      yield put({
	        type: 'save',
	        payload: response.data.rows,
	      });
	      if(callback) callback(response)
      } else {
        
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
