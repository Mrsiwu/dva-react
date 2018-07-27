import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Table,
  Divider,
  Dropdown,
  Menu,
  Icon,
  Row,
  Col,
  Button,
  Modal,
  Select,
  Spin,
  Cascader
} from 'antd';
import styles from './module.less';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({
  global,
  module,
  loading
}) => ({
  global,
  module,
  loading: loading.effects['module/fetch'] || loading.effects['module/addFetch'] || loading.effects['module/updateFetch']  }))
@Form.create()
export default class ModuleList extends Component {
  state = {
    visibleModule: false,
    visibleUpdateModule: false
  };

  componentDidMount() {
    this.getList()
  }

  componentWillUnmount(){
    const { dispatch } = this.props;

    dispatch({
      type: 'module/clear'
    })
  }

  getList () {
    const { dispatch, form } = this.props;

    let params = {
      rightsName: form.getFieldValue('keywords')
    }

    dispatch({
      type: 'module/fetch',
      payload: params
    })
  }

// ------ handle event-------
  handleQuery = () => {
    this.getList()
  }

  handleReset = () => {
    const { form } = this.props;
    form.resetFields(['keywords']);
    this.getList()
  }

  showModal = (e, item) => {
    const { form } = this.props;

    form.resetFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress']);

    if (item) {

      let parentSequence = []
      for (let i = 1, len = item.rightsSequence.length; i < len - 2; i = i + 2) {
        let str = item.rightsSequence[i - 1] + '' + item.rightsSequence[i]
        parentSequence.push(str)
      }
      form.setFields({
        parentModule: {
          value: parentSequence.length ? parentSequence : ['']
        }
      });

    } else {

      form.setFields({
        parentModule: {
          value: ['']
        }
      });

    }

    this.setState({
      visibleModule: true,
    })

  }

  showUpdateModal = (e, item) => {
    this.rightsId = item.rightsId
    const { form } = this.props;

    form.resetFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress']);
    let parentSequence = []
    let Sequence = item.rightsSequence
    for (let i = 1, len = item.rightsSequence.length; i < len; i = i + 2) {
      let str = item.rightsSequence[i - 1] + '' + item.rightsSequence[i]
      if (i == len - 1) {
        Sequence = str
      } else {
        parentSequence.push(str)
      }
    }

    form.setFields({
      parentModule: {
        value: parentSequence.length ? parentSequence : ['']
      },
      moduleCode: {
        value: Sequence
      },
      chinaName: {
        value: item.rightsName
      },
      chinaExplain: {
        value: item.description
      },
      engbName: {
        value: item.rightsNameEnglish
      },
      engbExplain: {
        value: item.descriptionEnglish
      },
      moduleAddress: {
        value: item.rightsUrl
      }
    });

    this.setState({
      visibleUpdateModule: true,
    })

  }

  handleDelete = (e, item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'module/deleteFetch',
      payload: {
        rightsId: item.rightsId
      },
      callback: (res) => {
        this.getList()
      }
    });

  }

  // ----- visibleModule --------

  handleOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress'], (err, fieldsValue) => {

      if (err) return;

      const { parentModule, moduleCode, chinaName, chinaExplain, engbName, engbExplain, moduleAddress} = fieldsValue

      let num = ''

      for( let i = 0, len = parentModule.length; i < len; i++ ) {
        num += '' + parentModule[i]
      }

      const params = {
        rightsSequence: num + '' + moduleCode,
        rightsName: chinaName,
        description: chinaExplain,
        rightsNameEnglish: engbName,
        descriptionEnglish: engbExplain,
        rightsUrl: moduleAddress
      }

      dispatch({
        type: 'module/addFetch',
        payload: params,
        callback: (res) => {
          this.setState({
            visibleModule: false
          })
          this.getList()
        }
      });
    })
  }

  handleCancel = () => {
    this.setState({
      visibleModule: false,
    })
  }

  handleUpdateOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress'], (err, fieldsValue) => {

      if (err) return;

      const { parentModule, moduleCode, chinaName, chinaExplain, engbName, engbExplain, moduleAddress} = fieldsValue

      let num = ''

      for( let i = 0, len = parentModule.length; i < len; i++ ) {
        num += '' + parentModule[i]
      }

      const params = {
        rightsId: this.rightsId,
        rightsSequence: num + '' + moduleCode,
        rightsName: chinaName,
        description: chinaExplain,
        rightsNameEnglish: engbName,
        descriptionEnglish: engbExplain,
        rightsUrl: moduleAddress
      }

      dispatch({
        type: 'module/updateFetch',
        payload: params,
        callback: (res) => {
          this.setState({
            visibleUpdateModule: false,
          })
          this.getList()
        }
      });
    })
  }

  handleUpdateCancel = () => {
    this.setState({
      visibleUpdateModule: false,
    })
  }
