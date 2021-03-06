import React, { Component, Fragment } from 'react';
import { connect } from "dva";
import classNames from "classnames";
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
const { RangePicker } = DatePicker; //开始结束时间


@connect(({ global, chart, loading, rule}) => ({
  global,
  chart,
  loading: loading.models.rule,
  rule,
}))

@Form.create()
export default class SearchList extends Component {
  state = {
    visibel: false,
    formValues: {}, //搜索表单数据
    chargeTabel: true, //charge为true显示充值Table模块,false显示消费模块
    SmsNumber: 5000, //短信数量
    buttonFocus: 5000 //短信默认数量
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
  
// ------ initialize(自定义初始化) -----------
  //充值弹窗显示
  modalShow = () => {
    const { form } = this.props;

    form.resetFields(['otherNumber','payWay']);

    this.setState({
      SmsNumber: 5000,
      visibel: true,
      buttonFocus: 5000
    });
  }
// ------ module event(自定义方法) -----------
  // 语言切换
  language = () => {
    const { global: {lang} } = this.props;
    
    return Note(lang); 
  }
  // 切换充值记录/消费记录的回调
  selectRecord = (activeKey) => {
    console.log(activeKey);
    this.setState({
      chargeTabel: false
    });
  }
  //查询
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { chargeTabel } = this.state;
    const args = chargeTabel ? ['searchTime','status'] : ['searchTime'];

    form.validateFields(args,(err, fieldsValue) => { //fieldsValue为表单输入的值
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
  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { chargeTabel } = this.state;
    const args = chargeTabel ? ['searchTime','status'] : ['searchTime'];
    form.resetFields(args); //重置一组输入控件的值（为 initialValue）与状态，如不传入参数，则重置所有组件
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }
  //支付方式数据处理
  payment = (val) => {
    const status = ['线上充值-支付宝','线上充值-微信','线下充值-其他','系统赠送-其他'];
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
  //充值短信条数选择处理
  chargeNumberChange = num => {
    const { form } = this.props;
    form.resetFields('otherNumber');
    this.setState({
      SmsNumber: num,
      buttonFocus: num,
    });
  }
  //取消短信充值
  _onCancel = () => {
    console.log('cancel');
    
    this.setState({
      visibel: false
    });
  }
  //短信充值付款处理
  _onOk = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { SmsNumber } = this.state;

    form.validateFields(['otherNumber','payWay'],(err, fieldsValue) => {
      if(err) return;
      const values = {
        payWay: fieldsValue.payWay,
        SmsNumber: fieldsValue.otherNumber ? fieldsValue.otherNumber : SmsNumber
      }

      console.log(values);
      
      this.setState({
        visibel: false
      });
    })
  }
  //分页页数变化，请求数据
  handleStandardTableChange = (current, pageSize) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      currentPage: current,
      pageSize: pageSize,
      ...formValues,
    };
    console.log('page');
    
    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };
  //当编辑其他短信数量,取消按钮选择项焦点样式
  chargeOther = (e) => {
    console.log(e.target.value);
    const val = e.target.value;
    if(val){
      this.setState({
        buttonFocus: 0
      });
    }
  }

// ------ component module Dom （小模块模板） -------
  // 充值短信数量选择模块
  selectCharge = () => {
    let { buttonFocus } = this.state;
    
    console.log(buttonFocus);
    
    let xc1 = classNames ({
      [styles.btnBac]:true,
      [styles.focus]: buttonFocus === 5000 ? true : false
    });
    let xc2 = classNames({
      [styles.btnBac]:true,
      [styles.focus]: buttonFocus === 10000 ? true : false
    });
    let xc3 = classNames({
      [styles.btnBac]:true,
      [styles.focus]: buttonFocus === 100000 ? true : false
    });
    return (
      <Row>
        <Col sm={8} md={8} lg={8} xl={8}><Button onClick={() => this.chargeNumberChange(5000)} style={{padding:'0px 22.5px'}} className={xc1}>5000条</Button></Col>
        <Col sm={8} md={8} lg={8} xl={8}><Button onClick={() => this.chargeNumberChange(10000)} style={{padding:'0px 18.5px'}} className={xc2}>10000条</Button></Col>
        <Col sm={8} md={8} lg={8} xl={8}><Button onClick={() => this.chargeNumberChange(100000)} className={xc3}>100000条</Button></Col>
      </Row>
    );
  }
  
