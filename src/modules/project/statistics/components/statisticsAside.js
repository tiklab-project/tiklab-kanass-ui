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
import { DownOutlined, UpOutlined, DashOutlined } from '@ant-design/icons';
import { Plugin, PLUGIN_STORE, PluginFun } from "doublekit-plugin-ui"
const { Sider } = Layout;
import { observer, inject } from "mobx-react";
import ReportAddOrEdit from './reportAddOrEdit';

const StatisticsAsicde = (props) => {
    const { overallStore, pluginsStore, staisticStore } = props;
    const { pluginData } = overallStore;
    const { findReportList, setReportId, reportId,reportList, setReportList,deleteReport } = staisticStore;
    const [selectRouter, setSelectRouter] = useState("");
    const [reportType,setReportType] = useState("")
    const [visible,setVisible] = useState(false)
    const { pluginConfig } = pluginsStore;

    // 树的展开与闭合
    const [expandedTree, setExpandedTree] = useState([])

    let staRouter = [
        {
            title: '事项统计',
            icon: 'iconsmile',
            type: 'statisticWork',
            key: `/index/prodetail/statistics/work`,
            children: []
        }
    ];
    const [router, addRouter] = useState(staRouter);
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

    /**
     * 获取插件
     */
    const getPluginRouter = () => {
        let data = pluginConfig("user-statistics").filter(item => item.routers);
        let newRouter;
        if (data.length > 0) {
            data.map(item => {
                return newRouter = item.routers.map(routeritem => {
                    return {
                        title: routeritem.menuTitle,
                        icon: 'iconcompass',
                        key: '/' + routeritem.mount + routeritem.router
                    };
                })

            })
            reportList.concat(newRouter)
            // setReportList(reportList.concat(newRouter))
        }
    }
    useEffect(() => {
        setSelectRouter(props.location.pathname)
        findReportList({ projectId: projectId })
        // .then(data => {
        //     // console.log(reportList)
        //     // setReportList(["1","2","3"])

        //     getPluginRouter()
        // })

        return
    }, [])


    //选择左侧菜单
    const selectKey = (id, type) => {
        switch (type) {
            case "statisticWork":
                setReportId(id)
                setSelectRouter(id)
                props.history.push(`/index/prodetail/statistics/work/${id}`);
                break;
            case "statisticBulidWork":
                setReportId(id)
                setSelectRouter(id)
                props.history.push(`/index/prodetail/statistics/workbulidend/${id}`);
                break;
            default:
                break;

        }
    }
    const content = (id,type) =>(
        <div className='statistics-aside-popover '>
            <div onClick={()=> editReport(id,type)}>编辑</div>
            <div onClick={(e)=>deleteReportById(e,id,type) }>删除</div>
        </div>
    );
    
    const deleteReportById = (e,id,type) => {
        e.stopPropagation();
        deleteReport({id: id}).then(data=> {
            if(data.code === 0){
                findReportList({ projectId: projectId })
                switch (type) {
                    case "statisticWork":
                        setSelectRouter("statisticWork")
                        props.history.push(`/index/prodetail/statistics/work/statisticWork`);
                        break;
                    case "statisticBulidWork":
                        setSelectRouter("statisticBulidWork")
                        props.history.push(`/index/prodetail/statistics/workbulidend/statisticBulidWork`);
                        break;
                    default:
                        break;
        
                }
            }
        })
    }

    const editReport = (id,type) => {
        setReportType(type)
        setReportId(id)
        setVisible(true)
    }

    return (
        <Sider trigger={null} width="180">
            <div className="statistics-aside">
                <div className="statistics-menu">
                    {
                        reportList && reportList.map(item => {
                            return <div>
                                <div className={`statistics-menu-firstmenu ${item.type === selectRouter ? "statistics-menu-select" : ""}`}
                                    key={item.key}

                                    onClick={() => selectKey(item.type,item.type)}
                                >
                                    <div className="statistics-menu-icon">
                                        {
                                            item.children && item.children.length>0?
                                                (isExpandedTree(item.type) ?
                                                    <DownOutlined style={{ fontSize: "14px" }} onClick={() => setOpenOrClose(item.type)} /> :
                                                    <UpOutlined style={{ fontSize: "14px" }} onClick={() => setOpenOrClose(item.type)} />
                                                ) : ""
                                        }
                                    </div>
                                    <span>
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
                                                <Popover placement="rightTop" content={()=>content(report.id,report.reportType)} className ="statistics-menu-popover">
                                                    <DashOutlined />
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
            <ReportAddOrEdit
                id={reportId}
                visible={visible}
                setVisible={setVisible}
                reportType={reportType}
                type = 'edit'
            />
        </Sider>
    )
}
export default withRouter(inject('overallStore', 'staisticStore', PLUGIN_STORE)(observer(StatisticsAsicde)));