// ------ render module Dom -------
  // 搜索栏
  renderSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row className={styles.rowForm}>
          <Col xl={8} lg={10} md={12} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索模块名称、模块地址查询" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={10} md={12} sm={24}>
            <span className={styles.buttonBox}>
              <Button onClick={this.handleQuery} type="primary" htmlType="submit">查询</Button>
              <Button onClick={this.handleReset} style={{ marginLeft: 8 }}>重置</Button>
            </span>
          </Col>
          <Col sm={24}>
            <Button
              type="primary"
              icon="plus"
              className={styles.addmodule}
              onClick={this.showModal}
            >
              新增模块
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  // 模块列表
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
    const { list: data } = module

    const rendermenu = (item) => {
      return (
        <Menu>
          <Menu.Item>
            <a onClick={(e) => this.showUpdateModal(e, item)}>编辑</a>
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
        title: '模块名称',
        dataIndex: 'rightsName',
        key: 'rightsName',
      },
      {
        title: '模块地址',
        dataIndex: 'rightsUrl',
        key: 'rightsUrl',
      },
      {
        title: '代码',
        dataIndex: 'rightsSequence',
        key: 'rightsSequence',
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
            <a onClick={(e) => this.showModal(e, record)}  href="javascript:;">新增</a>
            <Divider type="vertical" />
            {renderMoreBtn(record)}
          </span>
        ),
      },
    ];

    return <Table columns={columns} rowKey='rightsId' dataSource={data} pagination={false} loading={loading} />
  }
  // 新增/编辑模块
  renderAddModal() {

    const { loading, module } = this.props

    const { list } = module

    const data = [{
      key: 0,
      rightsId: 0,
      rightsName: '无',
      rightsNameEnglish: '无',
      rightsSequence: ''
      },...list]

    const { visibleModule } = this.state;

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

    // 模块代码校验
    const validateModuleCode = (rule, value, callback) => {

      if (value && !(/^[0-9]{2}$/.test(value))) {
        callback('请输入两位0~9的数字')
      }
      callback();
    }

    return (
      <Modal
        title="新增模块"
        visible={visibleModule}
        onOk={this.handleOk}
        confirmLoading={loading}
        onCancel={this.handleCancel}
        className={styles.addmodule}
      >
        <Form layout="inline" hideRequiredMark className={styles.formCol}>
          <FormItem {...formItemLayout} label="上级模块">
              {getFieldDecorator('parentModule')(
                <Cascader filedNames={{ label: 'rightsName', value: 'rightsSequence', children: 'children' }} options = {data} changeOnSelect = {true}  onChange={this.parentModuleChange} placeholder="选择上级模块" />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="代码">
            {getFieldDecorator('moduleCode',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块代码',
                },
                { validator: validateModuleCode}
              ],
            })(<Input  placeholder="请输入模块代码" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="中文名称">
            {getFieldDecorator('chinaName',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块中文名称',
                },
              ],
            })(
              <Input  placeholder="请输入模块中文名称"  />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="中文说明">
            {getFieldDecorator('chinaExplain',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块中文说明',
                },
              ],
            })(
              <TextArea placeholder="请输入模块中文说明" autosize={{ minRows: 4, maxRows: 6 }} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="英文名称">
            {getFieldDecorator('engbName',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块英文名称',
                },
              ],
            })(<Input placeholder="请输入模块英文名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="英文说明">
            {getFieldDecorator('engbExplain',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块英文说明',
                },
              ],
            })(
              <TextArea placeholder="请输入模块英文说明" autosize={{ minRows: 4, maxRows: 6 }} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="模块地址">
            {getFieldDecorator('moduleAddress',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块地址',
                },
              ],
            })(<Input placeholder="请输入模块地址" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
  // 新增/编辑模块
  renderUpdateModal() {
    const { loading, module } = this.props
    const { list } = module

    const data = [{
      key: 0,
      rightsId: 0,
      rightsName: '无',
      rightsNameEnglish: '无',
      rightsSequence: ''
      },...list]

    const { visibleUpdateModule } = this.state;

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

    // 模块代码校验
    const validateModuleCode = (rule, value, callback) => {

      if (value && !(/^[0-9]{2}$/.test(value))) {
        callback('请输入两位0~9的数字')
      }
      callback();
    }

    return (
      <Modal
        title="编辑模块"
        visible={visibleUpdateModule}
        onOk={this.handleUpdateOk}
        confirmLoading={loading}
        onCancel={this.handleUpdateCancel}
        className={styles.addmodule}
      >
        <Form layout="inline" hideRequiredMark className={styles.formCol}>
          <FormItem {...formItemLayout} label="上级模块">
              {getFieldDecorator('parentModule')(
                <Cascader filedNames={{ label: 'rightsName', value: 'rightsSequence', children: 'children' }} options = {data} changeOnSelect = {true}  onChange={this.parentModuleChange} placeholder="选择上级模块" />
              )}
          </FormItem>
          <FormItem {...formItemLayout} label="代码">
            {getFieldDecorator('moduleCode',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块代码',
                },
                { validator: validateModuleCode}
              ],
            })(<Input  placeholder="请输入模块代码" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="中文名称">
            {getFieldDecorator('chinaName',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块中文名称',
                },
              ],
            })(
              <Input  placeholder="请输入模块中文名称"  />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="中文说明">
            {getFieldDecorator('chinaExplain',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块中文说明',
                },
              ],
            })(
              <TextArea placeholder="请输入模块中文说明" autosize={{ minRows: 4, maxRows: 6 }} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="英文名称">
            {getFieldDecorator('engbName',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块英文名称',
                },
              ],
            })(<Input placeholder="请输入模块英文名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="英文说明">
            {getFieldDecorator('engbExplain',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块英文说明',
                },
              ],
            })(
              <TextArea placeholder="请输入模块英文说明" autosize={{ minRows: 4, maxRows: 6 }} />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="模块地址">
            {getFieldDecorator('moduleAddress',  {
              rules: [
                {
                  required: true,
                  message: '请输入模块地址',
                },
              ],
            })(<Input placeholder="请输入模块地址" />)}
          </FormItem>
        </Form>
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

          {this.renderAddModal()}

          {this.renderUpdateModal()}
        </Card>
      </Fragment>
    );
  }
}
