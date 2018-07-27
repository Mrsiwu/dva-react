import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Table,
  Icon,
  Divider,
  Dropdown,
  Menu,
  Row,
  Col,
  Button,
  Modal,
  Select
} from 'antd';
import styles from './module.less';
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ loading, global, module }) => ({
  loading: loading.effects['module/versionFetch'] || loading.effects['module/addVersionFetch'] || loading.effects['module/updateVersionFetch'] || loading.effects['module/addRightsFetch'],
  global,
  module
}))
@Form.create()
export default class ModuleVersion extends Component {
  state = {
    visibleVersion: false,
    visibleUpdateVersion: false,
    visibleModule: false,
    selectedRowKeys: [],
    expandedRowKeys: []
  }

  componentDidMount() {
    const { dispatch, form } = this.props;

    this.getList()

    dispatch({
      type: 'module/fetch',
      payload: {}
    });
  }

  componentWillUnmount(){
    const { dispatch } = this.props;

    dispatch({
      type: 'module/clear'
    })
  }

  getList() {
    const { dispatch, form } = this.props;

    let params = {
      versionName: form.getFieldValue('keywords')
    }

    dispatch({
      type: 'module/versionFetch',
      payload: params
    });
  }

  getKeys = (children) => { // 递归获取所有子集的key
    for ( let i = 0, len = children.length; i < len; i++ ) {
      let item = children[i]
      this.childrenKeys.push(item.rightsId)
      if (item.children) {
        this.getKeys(item.children)
      }
    }
  }

  deleteKeys = (keys) => {  // 删除取消的key
    if (keys.length > 0) {
      let selectedRow = []
      for ( let i = 0, len = keys.length; i < len; i++ ) {
        let key = keys[i]
        for (let j = 0, jen = this.selectedRowKeys.length; j < jen; j++) {
          let skey = this.selectedRowKeys[j]
          if (skey == key) {
            this.selectedRowKeys.splice(j, 1)
          }
        }
      }
    }
  }

  getParents = (sequence, data) => {

    if (sequence.length > 2) {

      for ( let i = 0, len = data.length; i < len; i++ ) {
        let item = data[i]
        let sl = item.rightsSequence.length

        if (item.rightsSequence == sequence.substring(0, sl)) {
          this.parentKeys.push(item.rightsId)

          if (sequence.length > sl) {
            this.getParents(sequence, item.children)
          }

        }

      }

    }

  }
// -------- handle event -----------
  handleQuery = () => {
    this.getList()
  }

  handleReset = () => {
    const { form } = this.props;
    form.resetFields(['keywords']);
    this.getList()
  }

  handleDelete = (e, item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'module/deleteVersionFetch',
      payload: {
        schoolVersionId: item.schoolVersionId
      },
      callback: (res) => {
        this.getList()
      }
    });
  }

  showVersion = (e, item) => {

    const { form } = this.props;

    form.resetFields(['versionName']);

    this.setState({
      visibleVersion: true,
    })

  }

  showUpdateVersion = (e, item) => {

    const { form } = this.props;

    form.resetFields(['versionName']);

    form.setFields({
      versionName: {
        value: item.versionName
      }
    });

    this.schoolVersionId = item.schoolVersionId

    this.setState({
      visibleUpdateVersion: true,
    })

  }

  showModule = (e, item) => {
    const { dispatch } = this.props;
    this.schoolVersionId = item.schoolVersionId
    this.setState({
      visibleModule: true,
      selectedRowKeys: item.rightsIdList,
      expandedRowKeys: []
    })
  }
  // ------ Modal handle-------
  handleVersionOk = () => {

    const { dispatch, form } = this.props;

    form.validateFields(['versionName'], (err, fieldsValue) => {

      if (err) return;

      const { versionName } = fieldsValue
      dispatch({
        type: 'module/addVersionFetch',
        payload: {
          versionName: versionName
        },
        callback: (res) => {
          this.setState({
            visibleVersion: false,
          })
          this.getList()
        }
      })
    })
  }

  handleVersionCancel = () => {
    this.setState({
      visibleVersion: false,
    })
  }

  handleUpdateVersionOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['versionName'], (err, fieldsValue) => {

      if (err) return;

      const { versionName } = fieldsValue
      dispatch({
        type: 'module/updateVersionFetch',
        payload: {
          versionName: versionName,
          versionId: this.schoolVersionId
        },
        callback: (res) => {
          this.setState({
            visibleUpdateVersion: false,
          })
          this.getList()
        }
      });

    })
  }

  handleUpdateVersionCancel = () => {
    this.setState({
      visibleUpdateVersion: false,
    })
  }

  handleModuleOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'module/addRightsFetch',
      payload: {
        rightsIdList: JSON.stringify(this.selectedRowKeys),
        versionId: this.schoolVersionId
      },
      callback: (res) => {
        this.setState({
          visibleModule: false
        })

        this.getList()
      }
    })
  }

  handleModuleCancel = () => {

    this.setState({
      visibleModule: false,
    })
  }
