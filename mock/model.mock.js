const queryCount = {
  1001: 0, // 对应 model_id 为 1001 的模型
  1002: 0, // 对应 model_id 为 1002 的模型
  1003: 0, // 对应 model_id 为 1003 的模型
};

module.exports = {
  // 查询模型列表
  'GET /api/model/queryModelList.json': {
    data: [{
      model_id: '1001',
      model_name: '模型1',
      model_status: 'RUNNING', // 运行态
      model_desc: '这是模型1',
      model_type: '离散型',
    }, {
      model_id: '1002',
      model_name: '模型2',
      model_status: 'RUNNING', // 运行态
      model_desc: '这是模型2',
      model_type: '离散型',
    }, {
      model_id: '1003',
      model_name: '模型3',
      model_status: 'RUNNING', // 运行态
      model_desc: '这是模型3',
      model_type: '离散型',
    }],
    success: true,
  },
  // 查询单个模型进度
  'GET /api/model/queryModelProgress.json': (req, res) => {
    const { modelId } = req.query;
    if (queryCount[modelId] >= 10) {
      queryCount[modelId] = 0;
    }
    queryCount[modelId] += 1;
    const result = {
      data: {
        progress: queryCount[modelId] * 10,
        status: queryCount[modelId] * 10 >= 100 ? 'SUCCESS' : "RUNNING",
      },
      success: true,
    };
    res.send(result);
  },
};