  //充值搜索模块
  chargeForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
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
  }
  //消费搜索模块
  consumptionForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
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
  }
  //表单模块
  standardList = () => {
    const { rule: {data} } = this.props;
    const { chargeTabel } = this.state;
    const column = {
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
          render: (val) => (<span>{this.payment(val.status)}</span>),
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
      columns: column.chargeList,
      ...data,
      width: [200,76,76,76,76]
    }
    
    const consumptionMessage = {
      columns: column.consumptionList,
      ...data,
      width: [320,120,76,76,76]
    }
    const { width, list, columns, pagination:{ total = 0, current = 0, pageSize = 0 }} = chargeTabel ? chargeMessage : consumptionMessage;
    
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
          className={styles.page}
          onChange = {
            this.handleStandardTableChange
          }
          // onShowSizeChange= {
          //   this.handleStandardTableChange
          // }
        />
      </div>
    )
  }

// ------ render module Dom （大模块模板） -------
  // 充值模块
  chargeModalForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { visibel, SmsNumber } = this.state;
    let texts = this.language();
    return (
      <Modal 
        title={texts.chargeTitle}
        onCancel={this._onCancel}
        onOk={this._onOk}
        visible={visibel}
      >
        <Form layout="inline" className={styles.ModalForm}>
          <Row gutter={24} style={{marginTop: '30px'}}>
            <Col xs={6} sm={6} md={6} lg={6} xl={6} style={{textAlign: 'right'}}>
              充值数量：
            </Col>
            <Col xs={18} sm={18} md={18} lg={18} xl={18}>
              {this.selectCharge()}
              <Row className={styles.otherNumber}>
                <Col sm={14} md={14} lg={14} xl={14}>
                  <FormItem>
                    { getFieldDecorator('otherNumber',{
                      rules:[
                        {
                          min: 1,
                          required: false
                        }
                      ]
                    })(<Input onChange={this.chargeOther} placeholder="输入其他数量"/>)}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className={styles.line}></div>
          <Row gutter={24} className={styles.money}>
            <Col xs={6} sm={6} md={6} lg={6} xl={6} style={{textAlign: 'right'}} >
              金额：
            </Col>
            <Col xs={18} sm={18} md={18} lg={18} xl={18}>
              <b>{SmsNumber}.00</b> 元
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={6} sm={6} md={6} lg={6} xl={6} style={{textAlign: 'right'}} >
              支付方式：
            </Col>
            <Col xs={18} sm={18} md={18} lg={18} xl={18}>
              <FormItem>
                { getFieldDecorator('payWay',{
                  initialValue: '1'
                })(
                  <Radio.Group className={styles.payWay}>
                    <Row gutter={97}>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Radio value="1" style={{marginTop: '40px'}}>
                          <span className={styles.zfbPay}>支付宝支付</span>
                        </Radio>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Radio value="2" style={{marginTop: '40px'}}>
                          <span className={styles.wxPay}>微信支付</span>
                        </Radio>
                      </Col>
                    </Row>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
  // 图标模块
  chars = () => {
    const { chart } = this.props;
    const { salesData } = chart;
    let texts = this.language();
    return (
      <Row gutter={16}>
      {/* 饼状图（剩余短信） */}
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Card
            title={texts.remain}
            bodyStyle={{ textAlign: 'center', fontSize: 0 }}
            bordered={false}
            extra={<a href="javascript:;"><Button onClick={this.modalShow} type="primary">{texts.charge}</Button></a>}
          >
            <WaterWave height={161} title={texts.messageResidue} remain={26455} percent={56} />
          </Card>
        </Col>
        {/* 柱状图（30天消费） */}
        <Col xs={24} sm={24} md={18} lg={18} xl={18}>
          <div className={styles.salesBar}>
            <Bar height={222} title={texts.recentConsumption} data={salesData} className={styles.consumeBar}/>
          </div>
        </Col>
      </Row>
    );
  }
  // 充值/消费记录模块
  searchTableList = () => {
    return (
      <Row className={styles.noteTabs}>
        <Col xs={24} sm={24}>
          <Tabs type="card" className={styles.backgroundTabs} onChange={this.selectRecord}>
            <TabPane tab="充值记录" key="1">
              { this.chargeForm() }
              {this.standardList()}
            </TabPane>
            <TabPane tab="消费记录" key="2">
              { this.consumptionForm() }
              {this.standardList()}
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    );
  }

// ------ main Dom -------
  render() {
    const { global } = this.props;
    //设置面包屑导航
    const { home } = global;
    const texts = this.language();
    return (
        <PageHeaderLayout title={texts.title} content={texts.connect} home={home}>
          <div className={styles.note}>
            { this.chargeModalForm() }
            { this.chars() }
            { this.searchTableList() }
          </div>
        </PageHeaderLayout>
    );
  }
}