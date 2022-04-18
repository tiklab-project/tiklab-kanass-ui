/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-02 14:41:19
 */
import React,{Fragment} from 'react';
import { Menu } from 'antd';
import {Link,withRouter} from "react-router-dom";
class SprintAside extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            id: this.props.match.params.id,
            selectedKeys: [`/index/sprintdetail/sprintsurvey`]
        }
    }
    componentDidMount(){
        console.log(this.props)
        this.setState({
            selectedKeys: [this.props.location.pathname]
        })
    }
    onSelect=(value)=>{
        console.log(value)
        this.setState({
            selectedKeys: [value.key]
        })
    }
    render(){
        return (
            <Fragment>
                <div className="pro-title">{this.props.name}</div>
                <Menu 
                    mode="inline" 
                    selectedKeys={this.state.selectedKeys}
                    onClick={this.onSelect}
                    className="sprint-aside"
                    >
                        <Menu.Item key={`/index/sprintdetail/sprintsurvey`} ><Link to={`/index/sprintdetail/sprintsurvey`}>概况</Link></Menu.Item>
                        <Menu.Item key={`/index/sprintdetail/sprintapanel`} ><Link to={`/index/sprintdetail/sprintapanel`}>仪表盘</Link></Menu.Item>
                        <Menu.Item key={`/index/sprintdetai/sprintwork`} ><Link to={`/index/sprintdetail/sprintwork`}>事项</Link></Menu.Item>
                        <Menu.Item key={`/index/sprintdetai/sprintPlan`} ><Link to={`/index/sprintdetail/sprintPlan`}>规划</Link></Menu.Item>
                        <Menu.Item key={`/index/sprintdetail/sprintstatistics`}><Link to={`/index/sprintdetail/sprintstatistics`}>统计</Link></Menu.Item>
                </Menu>
            </Fragment>
        )
    }
}
export default withRouter(SprintAside);