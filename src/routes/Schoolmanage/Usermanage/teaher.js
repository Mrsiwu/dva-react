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
  Tabs,
  Avatar,
  Badge,
  Divider,
  Dropdown,
  Menu,
  Icon,
  Modal,
  Radio,
  Upload,
  Table   
} from 'antd';
import styles from './module.less';
import TableVirtualized from '../../../components/TableVirtualized';
const { Meta } = Card;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
@connect(({
  global,
  loading
}) => ({
  global,
  loading
}))
@Form.create()
export default class TeaherList extends Component {
  state = {
    visibleedittea:false,
    visiblebatchimport:false,
    confirmDirty: false,
    visibleaddrole:false,
    modulevisible:false,
    isedittea :0,
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
  handleeditteshow = () => {
    console.log('11')
    this.setState({
      visibleedittea: true  
    })
  }

  handleeditteOk  = () => {
    this.setState({
      visibleedittea: false
    })
  }

  handleeeditteCancel = () => {
    this.setState({
      visibleedittea: false
    })
  }

  renderedittea(){
    const {isedittea} = this.state
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
    
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    return (
      <Modal
       title="新增"
       visible={this.state.visibleedittea}
       onOk={this.handleeditteOk}
       onCancel={this.handleeeditteCancel}
       className={styles.modelColTea} >
       <Form  layout="inline" className = {styles.formCol}>
        <FormItem
          style={isedittea==0?styleshow:stylehide}
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
        style={isedittea==0 || isedittea == 1?styleshow:stylehide}
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
        style={isedittea==0 || isedittea == 2?styleshow:stylehide}
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
        style={isedittea==0 || isedittea == 2?styleshow:stylehide}
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
        style={isedittea==0 || isedittea == 1?styleshow:stylehide}
        {...formItemLayout}
        label="选择角色">
          {getFieldDecorator('rolearray', {
            rules: [{
              required: true, message: '请选择角色!',
            }],
          })(
            <Select
              mode="multiple"
              placeholder="请选择角色"
              onChange={handleChange}
            >
              {children}
            </Select>
          )}
        </FormItem>
        <FormItem
        style={isedittea==0 || isedittea == 1?styleshow:stylehide}
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
       <span>2.格式要求：除班级、课程可不填外，其余信息必须严格按照导入模板格式；</span><br />
       <span>3.内容要求：</span><br />
       <div style={{marginLeft:10}}>
         <span>3.1 登录账号：只能为6~16位英文、数字、“_”的组合字符，且首字母不能为数字；</span><br />
         <span>3.2 密码：长度6~16位英文、数字字符，区分大小写；</span>
       </div>
     </Modal>
   )
  }
  handleaddroleshow = () => {
    this.setState({
      visibleaddrole: true
    })
  }
  handleaddroleOk = () => {
    this.setState({
      visibleaddrole: false
    })
  }
  handleaddroleCancel = () => {
    this.setState({
      visibleaddrole: false
    })
  }

  rendereditrole(){
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      style:{
        width:'100%',
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
       title="新增角色"
       visible={this.state.visibleaddrole}
       onOk={this.handleaddroleOk}
       onCancel={this.handleaddroleCancel}
       className={styles.modelColTea} >
       <Form  layout="inline" className = {styles.formCol}>
        <FormItem
        {...formItemLayout}
        label="角色名称">
          {getFieldDecorator('realname', {
            rules: [{
              required: true, message: '请输入角色名称!',
            }],
          })(
            <Input placeholder="请输入角色名称" />
          )}
        </FormItem>
       </Form>
     </Modal>
   )
  }

   //模块设置start-----------------
   showmoduleset = (e, item) => {
    console.log(item);
    this.setState({
      modulevisible: true,
    });
  };
  handleOkmoduleset = e => {
    console.log(e);
    this.setState({
      modulevisible: false,
    });
  };
  handleCancelmoduleset = e => {
    console.log(e);
    this.setState({
      modulevisible: false,
    });
  };
  rendermoduleset() {
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '模块名称',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
      },
      {
        title: '模块地址',
        dataIndex: 'address',
        key: 'address',
        width: '30%',
      },
      {
        title: '操作',
        dataIndex: 'address',
        key: 'action',
      },
    ];

