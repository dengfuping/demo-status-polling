import React from 'react';
import { connect } from 'dva';
import { Badge, Progress, Table } from 'antd';
import styles from './index.css';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'model/list',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'model/update',
      payload: {
        polling: false,
      },
    });
  }

  render() {
    const { list } = this.props;
    const columns = [{
      title: '模型名称',
      dataIndex: 'model_name',
      key: 'model_name',
    }, {
      title: '模型描述',
      dataIndex: 'model_desc',
      key: 'model_desc',
    }, {
      title: '模型类型',
      dataIndex: 'model_type',
      key: 'model_type',
    }, {
      title: '模型状态',
      dataIndex: 'model_status',
      key: 'model_status',
      render: (status, record) => {
        return (
          <span>
            <Progress className={styles.progress} status={record.model_status === 'RUNNING' ? 'normal' : 'success'} percent={Number(record.model_progress)} />
            {status === 'RUNNING' ? '运行中' : '成功'}
          </span>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'model_name',
      key: 'operation',
      render: (modelName, record) => (
        <span>
          <a onClick={e => e.preventDefault()}>查看</a>
        </span>
      ),
    }];
    return (
      <div className={styles.container}>
        <Table rowKey={record => record.model_id} dataSource={list} columns={columns} />
      </div>
    );
  }
}

function mapStateToProps({ model }) {
  return {
    list: model.list,
  };
}

export default connect(mapStateToProps)(IndexPage);