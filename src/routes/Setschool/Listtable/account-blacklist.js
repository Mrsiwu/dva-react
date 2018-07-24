import React,{Component} from 'react';
import { connect } from 'dva';

@connect(({ global }) => ({
  global,
}))

export default class Ipblacklsit extends Component{
	render(){
		return(
			<div>账号黑名单</div>
		)
	}
}