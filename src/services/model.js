import axios from 'axios';

export async function queryModelList(params) {
  return axios.get('/api/model/queryModelList.json', {
    params,
  }).then(res => res.data);
}

export async function queryModelProgress(params) {
  return axios.get('/api/model/queryModelProgress.json', {
    params,
  }).then(res => res.data);
}