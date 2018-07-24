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
} from 'antd';
import styles from './module.less';

const FormItem = Form.Item;
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

@connect(({ global }) => ({ global }))
@Form.create()
export default class ModuleList extends Component {
  state = {
    visible: false,
    confirmLoading: false,
  };

  componentDidMount() {}

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

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
          <Col xl={8} lg={10} md={12} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('no')(<Input placeholder="请输入" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={10} md={12} sm={24}>
            <span className={styles.buttonBox}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }}>重置</Button>
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
        title: '模块名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '模块地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '代码',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '修改时间',
        dataIndex: 'address',
        key: 'address2',
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

    return <Table columns={columns} dataSource={data} pagination={false} />;
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

    return (
      <Modal
        title="新增模块"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
      >
        <Form layout="inline" className={styles.formCol}>
          <FormItem {...formItemLayout} label="上级模块">
            {getFieldDecorator('parentModule')(
              <Input type="text" placeholder="由6-20位英文、数字且字母开头组成" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="代码">
            {getFieldDecorator('code')(<Input type="password" placeholder="请输入6-18位密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="中文名称">
            {getFieldDecorator('chinaName')(
              <Input type="password" placeholder="再次输入密码" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="中文说明">
            {getFieldDecorator('chinaExplain')(
              <Input placeholder="填写用户真实姓名" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="英文名称">
            {getFieldDecorator('company')(<Input placeholder="公司或代理商名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="英文说明">
            {getFieldDecorator('mobile')(<Input placeholder="11位手机号,用于提现安全验证" />)}
          </FormItem>
        </Form>
      </Modal>
    );
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