// ------ render module Dom ----------
  // 搜索栏
  renderSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row className={styles.rowForm}>
          <Col xl={8} lg={10} md={12} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索版本名称查询" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={10} md={12} sm={24}>
            <span className={styles.buttonBox}>
              <Button onClick={this.handleQuery} type="primary" >查询</Button>
              <Button onClick={this.handleReset} style={{ marginLeft: 8 }} >重置</Button>
            </span>
          </Col>
          <Col sm={24}>
            <Button onClick={this.showVersion} type="primary" icon="plus" className={styles.addmodule}>
              新增版本
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  // 版本列表
  renderTableList() {
    // const { global } = this.props;
    // const { lang = 'zhCN' } = global;
    // let language;
    // switch (lang) {
    //   case 'zhCN':
    //     language = {};
    //     break;
    //   case 'enGB':
    //     language = {};
    //     break;
    //   default:
    // }
    const { module, loading } = this.props
    const { version: data } = module

    const rendermenu = (item) => {
      return (
        <Menu>
          <Menu.Item>
            <a onClick={(e) => this.showModule(e, item)}>模块设置</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={(e) => this.handleDelete(e, item)}>删除</a>
          </Menu.Item>
        </Menu>
      )
    };

    const renderMoreBtn = (item) => {
      return (
        <Dropdown overlay={rendermenu(item)}>
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      )
    }

    const columns = [
      {
        title: '版本名称',
        dataIndex: 'versionName',
        key: 'versionName',
      },
      {
        title: '修改时间',
        dataIndex: 'gmtModified',
        key: 'gmtModified',
      },
      {
        title: '操作',
        key: 'action',
        width: '150px',
        render: (text, record) => (
          <span>
            <a onClick={(e) => this.showUpdateVersion(e, record)}  href="javascript:;">编辑</a>
            <Divider type="vertical" />
            {renderMoreBtn(record)}
          </span>
        ),
      },
    ];

    return <Table columns={columns} dataSource={data} pagination={false} loading={loading}/>;
  }
  // 新增版本
  renderAddVersion() {

    const { loading, form } = this.props

    const { getFieldDecorator } = form

    const { visibleVersion } = this.state

    const formItemLayout = {
      style: {
        width: '100%',
        marginBottom: 24,
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title="新增版本"
        visible={visibleVersion}
        onOk={this.handleVersionOk}
        confirmLoading={loading}
        onCancel={this.handleVersionCancel}
        className={styles.addversion}
      >
        <Form layout="inline" hideRequiredMark className={styles.formCol}>

          <FormItem {...formItemLayout} label="版本名称">
            {getFieldDecorator('versionName',  {
              rules: [
                {
                  required: true,
                  message: '请输入版本名称',
                },
              ],
            })(
              <Input  placeholder="请输入版本名称"  />
            )}
          </FormItem>

        </Form>
      </Modal>
    );
  }
  // 编辑版本
  renderUpdateVersion() {

    const { loading, form } = this.props

    const { getFieldDecorator } = form;

    const { visibleUpdateVersion } = this.state;

    const formItemLayout = {
      style: {
        width: '100%',
        marginBottom: 24,
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title="编辑版本"
        visible={visibleUpdateVersion}
        onOk={this.handleUpdateVersionOk}
        confirmLoading={loading}
        onCancel={this.handleUpdateVersionCancel}
        className={styles.addversion}
      >
        <Form layout="inline" hideRequiredMark className={styles.formCol}>

          <FormItem {...formItemLayout} label="版本名称">
            {getFieldDecorator('versionName',  {
              rules: [
                {
                  required: true,
                  message: '请输入版本名称',
                },
              ],
            })(
              <Input  placeholder="请输入版本名称"  />
            )}
          </FormItem>

        </Form>
      </Modal>
    );
  }
  // 模块设置
  // 模块列表
  renderModuleTable() {

    const { form, module } = this.props;

    const { selectedRowKeys, expandedRowKeys } = this.state

    // const { list: data } = module
    const data = [
        {
            "children": [
                {
                    "children": [
                        {
                            "rightsId": 100000,
                            "rightsName": "字字字",
                            "rightsSequence": '010101'
                        },
                        {
                            "rightsId": 100002,
                            "rightsName": "字字字",
                            "rightsSequence": '010102'
                        }
                    ],
                    "descriptionEnglish": "测试内容ed84",
                    "description": "测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u",
                    "gmtModified": "1991-01-27",
                    "rightsId": 1000,
                    "rightsNameEnglish": "测试内容mhsv",
                    "rightsName": "字字字字",
                    "rightsSequence": '0101',
                    "rightsUrl": "测试内容tf51"
                },
                {
                    "children": [
                        {
                            "rightsId": 100001,
                            "rightsName": "字字字字字",
                            "rightsSequence": '010201'
                        }
                    ],
                    "descriptionEnglish": "测试内容ed84",
                    "description": "测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u",
                    "gmtModified": "2015-03-21",
                    "rightsId": 1001,
                    "rightsNameEnglish": "测试内容mhsv",
                    "rightsName": "字字字",
                    "rightsSequence": '0102',
                    "rightsUrl": "测试内容tf51"
                }
            ],
            "description": "测试内容04r6",
            "descriptionEnglish": "测试内容jyj0",
            "gmtModified": "1974-01-20",
            "rightsId": 10,
            "rightsNameEnglish": "测试内容89q5",
            "rightsName": "汉汉汉汉",
            "rightsSequence": '01',
            "rightsUrl": "测试内容jxpx"
        },
    ]
    const columns = [
      {
        title: '模块名称',
        dataIndex: 'rightsName',
        key: 'rightsName',
      },
      {
        title: '模块地址',
        dataIndex: 'rightsUrl',
        key: 'rightsUrl',
        width: '45%'
      }
    ];

    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRowKeys = selectedRowKeys // 获得 key (array), 单选更新
      },
      onSelect: (record, selected, selectedRows) => {

        this.childrenKeys = []

        this.parentKeys = []

        if (record.children) { // 有子集特殊处理
          this.getKeys(record.children)
        }

        if (selected) {

          this.getParents(record.rightsSequence.toString(), data)

          this.selectedRowKeys = Array.from(new Set([...this.selectedRowKeys, ...this.childrenKeys, ...this.parentKeys]))

        } else {

          this.deleteKeys(this.childrenKeys)

        }

        this.setState({
          selectedRowKeys: this.selectedRowKeys
        })

      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.setState({
          selectedRowKeys: this.selectedRowKeys
        })
      },
    };

    const tableProperty = {
      rowKey: 'rightsId',
      columns: columns,
      dataSource: data,
      pagination: false,
      rowSelection: rowSelection,
      expandedRowKeys: expandedRowKeys,
      onExpandedRowsChange: (expandedRows) => {
        this.setState({
          expandedRowKeys: expandedRows
        })
      }
    }

    return <Table {...tableProperty} />;
  }
  // 模块弹出框
  renderModuleSetting() {
    const { loading } = this.props
    const { visibleModule } = this.state;
    return (
      <Modal
        title="模块设置"
        visible={visibleModule}
        onOk={this.handleModuleOk}
        confirmLoading={loading}
        onCancel={this.handleModuleCancel}
        className={styles.editModule}
        width={880}
      >
        {this.renderModuleTable()}
      </Modal>
    );
  }
// ------ main Dom -------
  render() {
    return (
      <Fragment>
        <Card>
          {this.renderSearchForm()}

          {this.renderTableList()}

          {this.renderAddVersion()}

          {this.renderUpdateVersion()}

          {this.renderModuleSetting()}
        </Card>
      </Fragment>
    );
  }
}