    const data = [
      {
        key: 1,
        name: 'John Brown sr.',
        age: 60,
        address: 'New York No. 1 Lake Park',
        children: [
          {
            key: 11,
            name: 'John Brown',
            age: 42,
            address: 'New York No. 2 Lake Park',
          },
          {
            key: 12,
            name: 'John Brown jr.',
            age: 30,
            address: 'New York No. 3 Lake Park',
            children: [
              {
                key: 121,
                name: 'Jimmy Brown',
                age: 16,
                address: 'New York No. 3 Lake Park',
              },
            ],
          },
          {
            key: 13,
            name: 'Jim Green sr.',
            age: 72,
            address: 'London No. 1 Lake Park',
            children: [
              {
                key: 131,
                name: 'Jim Green',
                age: 42,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 1311,
                    name: 'Jim Green jr.',
                    age: 25,
                    address: 'London No. 3 Lake Park',
                  },
                  {
                    key: 1312,
                    name: 'Jimmy Green sr.',
                    age: 18,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 2,
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
    ];

    // rowSelection objects indicates the need for row selection
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
    return (
      <Modal
        title="模块设置"
        className={styles.editModule}
        width={880}
        visible={this.state.modulevisible}
        onOk={this.handleOkmoduleset}
        onCancel={this.handleCancelmoduleset}
      >
        <Form layout="inline" style={{ marginBottom: 15 }}>
          <Row className={styles.rowForm}>
            <Col md={12} sm={24}>
              <FormItem label="关键词">
                {getFieldDecorator('modulekeyword')(<Input placeholder="搜索模块名称、模块地址查询" className={styles.inputbox} />)}
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
        <Table columns={columns} rowSelection={rowSelection} dataSource={data} />
      </Modal>
    );
  }

  // 教师列表
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
          xl: 4,
          lg: 8,
          md: 8,
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
        title: '角色',
        key: 'roleName',
        width:{
          xl: 4,
          lg: 8,
          md: 8,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div style={{height:45,lineHeight:'45px'}}>
            <span>子管理员 , 客服 , 教师</span>
          </div>
          
        )
      },
      {
        title: '最近登录',
        key: 'lastlogintime',
        width:{
          xl: 6,
          lg: 8,
          md: 8,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div style={{height:45}}>
            <span>2018-01-01 00:00:00</span>
            <br />
            <span>101.69.252.186（浙江-杭州）</span>
          </div>
        )
      },
      {
        title: '联系方式',
        key: 'contactWay',
        width:{
          xl: 4,
          lg: 8,
          md: 8,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div style={{height:45}}>
            <span>13695487513</span>
            <br />
            <span>439388665@qq.com</span>
          </div>
        )
      },
      {
        title: '状态',
        key: 'state',
        width:{
          xl: 2,
          lg: 8,
          md: 8,
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
          lg: 8,
          md: 8,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <div style={{height:45,lineHeight:'45px'}}>
            <a  href="javascript:;">进入教师平台</a>
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
      rowHeight: [340, 183, 122, 122, 61],
      pagination: pagination
    }
    return (
      <div>
        <TableVirtualized {...table} />
      </div>
    )
  }
  // 角色列表
  renderrolemangaeTableList() {
    const { global } = this.props;
    const data = [{},{}]
    const rendermenu = (item) => {
      return (
        <Menu>
          <Menu.Item>
            <a onClick={(e) => this.showmoduleset(e,item)}>权限设置</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a>查看</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a>删除</a>
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
        title: '角色',
        key: 'roleName',
        width:{
          xl: 6,
          lg: 6,
          md: 12,
          sm: 12,
          xs: 12
        },
        render: (record) => ( 
          <span>管理员</span>
        )
      },
      {
        title: '人数',
        key: 'peoplenum',
        width:{
          xl: 6,
          lg: 6,
          md: 12,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <span>3</span>
        )
      },
      {
        title: '最新修改',
        key: 'latestrevision',
        width:{
          xl: 6,
          lg: 6,
          md: 12,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <span>2018-12-01 00:00:00</span>
        )
      },
      
      {
        title: '操作',
        key: 'action',
        width: {
          xl: 6,
          lg: 6,
          md: 12,
          sm: 12,
          xs: 12
        },
        render: (record) => (
          <span>
            <a  href="javascript:;">编辑</a>
            <Divider type="vertical" />
            {renderMoreBtn(record)}
          </span>
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
      rowHeight: [130, 80, 80, 40, 40],
      pagination: pagination
    }
    return (
      <div>
        <TableVirtualized {...table} />
      </div>
    )
  }
  // 搜索栏start--------------------------
  renderteaSearchForm() {
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
              {getFieldDecorator('keywordsrole')(<Input placeholder="搜索账号、姓名" />)}
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
              onClick={(e) => this.handleeditteshow(e)}
              className={styles.addmodule}
            >
              新增
            </Button>
            <Button
             onClick={(e) => this.handlebatchimportshow(e)}
              style={{ marginLeft: 8 }}>
              导入
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  renderroleSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row gutter={24} className={styles.rowForm}>
          <Col xl={6} lg={8} md={12} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索角色" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col style={{marginBottom:'12px'}}  xl={18} lg={16} md={12} sm={24}>
            <span className={styles.buttonBox}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }}>重置</Button>
            </span>
          </Col>
          <Col sm={24}>
            <Button
              type="primary"
              icon="plus"
              onClick={(e) => this.handleaddroleshow(e)}
              
              className={styles.addmodule}
            >
              新增
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
        <Tabs onChange={this.tabchange} type="card">
          <TabPane tab="教师列表" key="1">
            {this.renderteaSearchForm()}
            {this.renderTableList()}
            {this.renderedittea()}
            {this.renderbatchimport()}
          </TabPane>
          <TabPane tab="角色管理" key="2">
            {this.renderroleSearchForm()}
            {this.renderrolemangaeTableList()}
            {this.rendermoduleset()}
            {this.rendereditrole()}
          </TabPane>
        </Tabs>
        </Card>
      </Fragment>
    );
  }
}
