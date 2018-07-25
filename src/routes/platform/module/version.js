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
  loading: loading.models.list,
  global,
  module
}))
@Form.create()
export default class ModuleVersion extends Component {
  state = {
    visibleVersion: false,
    visibleModule: false,
    confirmLoading: false,
    loading: false
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    const { dispatch, form } = this.props;
    this.setState({
      loading: true
    })

    let params = {
      versionName: form.getFieldValue('keywords')
    }

    dispatch({
      type: 'module/versionFetch',
      payload: params,
      callback: (res) => {
        this.setState({
          loading: false
        })
      }
    });
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
  // ------ visibleVersion-------
  showVersion = (e, item) => {
    console.log(e, item)
    const { form } = this.props;

    // form.resetFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress']);
    //
    // form.setFields({
    //   parentModule: {
    //     value: '1'
    //   }
    // });

    this.setState({
      visibleVersion: true,
    })

  }

  handleVersionOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress'], (err, fieldsValue) => {

      if (err) return;

      this.setState({
        confirmLoading: true,
      })
      console.log(fieldsValue)
      setTimeout(() => {
        this.setState({
          visibleVersion: false,
          confirmLoading: false,
        });
      }, 2000);

    })
  }

  handleVersionCancel = () => {
    this.setState({
      visibleVersion: false,
    })
  }
  // ------ visibleModule -------
  showModule = (e, item) => {
    console.log(e, item)
    const { form } = this.props;

    form.resetFields(['versionName']);

    if (item) {
      form.setFields({
        versionName: {
          value: '1'
        }
      });
    }

    this.setState({
      visibleModule: true,
    })

  }

  handleModuleOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress'], (err, fieldsValue) => {

      if (err) return;

      this.setState({
        confirmLoading: true,
      })
      console.log(fieldsValue)
      setTimeout(() => {
        this.setState({
          visibleModule: false,
          confirmLoading: false,
        });
      }, 2000);

    })
  }

  handleModuleCancel = () => {
    console.log('Clicked cancel button');
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
    const { version: data } = this.props.module
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
            <a onClick={(e) => this.showVersion(e, record)}  href="javascript:;">编辑</a>
            <Divider type="vertical" />
            {renderMoreBtn(record)}
          </span>
        ),
      },
    ];

    return <Table columns={columns} dataSource={data} pagination={false} loading={this.state.loading}/>;
  }
  // 新增/编辑版本
  renderAddVersion() {
    const { visibleVersion, confirmLoading } = this.state;
    const { getFieldDecorator } = this.props.form;
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
        confirmLoading={confirmLoading}
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
  // 模块设置
  renderModuleSearch() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row className={styles.rowForm}>
          <Col md={12} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索模块名称、模块地址查询" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.buttonBox}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }
  // 模块列表
  renderModuleTable() {
    const { form, module } = this.props;
    const { list: data } = module
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
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };

    return <Table columns={columns} dataSource={data} rowSelection={rowSelection}  pagination={false} />;
  }
  // 模块弹出框
  renderModuleSetting() {
    const { visibleModule, confirmLoading } = this.state;
    return (
      <Modal
        title="模块设置"
        visible={visibleModule}
        onOk={this.handleModuleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleModuleCancel}
        className={styles.editModule}
        width={880}
      >
        {this.renderModuleSearch()}
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

          {this.renderModuleSetting()}
        </Card>
      </Fragment>
    );
  }
}
