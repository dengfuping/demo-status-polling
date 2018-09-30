import { delay } from 'dva/saga';
import * as modelService from '../services/model';

export default {
  namespace: 'model',
  state: {
    list: [], // 模型列表
    polling: false, // 是否轮询建模进度
  },
  reducers: {
    update(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    //  查询模型列表
    * list(_, { call, put, all }) {
      const data = yield call(modelService.queryModelList, {});
      yield put({ // 允许轮询建模进度
        type: 'update',
        payload: {
          polling: true,
        },
      });
      if (data.success) { // 请求成功
        const list = data.data;
        const runningList = list.filter(item => item.model_status === 'RUNNING');
        const results = yield all(runningList.map(item => { // 并发查询模型进度
          return put({
            type: 'progress',
            payload: {
              modelId: item.model_id,
            },
          });
        }));
        yield put({
          type: 'update', // 更新模型列表
          payload: {
            list: list.map(item => {
              if (runningList.indexOf(item) !== -1) { // 运行状态的模型新增 progress 属性
                item.model_status = (results[runningList.indexOf(item)].data && results[runningList.indexOf(item)].data.status) || 'RUNNING';
                item.model_progress = (results[runningList.indexOf(item)].data && results[runningList.indexOf(item)].data.progress) || 0;
              }
              return item;
            }),
          },
        });
      }
    },
    // 根据 modelId 查询建模进度
    * progress({ payload }, { call, put, select }) {
      const { list } = yield select(state => state.model);
      const data = yield call(modelService.queryModelProgress, payload);
      if (data.success && data.data.status === 'RUNNING') { // 运行中
        yield put({
          type: 'update',
          payload: {
            list: list.map(item => {
              if (item.model_id === payload.modelId) {
                item.model_status = data.data.status;
                item.model_progress = data.data.progress; // 新增进度信息
              }
              return item;
            }),
          },
        });
        // 轮询建模进度
        yield call(delay, 1000);
        const { polling } = yield select(state => state.model);
        if (polling) {
          yield put({
            type: 'progress',
            payload: {
              modelId: payload.modelId,
            },
          });
        }        
      } else if (data.success && data.data.status === 'SUCCESS') { // 运行成功
        yield put({
          type: 'update',
          payload: {
            list: list.map(item => {
              if (item.model_id === payload.modelId) {
                item.model_status = data.data.status;
                item.model_progress = data.data.progress; // 新增进度信息
              }
              return item;
            }),
          },
        });
      }
    },
  },
};
