import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {
	Card,
	Select,
	Input,
	Button
} from 'antd';
import styles from './Questions.less';

const Option = Select.Option;
//班级列表筛选
function SearchContent(props){
	return (
		<div className={styles.topContent}>
			<div>
				<Select
				    showSearch
				    className={styles.screenTop}
				    style={{ width: 150 }}
				    placeholder="类型"
				    optionFilterProp="children"
				    onChange={props.handleChange}
				    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				>
					<Option value="全部问题">全部问题</Option>
					<Option value="提给我的">提给我的</Option>
					<Option value="课程问题">课程问题</Option>
					<Option value="班级问题">班级问题</Option>
					<Option value="我的问题">我的问题</Option>
				</Select>
				<Input placeholder="输入关键字" className={styles.searchInp} style={{ width: 150 }} />
				<Button className={styles.screenTop} type="primary" icon="search" onClick={props.searchFun}>搜索</Button>
			</div>
			<div>
				<Button className={styles.screenTop} type="primary" target="#">统计分析</Button>
				<Button className={styles.screenTop} type="primary" icon="plus" onClick={props.addAnswer}>添加问题</Button>
			</div>
		</div>
		
	)
};


export default class Questions extends PureComponent {
	
	state = {
		loading: true
	}
	//选择类型
	handleChange = value => {
		console.log(value)
	}
	//搜索
	searchFun = () => {
		console.log(3333)
	}
	//添加问题
	addAnswer = () => {
		console.log('add')
	}
	
	componentDidMount() {
		this.setState({
			loading: false,
		});
	}
	
	render (){
		return (
			<PageHeaderLayout
		        title="互动答疑"
		        content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。"
		    >
				<Card bordered={false}>
					<SearchContent handleChange={this.handleChange} searchFun={this.searchFun} addAnswer={this.addAnswer} />
					
					
					
				</Card>
			</PageHeaderLayout>
		)
	}
	
}