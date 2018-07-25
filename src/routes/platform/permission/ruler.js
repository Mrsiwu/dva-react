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
  List,
  Badge
} from 'antd';
import TableVirtualized from '../../../components/TableVirtualized';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import styles from './permission.less';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
let isMobile;
enquireScreen(b => {
  isMobile = b
}, 'only screen and (max-width: 600px)');

@connect(({ global, rule, loading }) => ({
    global,
    rule,
    loading: loading.models.rule
 }))

@Form.create()


export default class RulerList extends Component {
  state = {
    isMobile,
    confirmDirty: false,
    visibleAddUser: false,
    visibleEditUser: false,
    visibleEditPassWord: false,
    confirmLoading: false,
  };

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
      payload: {
        currentPage: 1,
        pageSize: 100,
      }
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
// ------ handle event-------
  handleQuery = () => {

  }

  handleReset = () => {

  }

  handleDelete = (e, item) => {

  }
  // ----- visibleModule --------
  // ---------- 新增用户 ---------
  showModal = (e, item) => {
    const { form } = this.props;

    // form.resetFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress']);
    //
    // form.setFields({
    //   parentModule: {
    //     value: '1'
    //   }
    // });

    this.setState({
      visibleAddUser: true,
    })

  }

  handleOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress'], (err, fieldsValue) => {

      if (err) return;

