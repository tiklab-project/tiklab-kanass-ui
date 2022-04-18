/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 09:06:56
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:04:58
 */
import React,{useState,useEffect} from 'react';
import "../../../../assets/font-icon/iconfont.css";
import {withRouter} from "react-router-dom";
import { Layout } from "antd";
import "./statistics.scss"
import {pluginConfig, plugins} from "doublekit-plugin-ui"
const {Sider} = Layout;
import { observer, inject } from "mobx-react";

const StatisticsAsicde = (props)=> {
    const {overallStore} = props;
    const {pluginData} = overallStore
    const [selectRouter,setSelectRouter] = useState("/index/prodetail/sprintdetail/SprintStatisticsWork")
    
    // const [router,addRouter] = useState("")
    const staRouter = [
        {
            title: '事项状态统计',
            icon: 'iconsmile',
            key: `/index/prodetail/sprintdetail/SprintStatisticsWork`
        }
    ];
    
    
    //选择左侧菜单
    const selectKey = (key)=>{
        setSelectRouter(key)
        props.history.push(key)
        
    }

    return(
        <div className="statistics-Aside">
            <Sider trigger={null}  width="180">
                <div className="statistics-aside">
                    <ul className="statistics-menu">
                        {
                            staRouter && staRouter.map(Item=> {
                                return  <div className={`statistics-menu-submenu ${Item.key=== selectRouter ? "statistics-menu-select" : ""}`} 
                                            key={Item.key} 
                                            onClick={()=>selectKey(Item.key)}
                                        >
                                                <i className={`iconfont ${Item.icon}`}></i>
                                                <span>
                                                    {Item.title}
                                                </span>
                                                
                                        </div>
                            })
                        }
                    </ul>
                </div>
            </Sider>
        </div>
        )
}
export default withRouter(inject('overallStore')(observer(StatisticsAsicde)));