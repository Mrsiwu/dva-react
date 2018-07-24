import React,{Component} from 'react';
import { connect } from 'dva';
import {
	Table,
	Form,
	Input,
	Row,
  	Col,
  	Icon,
  	Modal,
  	Button
} from 'antd';
import styles from './tableStyle.less';

const FormItem = Form.Item;

@connect(({ global }) => ({
  global,
}))
@Form.create()

export default class Ipblacklsit extends Component{
	
	state = {
		loading:true,
		listData:[{
		  	key: '1',
		  	time: '2018-07-19 08:05:05',
		  	keyword: "习大大",
		  	replace: '***',
		  	operation:"删除"
		}, {
		  	key: '2',
		 	time: '2018-07-19 08:05:05',
		  	keyword: "习大大",
		  	replace: '***',
		  	operation:"删除"
		}, {
		  	key: '3',
		  	time: '2018-07-19 08:05:05',
		  	keyword: "习大大",
		  	replace: '***',
		  	operation:"删除"
		}, {
		  	key: '4',
		  	time: '2018-07-19 08:05:05',
		  	keyword: "习大大",
		  	replace: '***',
		  	operation:"删除"
		}, {
		  	key: '5',
		  	time: '2018-07-19 08:05:05',
		  	keyword: "习大大",
		  	replace: '***',
		  	operation:"删除"
		}],
		pagination:{                           //分页数据
			showQuickJumper:true,
			hideOnSinglePage:true,
			defaultCurrent:1,
			total:50
		},
		selectData:{},                         //选中内容          
		ModalText:(<div>还有谁</div>),         //弹窗内容
		visible: false,                        //弹窗显示
    	confirmLoading: false,                 //弹窗确认按钮loading
	};
	//弹窗出现
	showModal = () =>{
		this.setState({
	      	visible: true,
	    });
	}
	//添加
	addlist = () =>{
		this.setState({confirmLoading: true})
		setTimeout(() => {
		 	this.setState({
	      		visible: false,
	      		confirmLoading: false
	    	});
		},1000);
	}
	//关闭弹窗
	modalCancel = () =>{
		this.setState({
	      	visible: false
	    });
	}
	//批量删除
	batchdele = () =>{
		let { selectData } = this.state;
		console.log(selectData)
	}
	//点击分页
	pageChange = (pagination, filters, sorter) =>{
		console.log("ss")
	}
	//初始化调用函数
	fetch = () => {
		this.setState({loading:false})
	}
	//搜索部分
	renderSearchForm(prop) {
		const { form } = this.props;
	    const { getFieldDecorator } = form;
	    const { searchObj } = prop;
	    return (
	      <Form layout="inline" style={{ marginBottom: 15 }}>
	        <Row className={styles.rowForm}>
	          <Col xl={8} lg={10} md={12} sm={24}>
	            <FormItem label={searchObj.label}>
	              {getFieldDecorator('no')(<Input placeholder={searchObj.enter} className={styles.inputbox} />)}
	            </FormItem>
	          </Col>
	          <Col xl={8} lg={10} md={12} sm={24}>
	            <span className={styles.buttonBox}>
	              <Button type="primary" htmlType="submit">
	                {searchObj.searchbtn}
	              </Button>
	              <Button style={{ marginLeft: 8 }}>{searchObj.resetbtn}</Button>
	            </span>
	          </Col>
	          <Col sm={24}>
	            <Button
	              type="primary"
	              icon="plus"
	              className={styles.addmodule}
	              onClick={this.showModal}
	            >
	              {searchObj.addbtn}
	            </Button>
	            <Button style={{ marginLeft: 8 }} onClick={this.batchdele}>{searchObj.batchdel}</Button>
	          </Col>
	        </Row>
	      </Form>
	    );
	}
	
	componentDidMount() {
	    this.fetch();
	}
	
	render(){
		const { global } = this.props;
	    const { lang = 'zhCN', home } = global;
	    let texts;
	    switch (lang) {
	    	case 'zhCN':
	        	texts = {
	        		title: ["时间","关键词","替换为","操作"],
	        		searchObj:{label:"关键词",enter:"请输入",searchbtn:"查询",resetbtn:"重置",addbtn:"新增",batchdel:"批量删除"},
	        		ModalTitle:"新增IP黑名单",
	        		cancelBtn:"取消",
	        		subBtn:"确定"
	        	};
	        	break;
	      	case 'enGB':
	        	texts = {
	          		title: ["Time","Key Word","Replace","Operation"],
	          		searchObj:{label:"Key Word",enter:"Please enter",searchbtn:"Search",resetbtn:"Reset",addbtn:"Newly added",batchdel:"Batch deleting"},
	          		ModalTitle:"New IP blacklist",
	          		cancelBtn:"Return",
	        		subBtn:"Submit"
	        	};
	        	break;
	      	default:
	    }
		const columns = [
			{
				title: texts.title[0],
				dataIndex: 'time',
				width:"20%"
			}, 
			{
				title: texts.title[1],
				dataIndex: 'keyword',
				align:'center',
			}, 
			{
				title: texts.title[2],
			 	dataIndex: 'replace',
			 	align:'center',
			 	width:"30%"
			},
			{
				title: texts.title[3],
			 	dataIndex: 'operation',
			 	render: text => <a href="javascript:;">{text}</a>,
			 	width:"10%"
			}
		]
		const { listData ,pagination,visible,ModalText,confirmLoading } = this.state;
		const rowSelection = {
		  	onChange: (selectedRowKeys, selectedRows) => {
		    	console.log(selectedRowKeys);
		    	console.log(selectedRows) 
		    	this.setState({
		    		selectData:selectedRows
		    	})
		  	},
		  	getCheckboxProps: record => ({
		    	disabled: record.name === 'Disabled User',
		    	name: record.name,
		  	}),
		};
		
		return(
			<div>
				{this.renderSearchForm(texts)}
				<Table rowSelection={rowSelection} columns={columns} dataSource={listData} loading={this.state.loading} pagination={pagination} onChange={this.pageChange} />
				<Modal title={texts.ModalTitle}
		          	visible={visible}
		          	onOk={this.addlist}
		          	onCancel={this.modalCancel}
		          	footer={[
		            	<Button key="back" onClick={this.modalCancel}>{texts.cancelBtn}</Button>,
		            	<Button key="submit" type="primary" loading={confirmLoading} onClick={this.addlist}>
		              		{texts.subBtn}
		            	</Button>,
		          	]}
		        >
		          <p>{ModalText}</p>
		        </Modal>
			</div>	
		)
	}
}
