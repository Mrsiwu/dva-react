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
  Table,
  Divider,
  Dropdown,
  Menu,
  Icon,
  Modal,
  Upload
} from 'antd';
import styles from './module.less';
const FormItem = Form.Item;
const Option = Select.Option;
@connect(({
  global,
  loading
}) => ({
  global,
  loading
}))
@Form.create()
export default class ClassList extends Component {
  state = {
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


  // 班级列表
  renderTableList() {
    const rendermenu = (item) => {
      return (
        <Menu>
          <Menu.Item>
            <a>编辑</a>
          </Menu.Item>
          <Menu.Item>
            <a>学生管理</a>
          </Menu.Item>
          <Menu.Item>
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

    const columns = [{
      title: '班级',
      dataIndex: 'name',
      key: 'class',
      
    }, {
      title: '人数',
      key: 'peoplenum',
      dataIndex: 'age',
      width: '10%',
    }, {
      title: '关联教师',
      width: '30%',
      dataIndex: 'address',
      key: 'relationteacher',
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (text, record) => (
        <span>
          <a onClick={(e) => this.showModal(e, record)}  href="javascript:;">选择教师</a>
          <Divider type="vertical" />
          {renderMoreBtn(record)}
        </span>
      ),
    }];
    
    const data = [{
      key: 1,
      name: 'John Brown sr.',
      age: 60,
      address: 'New York No. 1 Lake Park',
      children: [{
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      }, {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [{
          key: 121,
          name: 'Jimmy Brown',
          age: 16,
          address: 'New York No. 3 Lake Park',
        }],
      }, {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [{
          key: 131,
          name: 'Jim Green',
          age: 42,
          address: 'London No. 2 Lake Park',
          children: [{
            key: 1311,
            name: 'Jim Green jr.',
            age: 25,
            address: 'London No. 3 Lake Park',
          }, {
            key: 1312,
            name: 'Jimmy Green sr.',
            age: 18,
            address: 'London No. 4 Lake Park',
          }],
        }],
      }],
    }, {
      key: 2,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    }];
    return <Table columns={columns} dataSource={data} pagination={false} />
  }

  // 搜索栏start--------------------------
  renderstuSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row gutter={24} className={styles.rowForm}>
          <Col xl={8} lg={10} md={12} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索班级名称" />)}
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
              className={styles.addmodule}
            >
              新增
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={(e) => this.handlebatchimportshow(e)}
            >
              导入
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
        {this.renderbatchimport()}
        </Card>
      </Fragment>
    );
  }
}
