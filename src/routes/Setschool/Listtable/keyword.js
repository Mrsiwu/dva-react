import React,{Component} from 'react';
import { connect } from 'dva';

@connect(({ global }) => ({
  global,
}))

export default class Ipblacklsit extends Component{
	render(){
		return(
			<div>关键词过滤</div>
		)
	}
}