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
} from 'antd';
import styles from './user.less';

const FormItem = Form.Item;
const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="javascript:;">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="javascript:;">Action 一 {record.name}</a>
      <Divider type="vertical" />
      <a href="javascript:;">Delete</a>
      <Divider type="vertical" />
      <a href="javascript:;" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>
  ),
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

@connect(({ global }) => ({ global }))
@Form.create()
export default class UserStudent extends Component {
  state = {
    visible: false,
    confirmLoading: false,
  };

  componentDidMount() {}

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  // 搜索栏表单控件 封装好的媒体查询  xl={4} lg={4} md={4} sm={4} xs={4}
  renderSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row className={styles.rowForm}>
          <Col xl={6} lg={18} md={48} sm={72}>
            <FormItem label="选择服务商">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">已处理</Option>
                  <Option value="2">未处理</Option>
                  <Option value="3">已删除</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={18} md={48} sm={72}>
            <FormItem label="关键词">
              {getFieldDecorator('no')(<Input placeholder="搜索账号、姓名" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={18} md={48} sm={72}>
            <span className={styles.buttonBox}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }}>重置</Button>
            </span>
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

    const menu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const columns = [
      {
        title: '用户',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '所属服务商',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '所属网校',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '注册时间',
        dataIndex: 'address',
        key: 'address2',
      },
      {
        title: '注册地',
        dataIndex: 'agea',
        key: 'agea',
      },
      {
        title: '联系方式',
        dataIndex: 'ageb',
        key: 'ageb',
      },
      {
        title: '状态',
        dataIndex: 'agec',
        key: 'agec',
      },
      {
        title: '操作',
        key: 'action',
        render: () => (
          //text, record
          <span>
            <a href="javascript:;">新增</a>
            <Divider type="vertical" />
            <MoreBtn />
          </span>
        ),
      },
    ];

    return <Table columns={columns} dataSource={data} />;
  }
  // 新增/编辑模块
  renderAddModal() {
    const { visible, confirmLoading } = this.state;
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
  }

  // -------- 主板 ---------------
  render() {
    return (
      <Fragment>
        <Card>
          {this.renderSearchForm()}

          {this.renderTableList()}

          {this.renderAddModal()}
        </Card>
      </Fragment>
    );
  }
}
