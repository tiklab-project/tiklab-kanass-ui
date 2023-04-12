/*
 * @Descripttion: 报表添加列表弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useState } from "react";
import "./reportList.scss";
import { inject, observer } from "mobx-react";
import projectOperateImg from "../../../assets/images/project-operate.jpg";
import newTrendImg from "../../../assets/images/new-trend.jpg";
import endTrendImg from "../../../assets/images/end-trend.jpg";
import projectUserImg from "../../../assets/images/project-user.jpg";
import projectWorkImg from "../../../assets/images/project-work.jpg";
import workSitustionImg from "../../../assets/images/work-situation.jpg";
import workTrendImg from "../../../assets/images/work-trend.jpg";
import userWorkImg from "../../../assets/images/user-work.jpg";
import { Modal, Tabs } from "antd";


const ReportList = (props) => {
    const { insightStore, showReportList, setShowReportList, reportIndex, setReportIndex } = props;
    const { addReportList } = insightStore;

    /**
     * 添加报告
     * @param {仪表盘信息，高度，宽度} item 
     */
    const addReport = (item) => {
        const isRight = reportIndex % 2 === 0 ? true : false;
        const x = isRight ? 12 : 0;
        const y = Math.floor((reportIndex - 1 ) / 2) * 12;
        const reportList =  {
            x: x, y: y, w: 6, h: 12,
            minH: item.minH,
            minW: item.minW,
            i: reportIndex.toString(), static: false, 
            data: {
                type: item.type,
                isEdit: false,
                data: {
    
                }
            }
        };
        setReportIndex(reportIndex + 1)
        addReportList(reportList)
        setShowReportList(false)
    }

    // 报告列表
    const reportList = [
        {
            title: "项目集",
            code: "projectSet",
            children: [
                {
                    icon: projectUserImg,
                    title: "项目成员",
                    desc: "柱状图形式对比项目成员个数",
                    type: "projectUser",
                    minH: 12,
                    minW: 6
                },
                {
                    icon: projectWorkImg,
                    title: "项目事项",
                    desc: "柱状图对比展示事项个数",
                    type: "projectWork",
                    minH: 12,
                    minW: 6
                },
                {
                    icon: projectOperateImg,
                    title: "项目进展",
                    desc: "以表格形式展示项目进展",
                    type: "projectOperate",
                    minH: 9
                },
            ]
        },
        {
            title: "项目",
            code: "project",
            children: [

                {
                    icon: userWorkImg,
                    title: "成员事项",
                    desc: "显示每个成员的事项个数",
                    type: "userWork",
                    minH: 12,
                    minW: 6
                }
            ]
        },
        {
            title: "事项",
            code: "work",
            children: [
                {
                    icon: newTrendImg,
                    title: "新增事项趋势",
                    desc: "折线图形式展示事项新增趋势",
                    type: "newTrend",
                    minH: 12,
                    minW: 6
                },
                {
                    icon: endTrendImg,
                    title: "完成事项趋势",
                    desc: "折线图形式展示事项完成趋势",
                    type: "endTrend",
                    minH: 12,
                    minW: 6
                },

                {
                    icon: workSitustionImg,
                    title: "事项概览",
                    desc: "显示各个状态的事项个数",
                    type: "workSitustion",
                    minH: 12,
                    minW: 6
                },
                {
                    icon: workTrendImg,
                    title: "事项趋势",
                    desc: "显示每天新增，完成，剩余的事项",
                    type: "workTrend",
                    minH: 12,
                    minW: 6
                }
            ]
        },

    ]

    return (
        <Modal
            title="添加报表"
            visible={showReportList}
            onCancel={() => setShowReportList(false)}
            width={1200}
            footer={null}
            closable = {false}
            style={{
                top: "50px",

            }}
        >

            <Tabs defaultActiveKey="1">
                {
                    reportList && reportList.map(report => {
                        return <Tabs.TabPane tab={report.title} key={report.code}>
                            <div className="report-list">
                                {
                                    report.children.map((item => {
                                        return (

                                            <div className="report-list-item" key={item.type}>
                                                <div className="report-icon">
                                                    <img src={item.icon} alt="" width={280} height={160} />
                                                </div>
                                                <div className="report-content">
                                                    <div>
                                                        <div className="report-content-title">{item.title}</div>
                                                        <div className="report-content-desc">{item.desc}</div>
                                                    </div>
                                                    <div className="report-add" onClick={() => addReport(item)}>
                                                        添加
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }))
                                }
                            </div>
                        </Tabs.TabPane>
                    })
                }
            </Tabs>
        </Modal>
    )
}


export default inject("insightStore")(observer(ReportList));