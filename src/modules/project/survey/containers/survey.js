/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 18:00:13
 */
import React, { useEffect, useState } from "react";
import "../components/survey.scss"
import { observer, inject } from "mobx-react";
import { getUser } from 'doublekit-core-ui';
import { Layout, Row, Col } from "antd";
import * as echarts from 'echarts';
import moment from 'moment';


const Survey = (props) => {
    // 基于准备好的dom，初始化echarts实例
    const { projectSurveyStore, homeStore, workStore } = props;
    const { statProjectWorkItemByBusStatus, statProjectManageSprint, findProject,
        findDynamicPage, findProjectBurnDowmChartPage } = projectSurveyStore;
    const { findWorkStatusListBySorts } = homeStore;
    const { setSearchCondition, setSearchConditionNull } = workStore;

    const masterId = getUser().userId;
    const projectId = localStorage.getItem("projectId")
    const [workStatusList, setWorkStatusList] = useState();
    const [sprintList, setSprintList] = useState();
    const [project, setProject] = useState();
    const [dynamicList, setDynamicList] = useState();

    useEffect(() => {
        const data = {
            masterId: masterId,
            projectId: projectId
        }
        statProjectWorkItemByBusStatus(projectId).then(res => {
            setWorkStatusList(res.data)
        })
        statProjectManageSprint(data).then((res) => {
            setSprintList(res.data)
        })
        findProject(projectId).then(res => {
            setProject(res.data)
        })
        findDynamicPage(projectId).then(res => {
            setDynamicList(res.data.dataList)
        })

    }, [])

    useEffect(() => {
        if (project) {
            findProjectBurnDowmChartPage(projectId).then(res => {
                if (res.code === 0) {
                    let timerXaixs = [];
                    let workCountYaixs = [];
                    let Yaxis = [];
                    if (res.data.dataList.length > 0) {
                        res.data.dataList.map((item, index) => {
                            timerXaixs.push(item.recordTime);
                            workCountYaixs.push(item.remainWorkItemCount);
                            Yaxis.push(item.totalWorkItemCount * (7 - index) / 7);
                            return;
                        })
                    } else {
                        timerXaixs.push(moment().format("YYYY-MM-DD"));
                        Yaxis.push(project.worklItemNumber);
                        workCountYaixs.push(project.worklItemNumber);
                        let i = 1;
                        for (i = 1; i <= 6; i++) {
                            timerXaixs.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
                            workCountYaixs.push(project.worklItemNumber);
                            Yaxis.push(project.worklItemNumber * (7 - i) / 7);
                        }
                    }
                    burnDownChart(timerXaixs, workCountYaixs, Yaxis)
                }
            })
        }

    }, [project])
    const statusSet = (value) => {
        let data = ""
        switch (value) {
            case "1":
                data = "未开始";
                break;
            case "2":
                data = "已启动";
                break;
            case "3":
                data = "已结束";
                break;
            default:
                data = "未知";
                break;

        }
        return data;
    }
    const modelName = (value) => {
        let data = ""
        switch (value) {
            case "workItem":
                data = "事项";
                break;
            case "sprint":
                data = "迭代";
                break;
            case "project":
                data = "项目";
                break;
            default:
                break;

        }
        return data;
    }


    const typeName = (value) => {
        let data = ""
        switch (value) {
            case "add":
                data = "添加";
                break;
            case "update":
                data = "更新";
                break;
            case "delete":
                data = "删除";
                break;
            default:
                break;

        }
        return data;
    }
    /**
     * 燃尽图
     */
    const burnDownChart = (timerXaixs, workCountYaixs, Yaxis) => {
        const burnDown = echarts.init(document.getElementById('burn-down'));
        let option;
        option = {
            // title: {
            //     text: '燃尽图'
            // },
            color: ['#5470c6', '#91cc75'],
            xAxis: {
                type: 'category',
                data: timerXaixs
            },
            yAxis: {
                type: 'value'
            },
            legend: {
                data: ['real', 'ideal']
            },
            series: [
                {
                    data: workCountYaixs,
                    name: 'real',
                    // stack: 'Total',
                    type: 'line'
                },
                {
                    name: 'ideal',
                    type: 'line',
                    // stack: 'Total',
                    data: Yaxis
                },
            ]
        };
        burnDown.setOption(option)
    }

    const goWorkItemList = (index) => {
        switch (index) {
            case 0:
                fileterAllWork()
                break;
            case 1:
                filterWorkByType([3])
                break;
            case 2:
                filterWorkByType([2])
            default:
                break;
        }

    }

    const fileterAllWork = () => {
        setSearchConditionNull().then(() => {
            props.history.push({ pathname: "/index/prodetail/work" })
        })
    }

    const filterWorkByType = (value) => {
        findWorkStatusListBySorts({ sorts: value }).then((data) => {
            let list = []
            data.data.map(item => {
                list.push(item.id)
                return list;
            })
            setSearchConditionNull()
            setSearchCondition({ workStatusIds: list, assignerIds: [getUser().userId] },)
            props.history.push({ pathname: "/index/prodetail/work" })
        })
    }

    return (
        <div className="project-survey">
            <div className="survey-top">
                <div className="survey-top-left">
                    <div className="title">{project && project.projectName}</div>
                    <div className="box-top">
                        <div className="project-status">
                            <div className="text status-text">项目状态： {project && statusSet(project.projectState)}</div>
                            <div className="text status-process">项目进度： {project && project.quantityNumber}</div>
                        </div>
                        <div className="project-assign">
                            <div className="text assign-name">负责人：{project && project.master.name}</div>
                            <div className="text assign-title">成员数量：{project && project.member}</div>
                        </div>
                    </div>

                    <div className="box-bottom">
                        <div className="project-time">
                            <div className="text start-text">开始时间：</div>
                            <div className="text start-time">{project && project.startTime}</div>
                        </div>
                        <div className="project-assign">
                            <div className="text end-text">结束时间：</div>
                            <div className="text end-time"> {project && project.endTime}</div>
                        </div>
                    </div>
                </div>
                <div className="survey-top-right">
                    <div className="title">我的事项</div>
                    <div className="survey-work">
                        {
                            workStatusList && workStatusList.map((item, index) => {
                                return <div className="work-item" key={index} onClick={() => goWorkItemList(index)}>
                                    <svg className="work-icon" aria-hidden="true">
                                        <use xlinkHref="#icondingqigongzuo"></use>
                                    </svg>
                                    <div className="work-count">
                                        <div className="work-num">{item.groupCount}</div>
                                        <div className="work-text">{item.statusName}</div>
                                    </div>
                                </div>
                            })
                        }

                    </div>
                </div>
            </div>
            <div className="survey-middle">
                <div className="title">项目燃尽图</div>
                <div className="burn-down" id="burn-down" style={{ width: "100%", height: "500px" }}>

                </div>
            </div>
            <div className="survey-bottom">
                {
                    localStorage.getItem("projectTypeId") === "0" &&
                    <div className="survey-bottom-left">
                        <div className="title">我的迭代</div>
                        <div className="sprint">
                            {
                                sprintList && sprintList.map((item, index) => {
                                    return <div className="sprint-item" key={index}>
                                        <div className="sprint-item-left">
                                            <svg className="sprint-icon" aria-hidden="true">
                                                <use xlinkHref="#iconzuoyepiaotiaoyue"></use>
                                            </svg>
                                            <div className="sprint-name">
                                                <div>{item.sprintName}</div>
                                                <div className="sprint-date">{item.startTime} ~ {item.endTime}</div>
                                            </div>
                                        </div>

                                        <div className="sprint-project">
                                            项目1
                                        </div>
                                        <div className="sprint-process">
                                            50%
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                }

                <div className="survey-bottom-right">
                    <div className="title">我的动态</div>
                    <div className="dynamic">
                        {
                            dynamicList && dynamicList.map((item) => {
                                return <div className="dynamic-item" key={item.id}>
                                    <span>{item.user.name} <strong>[{typeName(item.dynamicType)}]</strong> <strong>[{modelName(item.model)}]</strong> </span>
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-date">{item.dynamicTime}</span>
                                </div>
                            })
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default inject('projectSurveyStore', 'homeStore', 'workStore')(observer(Survey));