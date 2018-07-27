import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Avatar,
  Badge,
  Divider,
  Dropdown,
  Menu,
  Icon,
  TreeSelect,
  Modal,
  Radio,
  Upload 
} from 'antd';
import styles from './module.less';
import TableVirtualized from '../../../components/TableVirtualized';
const { Meta } = Card;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_ALL = TreeSelect.SHOW_ALL;

const treeData = [{
  title: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    title: 'Child Node1',
    value: '0-0-0',
    key: '0-0-0',
  }],
}, {
  title: 'Node2',
  value: '0-1',
  key: '0-1',
  children: [{
    title: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0',
  }, {
    title: 'Child Node4',
    value: '0-1-1',
    key: '0-1-1',
  }, {
    title: 'Child Node5',
    value: '0-1-2',
    key: '0-1-2',
  }],
}];

@connect(({
  global,
  loading
}) => ({
  global,
  loading
}))
@Form.create()
export default class StudentList extends Component {
  state = {
    visibleeditstu:false,
    iseditstu:false,
    confirmDirty:false,
    visiblebatchimport:false,
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    }], 
  };
  componentDidMount() {
  }
  componentWillUnmount(){}
  tabchange = (key) => {
    console.log(key)
  }

  //  校验
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  validateaccount = (rule, value, callback) => {
    const form = this.props.form;
    if (value && !(/^[a-zA-Z][a-zA-Z0-9]{5,19}$/.test(value))) {
      callback('请输入以字母开头6-20位英文、数字')
    }
    callback();
  }
  validatemobile = (rule, value, callback) => {
    const form = this.props.form;
    if (value && !(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(value))) {
      callback('请输入正确手机号码')
    }
    callback();
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    if (!(/^[a-zA-Z0-9]{6,16}$/.test(value))) {
      callback('请输入6-16位密码')
    }
    callback();
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  }

  handleeditstushow = () => {
    console.log('11')
    this.setState({
      visibleeditstu: true
    })
  }

  handleeditstuOk  = () => {
    this.setState({
      visibleeditstu: false
    })
  }

  handleeeditstuCancel = () => {
    this.setState({
      visibleeditstu: false
    })
  }

  rendereditstu(){
    const {iseditstu} = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    let stylehide = {
      width:'100%',
      display:'none'
    }
    let styleshow = {
      width:'100%',
    }
    function treeonChange(value) {
      console.log('onChange ', value);
      //this.setState({ value });
    }

    const tProps = {
      treeData,
      //value: this.state.value,
      onChange: treeonChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_ALL,
      treeCheckStrictly:true,
      searchPlaceholder: '请选择',
    };

    return (
      <Modal
       title="新增"
       visible={this.state.visibleeditstu}
       onOk={this.handleeditstuOk}
       onCancel={this.handleeeditstuCancel}
       className={styles.modelColTea} >
       <Form  layout="inline" className = {styles.formCol}>
        <FormItem
          style={iseditstu==0?styleshow:stylehide}
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('nickname', {
            rules: [
              { required: true, message: '请输入用户名' },
              { validator: this.validateaccount}],
          })(
            <Input type="text" placeholder="由6-20位英文、数字且字母开头组成"/>
          )}
        </FormItem>
        <FormItem
        style={iseditstu==0 || iseditstu == 1?styleshow:stylehide}
        {...formItemLayout}
        label="真实姓名">
          {getFieldDecorator('realname', {
            rules: [{
              required: true, message: '请输入真实姓名!',
            }],
          })(
            <Input placeholder="填写用户真实姓名" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem
        style={iseditstu==0 || iseditstu == 2?styleshow:stylehide}
        {...formItemLayout}
        label="密码" >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" placeholder="请输入6-16位密码"/>
          )}
        </FormItem>
        <FormItem
        style={iseditstu==0 || iseditstu == 2?styleshow:stylehide}
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
        style={iseditstu==0 || iseditstu == 1?styleshow:stylehide}
        {...formItemLayout}
        label="选择角色">
          {getFieldDecorator('rolearray', {
            rules: [{
              required: true, message: '请选择角色!',
            }],
          })(
            <TreeSelect {...tProps} />
          )}
        </FormItem>
        <FormItem
        style={iseditstu==0 || iseditstu == 1?styleshow:stylehide}
        {...formItemLayout}
        label="性别">
          {getFieldDecorator('sex',
          {initialValue: '0'}
          )(
              <RadioGroup>
               <Radio value="0">男</Radio>
               <Radio value="1">女</Radio>
             </RadioGroup>
          )}
        </FormItem>
       </Form>
     </Modal>
   )
  }

  handlebatchimportshow = () => {
    this.setState({
      visiblebatchimport: true
    })
  }
  handlebatchimportOk = () => {
    this.setState({
      visiblebatchimport: false
    })
  }
  handlebatchimportCancel = () => {
    this.setState({
      visiblebatchimport: false
    })
  }
  handleChange = (info) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });

    this.setState({ fileList });
  }

  renderbatchimport(){
    const { getFieldDecorator } = this.props.form
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange: this.handleChange,
      multiple: true,
    };
    return (
      <Modal
       title="批量导入"
       visible={this.state.visiblebatchimport}
       onOk={this.handlebatchimportOk}
       onCancel={this.handlebatchimportCancel} >

       <Form layout="inline">
        <Row gutter={24}>
          <Col xl={18} lg={16} md={14} sm={24}>
          <FormItem className={styles.uploadimport} >
            {getFieldDecorator('upload',)(
              <Upload {...props} fileList={this.state.fileList}>
                <Button>
                  <Icon type="upload" /> 选择文件
                </Button>
              </Upload>
            )}
          </FormItem>
          </Col>
          <Col style={{marginBottom:'12px'}}  xl={6} lg={8} md={10} sm={24}>
            <span className={styles.buttonBox}>
              <Button type="primary" htmlType="submit">提交</Button>
            </span>
          </Col>
        </Row>
       </Form>
       <Divider />
       <p>导入须知：</p>
       <span>1.文件类型：仅支持excel文件上传；</span><br />
       <span>2.格式要求：必须严格按照导入模板格式；</span><br />
       <span>3.内容要求：</span><br />
       <div style={{marginLeft:10}}>
         <span>3.1 登录账号：只能为6~16位英文、数字、“_”的组合字符，且首字母不能为数字；</span><br />
         <span>3.2 密码：长度6~16位英文、数字字符，区分大小写；</span>
         <span>3.3 班级：班级必须已存在，上下级班级间用‘-’隔开，且从最上级班级开始，例如“一年级-一（1）班”，多班级用英文的“,”隔开；</span>
       </div>
     </Modal>
   )
  }

  // 学生列表
  renderTableList() {
    const { global } = this.props;
    const data = [{},{}]
    const rendermenu = (item) => {
      return (
        <Menu>
          <Menu.Item>
            <a>编辑</a>
          </Menu.Item>
          <Menu.Item>
            <a>修改密码</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a>删除</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a>锁定</a>
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
    const statusMap = ['processing', 'error', 'success'];
    const status = ['正常', '锁定'];
    const columns = [
      {
        title: '账号',
        key: 'userName',
        width:{
          xl: 3,
          lg: 6,
          md: 6,
          sm: 12,
          xs: 24
        },
        render: (text,record) => (
          <span className={styles.metapadd}>
            <Card bordered={false}>
              <Meta
                avatar={<Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title="啦啦啦"
                description="啦啦啦"
              />
            </Card>
          </span>
        )
      },
      {
        title: '所在班级',
        key: 'inclass',
        width:{
          xl: 3,
          lg: 6,
          md: 6,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div style={{height:45,lineHeight:'45px',whiteSpace:'nowrap', textOverflow: 'ellipsis',overflow: 'hidden',width: '100%'}}>
            <span>高一（1）班 , 提高班（1）</span>
          </div>
          
        )
      },{
        title: '用户来源',
        key: 'userform',
        width:{
          xl: 4,
          lg: 6,
          md: 6,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div  style={{height:45,whiteSpace:'nowrap', textOverflow: 'ellipsis',overflow: 'hidden',width: '100%'}}>
            <span>批量导入</span><br />
            <span>2018-01-01 00:00:00</span>
          </div>
        )
      },
      {
        title: '最近登录',
        key: 'lastlogintime',
        width:{
          xl: 4,
          lg: 6,
          md: 6,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div  style={{height:45,whiteSpace:'nowrap', textOverflow: 'ellipsis',overflow: 'hidden',width: '100%'}}>
            <span>2018-01-01 00:00:00</span><br />
            <span>101.69.252.186（浙江-杭州）</span>
          </div>
        )
      },
      {
        title: '联系方式',
        key: 'contactWay',
        width:{
          xl: 4,
          lg: 6,
          md: 6,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div  style={{height:45,whiteSpace:'nowrap', textOverflow: 'ellipsis',overflow: 'hidden',width: '100%'}}>
            <span>13695487513</span><br />
            <span>439388665@qq.com</span>
          </div>
        )
      },
      {
        title: '状态',
        key: 'state',
        width:{
          xl: 2,
          lg: 6,
          md: 6,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div style={{height:45,lineHeight:'45px'}}>
            <Badge status="processing" text="正常" />
          </div>
        )
      },
      {
        title: '操作',
        key: 'action',
        width: {
          xl: 4,
          lg: 12,
          md: 12,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div style={{height:45,lineHeight:'45px'}}>
            <a  href="javascript:;">进入学生后台</a>
            <Divider type="vertical" />
            {renderMoreBtn(record)}
          </div>
        ),
      },
    ];
    const pagination = {
      current: 1,
      defaultCurrent: 1,
      showQuickJumper: true,
      onChange: (currentPage, pageSize) => {
        
      },
      defaultPageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['10', '30', '50', '100', '200'],
      onShowSizeChange: (current, pageSize) => {
        
      },
      total: 100,
      hideOnSinglePage: true
    }
    const table = {
      columns: columns,
      dataSource: data,
      rowHeight: [405, 244, 122, 122, 61],
      pagination: pagination
    }
    return (
      <div>
        <TableVirtualized {...table} />
      </div>
    )
  }

  // 搜索栏start--------------------------
  renderstuSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row gutter={24} className={styles.rowForm}>
          <Col xl={7} lg={8} md={12} sm={24}>
            <FormItem label="选择角色">
              {getFieldDecorator('userrole')(
                <Select placeholder="请选择">
                  <Option value="1">管理员</Option>
                  <Option value="2">客服</Option>
                  <Option value="3">教师</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={7} lg={8} md={12} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索账号、姓名" />)}
            </FormItem>
          </Col>
          <Col style={{marginBottom:'12px'}} xl={10} lg={8} md={24} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }}>重置</Button>
            </span>
          </Col>
          <Col style={{marginBottom:'12px'}} xl={24} lg={24} md={24} sm={24}>
            <Button
              type="primary"
              icon="plus"
              onClick={(e) => this.handleeditstushow(e)}
              className={styles.addmodule}
            >
              新增
            </Button>
            <Button
              onClick={(e) => this.handlebatchimportshow(e)}

              style={{ marginLeft: 8 }}
            >
              导入
            </Button>
            <Button
              style={{ marginLeft: 8 }}
            >
              导出
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  // 搜索栏end----------------------

  render() {
    return (
      <Fragment>
        <Card>
        {this.renderstuSearchForm()}
        {this.renderTableList()}
        {this.rendereditstu()}
        {this.renderbatchimport()}
        </Card>
      </Fragment>
    );
  }
}


