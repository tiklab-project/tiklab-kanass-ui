/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-20 09:06:56
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-28 13:12:38
 */
import React, { useState, useEffect } from 'react';
import "../../../../assets/font-icon/iconfont.css";
import { withRouter } from "react-router-dom";
import { Layout, Popover } from "antd";
import "./statistics.scss";
import { DownOutline, RightOutline, MoreOutline} from 'antd-mobile-icons';
const { Sider } = Layout;
import { observer, inject } from "mobx-react";
const StatisticsList = (props) => {
    const {  staisticStore } = props;
    const { findReportList, setReportId, reportId,reportList, setReportList,deleteReport } = staisticStore;
    const [selectRouter, setSelectRouter] = useState("");
    const [reportType,setReportType] = useState("")
    const [visible,setVisible] = useState(false)
    const path = props.match.path.split("/")[2];
    // 树的展开与闭合
    const [expandedTree, setExpandedTree] = useState([])

    const projectId = localStorage.getItem("projectId");

    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    useEffect(() => {
        setSelectRouter(props.location.pathname)
        findReportList({ projectId: projectId })

        return
    }, [])


    //选择左侧菜单
    const selectKey = (id, type) => {
        let url = `/statistics/${type}/${id}`;
        setReportId(id)
        setSelectRouter(id)
        props.history.push(url);
    }
    const content = (id,type,typeId) =>(
        <div className='statistics-list-popover '>
            <div onClick={()=> editReport(id,type)}>编辑</div>
            <div onClick={(e)=>deleteReportById(e,id,type,typeId) }>删除</div>
        </div>
    );
    
    const deleteReportById = (e,id,type,typeId) => {
        e.stopPropagation();
        deleteReport({id: id}).then(data=> {
            if(data.code === 0){
                findReportList({ projectId: projectId })
                props.history.push(`/index/${path}/${projectId}/statistics/${type}/${typeId}`);
            }
        })
    }

    const editReport = (id,type) => {
        setReportType(type)
        setReportId(id)
        setVisible(true)
    }

    return (
        <div className="statistics-list">
            <div className="statistics-menu">
                {
                    reportList && reportList.map(item => {
                        return <div key={item.key}>
                            <div className={`statistics-menu-firstmenu ${item.id === selectRouter ? "statistics-menu-select" : ""}`}>
                                <div className="statistics-menu-icon">
                                    {
                                        item.children && item.children.length>0?
                                            (isExpandedTree(item.type) ?
                                                <DownOutline style={{ fontSize: "10px" }} onClick={() => setOpenOrClose(item.type)} /> :
                                                <RightOutline style={{ fontSize: "10px" }} onClick={() => setOpenOrClose(item.type)} />
                                            ) : ""
                                    }
                                </div>
                                <span onClick={() => selectKey(item.id,item.type)}>
                                    {item.title}
                                </span>
                            </div>
                            {
                                isExpandedTree(item.type) && item.children.length > 0 && item.children.map(report => {
                                    if (report.reportType === item.type) {
                                        return <div
                                            className={`statistics-menu-submenu ${report.id === selectRouter ? "statistics-menu-select" : ""}`}
                                            key={report.id}
                                            onClick={() => selectKey(report.id, report.reportType)}
                                        >
                                            <span>
                                                {report.title}
                                            </span>
                                            <Popover placement="rightTop" content={()=>content(report.id,report.reportType,item.id)} className ="statistics-menu-popover">
                                                <MoreOutline /> 
                                            </Popover>

                                        </div>
                                    } else {
                                        return;
                                    }
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(inject('staisticStore')(observer(StatisticsList)));