      this.setState({
        confirmLoading: true,
      })
      console.log(fieldsValue)
      setTimeout(() => {
        this.setState({
          visibleAddUser: false,
          confirmLoading: false,
        });
      }, 2000);

    })
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visibleAddUser: false,
    })
  }
  // ---------- 编辑用户 ---------
  showEditModal = (e, item) => {
    const { form } = this.props;

    // form.resetFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress']);
    //
    // form.setFields({
    //   parentModule: {
    //     value: '1'
    //   }
    // });

    this.setState({
      visibleEditUser: true,
    })

  }

  handleEditOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress'], (err, fieldsValue) => {

      if (err) return;

      this.setState({
        confirmLoading: true,
      })
      console.log(fieldsValue)
      setTimeout(() => {
        this.setState({
          visibleEditUser: false,
          confirmLoading: false,
        });
      }, 2000);

    })
  }

  handleEditCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visibleEditUser: false,
    })
  }
  // ---------- 修改密码 ---------
  showEditPassWordModal = (e, item) => {
    const { form } = this.props;

    // form.resetFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress']);
    //
    // form.setFields({
    //   parentModule: {
    //     value: '1'
    //   }
    // });

    this.setState({
      visibleEditPassWord: true,
    })

  }

  handleEditPassWordOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress'], (err, fieldsValue) => {

      if (err) return;

      this.setState({
        confirmLoading: true,
      })
      console.log(fieldsValue)
      setTimeout(() => {
        this.setState({
          visibleEditPassWord: false,
          confirmLoading: false,
        });
      }, 2000);

    })
  }

  handleEditPassWordCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visibleEditPassWord: false,
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
            <FormItem label="选择角色">
              {getFieldDecorator('keywords')(
                <Select placeholder="请选择">
                  <Option value="0">无</Option>
                  <Option value="1">无22无</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={10} md={12} sm={24} style={{marginLeft: 10}}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索模块名称、模块地址查询" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={8} md={12} sm={24}>
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
              新增用户
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  // 用户列表
  renderTableList() {
    const { rule, global } = this.props;

    const { collapsed } = global

    const data = rule.data.list

    const rendermenu = (item) => {
      return (
        <Menu>
          <Menu.Item>
            <a onClick={(e) => this.showEditPassWordModal(e, item)}>修改密码</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a onClick={(e) => this.handleDelete(e, item)}>删除</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a onClick={(e) => this.handleDelete(e, item)}>锁定</a>
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
    const statusMap = ['default', 'processing', 'success', 'error'];
    const status = ['关闭', '运行中', '已上线', '异常'];
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'no',
        key: 'no',
        width:{
          xl: 6,
          lg: 6,
          md: 12,
          sm: 8,
          xs: 24
        }
      },
      {
        title: '用户',
        dataIndex: 'owner',
        key: 'owner',
        width:{
          xl: 6,
          lg: 6,
          md: 12,
          sm: 8,
          xs: 12
        }
      },
      {
        title: '角色',
        dataIndex: 'no',
        key: 'age',
        width:{
          xl: 4,
          lg: 4,
          md: 12,
          sm: 8,
          xs: 12
        }
      },
      {
        title: '状态',
        key: 'status',
        width:{
          xl: 4,
          lg: 4,
          md: 12,
          sm: 8,
          xs: 12
        },
        render: (record) => (
          <span>
            <Badge status={statusMap[record.status]} text={status[record.status]} />
          </span>
        )
      },
      {
        title: '操作',
        key: 'action',
        width: {
          xl: 4,
          lg: 4,
          md: 12,
          sm: 8,
          xs: 12
        },
        render: (record) => (
          <span>
            <a onClick={(e) => this.showEditModal(e, record)}  href="javascript:;">编辑</a>
            <Divider type="vertical" />
            {renderMoreBtn(record)}
          </span>
        ),
      },
    ];

    return (
      <div >
        <TableVirtualized columns={columns} dataSource={data} rowHeight={[190,108,108,54,54]} />
      </div>
    )
  }
  // 表单校验
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  // 账号校验
  validateaccount = (rule, value, callback) => {
    const form = this.props.form;
    if (value && !(/^[a-zA-Z][a-zA-Z0-9]{5,19}$/.test(value))) {
      callback('请输入以字母开头6-20位英文、数字')
    }
    callback();
  }
  // 密码校验
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    if (!(/^[a-zA-Z0-9]{6,18}$/.test(value))) {
      callback('请输入6-18位密码')
    }
    callback();
  }
  // 密码校验
  compareToFirstPassword = (rule, value, callback) => {
   const form = this.props.form;
   if (value && value !== form.getFieldValue('password')) {
     callback('两次密码不一致!');
   } else {
     callback();
   }
  }
  // 新增用户
  renderAddUserModal() {
    const { visibleAddUser, confirmLoading } = this.state;
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
        title="新增用户"
        visible={visibleAddUser}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}>
        <Form layout="inline" hideRequiredMark className={styles.formCol}>
          <FormItem
            {...formItemLayout}
            label="用户名">
            {getFieldDecorator('nickname', {
              rules: [
                { required: true, message: '请输入账号' },
                { validator: this.validateaccount}],
            })(
              <Input type="text" placeholder="由6-20位英文、数字且字母开头组成"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="真实姓名">
              {getFieldDecorator('realname', {
                rules: [{
                  required: true, message: '请输入真实姓名!',
                }],
              })(
                <Input placeholder="填写用户真实姓名"  />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="密码" >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password" placeholder="请输入6-18位密码" onBlur={this.handleConfirmBlur}/>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认密码">
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '输入确认密码!',
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input type="password" placeholder="再次输入密码" onBlur={this.handleConfirmBlur} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="选择角色">
            {getFieldDecorator('role', {
              rules: [{
                required: true, message: '请选择角色!',
              }],
            })(
              <Select placeholder="请选择角色">
                <Option value="0">无</Option>
                <Option value="1">无22无</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
  // 编辑用户
  renderEditUserModal() {
    const { visibleEditUser, confirmLoading } = this.state;
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
        title="编辑用户"
        visible={visibleEditUser}
        onOk={this.handleEditOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleEditCancel}>
        <Form layout="inline" hideRequiredMark className={styles.formCol}>
          <FormItem
            {...formItemLayout}
            label="真实姓名">
              {getFieldDecorator('realname', {
                rules: [{
                  required: true, message: '请输入真实姓名!',
                }],
              })(
                <Input placeholder="填写用户真实姓名" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="选择角色">
            {getFieldDecorator('role', {
              rules: [{
                required: true, message: '请选择角色!',
              }],
            })(
              <Select placeholder="请选择角色">
                <Option value="0">无</Option>
                <Option value="1">无22无</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
  // 修改密码
  renderEditPassWordModal() {
    const { visibleEditPassWord, confirmLoading } = this.state;
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
        title="修改密码"
        visible={visibleEditPassWord}
        onOk={this.handleEditPassWordOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleEditPassWordCancel}>
        <Form layout="inline" hideRequiredMark className={styles.formCol}>
          <FormItem
            {...formItemLayout}
            label="密码" >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password" placeholder="请输入6-18位密码"/>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认密码">
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '输入确认密码!',
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input type="password" placeholder="再次输入密码" onBlur={this.handleConfirmBlur} />
              )}
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

          {this.renderAddUserModal()}

          {this.renderEditUserModal()}

          {this.renderEditPassWordModal()}
        </Card>
      </Fragment>
    );
  }
}
