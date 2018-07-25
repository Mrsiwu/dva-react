import React, { Component, Fragment } from 'react';
import { connect } from "dva";
import moment from 'moment';
import { 
  Row,
  Col,
  Card,
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Pagination,
  Avatar,
  Radio,
 } from "antd";
 import { 
   WaterWave,
   Bar,
 } from 'components/Charts';

import TableVirtualized from '../../../../components/TableVirtualized';
import styles from "./NoteSetting.less";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import { Note } from "./zhCN-enGB";

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const { RadioGroup } = Radio;
const { RangePicker } = DatePicker; //开始结束时间
const status = ['线上充值-支付宝','线上充值-微信','线下充值-其他','系统赠送-其他'];

@connect(({ global, chart, loading, rule}) => ({
  global,
  chart,
  loading: loading.models.rule,
  rule,
}))

@Form.create()
export default class SearchList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visibel: false,
      formValues: {},
      isMobile:false,
    }
    this.Standard = this.Standard.bind(this);
    this.handleStandardTableChange = this.handleStandardTableChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/fetch',
    });
    dispatch({
      type: 'rule/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }
  //充值弹窗
  ModalShow () {
    this.setState({
      visibel: true
    });
  }

  OnCancel () {
    console.log('cancel');
    
    this.setState({
      visibel: false
    });
  }
  OnOk () {
    console.log('ok');
    
    this.setState({
      visibel: false
    });
  }
  handleSearchCharge = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err,fieldsValue) => {
      if (err) return;
      //...
    });
  }

  //查询跟重置
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => { //fieldsValue为表单输入的值
      if (err) return;
      
      const values = {
        ...fieldsValue
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields(); //重置一组输入控件的值（为 initialValue）与状态，如不传入参数，则重置所有组件
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }

  //表单
  Standard ({ width, list, columns, pagination:{ total = 0, current = 0, pageSize = 0 }}) {
    return (
      <div >
        <TableVirtualized columns={columns} dataSource={list} rowHeight={width} />
        <Pagination 
          showSizeChanger
          showQuickJumper
          current={current}
          pageSize={pageSize}
          hideOnSinglePage={true}
          total={total}
          onChange = {
            this.handleStandardTableChange
          }
          onShowSizeChange= {
            this.handleStandardTableChange
          }
        />
      </div>
    )
  }
  //表单（分页）
  handleStandardTableChange = (current, pageSize) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      currentPage: current,
      pageSize: pageSize,
      ...formValues,
    };
    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };
  //表单(支付方式)
  Payment (val) {
    let resultVal;
    switch (val) {
      case 0: resultVal = status[0]; break;
      case 1: resultVal = status[1]; break;
      case 2: resultVal = status[2]; break;
      case 3: resultVal = status[3]; break;
      default: break;
    }
    return resultVal;
  }
  
  render() {
    const { global, chart, form, loading, rule: {data} } = this.props;
    //柱状图数据
    const { salesData } = chart;
    //设置面包屑导航
    const { lang, home } = global;
    //语言切换
    const texts = Note(lang);
    //列表(Pc端列表样式)
    const columns = {
      chargeList: [
        {
          title: '时间',
          render: (val) => (<span>{moment(val.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>),
          key: '1',
          width: { xl: 6, lg: 6, md: 6, sm: 6, xs: 16}
        },
        {
          title: '充值条数',
          dataIndex: 'callNo',
          key: '2',
          width: { xl: 4, lg: 4, md: 4, sm: 4, xs: 8}
        },
        {
          title: '支付方式',
          render: (val) => (<span>{this.Payment(val.status)}</span>),
          key: '3',
          width: { xl: 6, lg: 6, md: 6, sm: 6 , xs: 16}
        },
        {
          title: '金额',
          dataIndex: 'callNo',
          key: '4',
          width: { xl: 5, lg: 5, md: 5, sm: 5 , xs: 8}
        },
        {
          title: '结余 (条)',
          dataIndex: 'callNo',
          key: '5',
          width: { xl: 3, lg: 3, md: 3, sm: 3 , xs: 24}
        },
      ],
      consumptionList: [
        {
          title: '时间',
          render: (val) => (<span>{moment(val.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>),
          key: '1',
          width: { xl: 4, lg: 4, md: 4, sm: 8, xs: 8}
        },
        {
          title: '账号',
          render: (record) => (
            <span>
              <Avatar src={record.avatar} size="large" style={{float:'left',marginRight:'8px'}}/>
              <span style={{float:'left'}}>{record.owner}</span><img src={require('../../../../../public/man.png')}/><br/>
              <span style={{float:'left'}}>{record.description}</span>
            </span>
          ),
          key: '2',
          width: { xl: 7, lg: 7, md: 7, sm: 8, xs: 16}
        },
        {
          title: '消费条数',
          render: (val) => (<span style={{lineHeight:'42px'}}>{val.callNo}</span>),
          key: '3',
          width: { xl: 2, lg: 2, md: 2, sm: 8, xs: 8}
        },
        {
          title: '功能模块',
          render: (val) => (<span style={{lineHeight:'18px',display: 'inline-block',marginTop: '10px'}}>{val.description}</span>),
          key: '4',
          width: { xl: 3, lg: 3, md: 3, sm: 8, xs: 16 }
        },
        {
          title: '描述',
          render: (val) => (<span style={{lineHeight:'18px',display: 'inline-block',marginTop: '10px'}}>{val.description}</span>),
          key: '5',
          width: { xl: 6, lg: 6, md: 6, sm: 8, xs: 24 }
        },
        {
          title: '剩余条数',
          render: (val) => (<span style={{lineHeight:'42px'}}>{val.callNo}</span>),
          key: '6',
          width: { xl: 2, lg: 2, md: 2, sm: 8, xs: 24 }
        },
      ]
    };
    const chargeMessage = {
      loading: loading,
      columns: columns.chargeList,
      ...data,
      width: [200,76,76,76,76]
    }
    
    const consumptionMessage = {
      loading: loading,
      columns: columns.consumptionList,
      ...data,
      width: [320,120,76,76,76]
    }
    //充值搜索
    const { getFieldDecorator } = form;
    const ChargeForm = (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col md={24} sm={24} lg={7} xl={7}>
            <FormItem label="选择时间">
              {getFieldDecorator('searchTime')(<RangePicker />)}
            </FormItem>
          </Col>
          <Col md={24} sm={24} lg={7} xl={7}>
            <FormItem label="支付方式">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">支付宝</Option>
                  <Option value="1">微信</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={24} sm={24} lg={7} xl={7}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
    //消费搜索
    const ConsumptionForm = (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col md={24} sm={24} lg={7} xl={7}>
            <FormItem label="选择时间">
            {getFieldDecorator('searchTime')(<RangePicker />)}
            </FormItem>
          </Col>
          <Col md={24} sm={24} lg={7} xl={7}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
    //充值弹窗表单
    const chargeForm = (
      <Form onSubmit={this.handleSearchCharge} layout="inline">
        <Row gutter={24} style={{borderBottom: '1px solid rgba(0,0,0,0.2)'}}>
          <Col sm={8} md={8} lg={8} xl={8} style={{textAlign: 'right'}}>
            充值数量：
          </Col>
          <Col sm={16} md={16} lg={16} xl={16}>
            <Row>
              <Col sm={8} md={8} lg={8} xl={8}><Button>5000条</Button></Col>
              <Col sm={8} md={8} lg={8} xl={8}><Button>10000条</Button></Col>
              <Col sm={8} md={8} lg={8} xl={8}><Button>100000条</Button></Col>
            </Row>
            <Row>
              <Col sm={12} md={12} lg={12} xl={12}>
                <FormItem>
                  { getFieldDecorator('otherNumber')(<Input placeholder="输入其他数量"/>)}
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{padidng: '30px'}}>
          <Col>
            金额： <b>500.00</b> 元
          </Col>
        </Row>
        <Row>
          <Col>
            {/* <FormItem label="支付方式：">
              { getFieldDecorator('payWay')(
                <RadioGroup>
                  <Radio value="a">item 1</Radio>
                  <Radio value="b">item 2</Radio>
                </RadioGroup>
              )}
            </FormItem> */}
          </Col>
        </Row>

      </Form>
    )
    return (
        <PageHeaderLayout title={texts.title} content={texts.connect} home={home}>
          <div className={styles.note}>
            <Row gutter={16}>
            {/* 剩余短信 */}
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Card
                  title={texts.remain}
                  bodyStyle={{ textAlign: 'center', fontSize: 0 }}
                  bordered={false}
                  extra={<a href="javascript:;"><Button onClick={this.ModalShow.bind(this)} type="primary">{texts.charge}</Button></a>}
                >
                  {/* 充值弹窗 */}
                  <Modal 
                    title={texts.chargeTitle}
                    onCancel={this.OnCancel.bind(this)}
                    onOk={this.OnOk.bind(this)}
                    visible={this.state.visibel}
                  >
                    {chargeForm}
                  </Modal>
                  <WaterWave height={161} title={texts.messageResidue} remain={26455} percent={56} />
                </Card>
              </Col>
              {/* 柱状图 */}
              <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                <div className={styles.salesBar}>
                  <Bar height={222} title={texts.recentConsumption} data={salesData} className={styles.consumeBar}/>
                </div>
              </Col>
            </Row>
            <Row className={styles.noteTabs}>
              <Col xs={24} sm={24}>
                <Tabs type="card" className={styles.backgroundTabs}>
                  <TabPane tab="充值记录" key="1">
                    { ChargeForm }
                    {this.Standard(chargeMessage)}
                  </TabPane>
                  <TabPane tab="消费记录" key="2">
                    { ConsumptionForm }
                    {this.Standard(consumptionMessage)}
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </div>
        </PageHeaderLayout>
    );
  }
}