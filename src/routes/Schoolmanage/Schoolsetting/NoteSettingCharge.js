import React, { Component, Fragment } from 'react';
import { connect } from "dva";
import { 
  Row,
  Col,
  Card,
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  Select
 } from "antd";
 import { 
   WaterWave,
   Bar,
 } from 'components/Charts';
 import StandardTable from 'components/StandardTable';

import styles from "./NoteSetting.less";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { Note } from "./zhCN-enGB";
const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({ global, list, chart}) => ({
  global,
  list,
  chart
}))

@Form.create()
export default class SearchList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visibel: false
    }
  }
  //柱状图redux状态
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

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

  //表单
  Standard ({ selectedRows, loading, data, columns }) {
    return (
      <StandardTable
        selectedRows={selectedRows}
        loading={loading}
        data={data}
        columns={columns}
        onSelectRow={this.handleSelectRows}
        onChange={this.handleStandardTableChange}
      />
    )
  }
  
  render() {
    const { global, chart, form } = this.props;
    //柱状图数据
    const { salesData } = chart;
    //设置面包屑导航
    const { lang, home } = global;
    //语言切换
    const texts = Note(lang);
    //查询跟重置
    const Reset = (tabsName) => {
      return (
                <div style={{ overflow: 'hidden' }}>
                  <span style={{ float: 'right', marginBottom: 24 }}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => this.handleFormReset(tabsName)}>
                      重置
                    </Button>
                  </span>
                </div>
              );
    }
    //充值表单
    const { getFieldDecorator } = form;
    const ChargeForm = (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={6} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
    //消费
    const ConsumptionForm = (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
    return (
        <PageHeaderLayout title={texts.title} content={texts.connect} home={home}>
          <div className={styles.note}>
            <Row gutter={16}>
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
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                  </Modal>
                  <WaterWave height={161} title={texts.messageResidue} remain={26455} percent={56} />
                </Card>
              </Col>
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
                    {() => this.Standard(chargeMessage).bind(this)}
                  </TabPane>
                  <TabPane tab="消费记录" key="2">
                    { ConsumptionForm }
                    {() => this.Standard(consumptionMessage).bind(this)}
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </div>
        </PageHeaderLayout>
    );
  }
}