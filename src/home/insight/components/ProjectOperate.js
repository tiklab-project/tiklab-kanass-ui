import React, { Fragment, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Progress, Select } from 'antd';
import "./ProjectOperate.scss";
import * as echarts from 'echarts';
const { Option } = Select;

const ProjectOperateTable = (props) => {
    const { insightStore } = props;
    const { statisticsProjectOperate, statisticsDayWorkItemCount, statisticsDayDemandCount,
        statisticsDayTaskCount, statisticsDayBugCount, statisticsWorkItemStatusCount,
        statisticsDemandStatusCount, statisticsTaskStatusCount, statisticsBugStatusCount,
        statisticsUserWorkItemCount, projectSetId, setProjectSetId, findAllProject, projectId, setProjectId } = insightStore;
    const [projectOperate, setProjectOPerte] = useState([])
    const [workItemStatusCount, setWorkItemStatusCount] = useState();
    const [demandStatusCount, setDemandStatusCount] = useState();
    const [taskStatusCount, setTaskStatusCount] = useState();
    const [bugStatusCount, setBugStatusCount] = useState();
    const [projectList, setProjectList] = useState([]);
    
    useEffect(() => {
        if (projectId.length > 0) {
            statisticsProjectOperate({ projectId:  projectId }).then(res => {
                if (res.code === 0) {
                    setProjectOPerte(res.data)
                }
            })
            statisticsWorkItemStatusCount({ projectId: projectId }).then(res => {
                setWorkItemStatusCount(res.data)
            })
            statisticsDemandStatusCount({ projectId: projectId }).then(res => {
                setDemandStatusCount(res.data)
            })
            statisticsTaskStatusCount({ projectId: projectId }).then(res => {
                setTaskStatusCount(res.data)
            })
            statisticsBugStatusCount({ projectId: projectId}).then(res => {
                setBugStatusCount(res.data)
            })

            statisticsDayWorkItem("project-trend-workItem", statisticsDayWorkItemCount, "事项趋势")
            statisticsDayWorkItem("project-trend-demand", statisticsDayDemandCount, "需求趋势")
            statisticsDayWorkItem("project-trend-task", statisticsDayTaskCount, "任务趋势")
            statisticsDayWorkItem("project-trend-bug", statisticsDayBugCount, "缺陷趋势")

            statisticsUserWorkItem()
        }

    }, [projectId])

    useEffect(() => {
        findAllProject().then(res => {
            setProjectList(res.data)
            setProjectId(res.data[0].id)
        })
    }, [])

    const statisticsDayWorkItem = (domId, statisticsDay, title) => {
        const data = {
            startDate: "2022-08-22 00:00:00",
            endDate: "2022-09-22 00:00:00",
            projectId: projectId
        }
        const chartDom = document.getElementById(domId)
        statisticsDay(data).then(res => {
            if (res.code === 0) {
                const data = res.data;
                const xAxisData = data.date.map(item => {
                    return item.slice(0, 10)
                })
                const yAxisNew = [];
                const yAxisEnd = [];
                const yAxisRemain = [];
                data.conntList.map(item => {
                    yAxisNew.push(item.new)
                    yAxisEnd.push(item.end)
                    yAxisRemain.push(item.remain)
                    return item;
                })
                let myChart = echarts.init(chartDom);
                let option = {
                    title: {
                        text: title
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['New', 'End', 'Remain']
                    },

                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    yAxis: {
                        type: 'value'
                    },

                    series: [
                        {
                            name: "New",
                            data: yAxisNew,
                            type: 'bar',
                        },
                        {
                            name: "End",
                            data: yAxisEnd,
                            type: 'bar',
                        },
                        {
                            name: "Remain",
                            data: yAxisRemain,
                            type: 'line',
                        },
                    ]
                };
                myChart.setOption(option);
            }
        })
    }
    const statisticsUserWorkItem = () => {
        const chartDom = document.getElementById('project-user-box')
        statisticsUserWorkItemCount({ projectId: { projectId } }).then(res => {
            if (res.code === 0) {
                const userList = res.data;
                const types = ["demand", "task", "bug"];
                const series = [];
                const yAxisValue = [];
                const seriesWorkItem = [];
                const seriesDemand = [];
                const seriesTask = [];
                const seriesBug = [];

                userList.map((item, index) => {
                    yAxisValue.push(item.user.name)
                    seriesWorkItem.push(item.workItemTypeCount.workItem)
                    seriesDemand.push(item.workItemTypeCount.demand)
                    seriesTask.push(item.workItemTypeCount.task)
                    seriesBug.push(item.workItemTypeCount.bug)
                })
                series.push(
                    {
                        name: "demand",
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesDemand
                    },
                    {
                        name: "task",
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesTask
                    },
                    {
                        name: "bug",
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesBug
                    },
                )
                let myChart = echarts.init(chartDom);
                let option = {
                    title: {
                        text: '项目成员'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            // Use axis to trigger tooltip
                            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                    },
                    legend: {},
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: yAxisValue
                    },
                    series: series
                };
                myChart.setOption(option);
            }
        })
    }

    return (
        <Fragment>
            <div className="project-operate">
                <div className="insight-title">
                    <div className="project-breadcrumb">
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-home"></use>
                        </svg>
                        <span onClick={() => props.history.push(firstUrl)}>效能</span>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-rightBlue"></use>
                        </svg>
                        <span>项目度量</span>
                        <div style={{ marginLeft: "20px" }}>项目：</div>
                        <Select
                            defaultValue={projectId}
                            style={{
                                width: 120,
                            }}
                            onChange={(value) => setProjectId(value)}
                        >
                            {
                                projectList.length > 0 && projectList.map(item => {
                                    return <Option value={item.id} key={item.id} >{item.projectName}</Option>
                                })
                            }
                        </Select>
                    </div>

                </div>
                <div className="project-operate-title">项目进展</div>
                <div className="project-operate-table">
                    <div className="project-operate-col head">
                        <div className="project-operate-row">项目名字</div>
                        <div className="project-operate-row">当前进展</div>
                        <div className="project-operate-row">新增/完成需求</div>
                        <div className="project-operate-row">存量需求</div>
                        <div className="project-operate-row">需求交付周期</div>
                        <div className="project-operate-row">新增/修复缺陷</div>
                        <div className="project-operate-row">存量缺陷</div>
                        <div className="project-operate-row">缺陷修复周期</div>
                        <div className="project-operate-row">已超期事项</div>
                    </div>
                    <div className="project-operate-col" key={projectOperate.projectId}>
                        <div className="project-operate-row">{projectOperate.projectName}</div>
                        <div className="project-operate-row">
                            <Progress
                                type="circle"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                percent={80}
                                showInfo={false}
                                width={30}
                                strokeWidth={20}
                                strokeLinecap="butt"
                            />
                            <span>{projectOperate.precent}</span>
                        </div>
                        <div className="project-operate-row">
                            {projectOperate.newWorkItemCount}/{projectOperate.endWorkItemCount}
                        </div>
                        <div className="project-operate-row">
                            {projectOperate.noEndWorkItemCount}
                        </div>
                        <div className="project-operate-row">{projectOperate.workItemEndAveragePeriod}</div>
                        <div className="project-operate-row">{projectOperate.newBug}/{projectOperate.endBugCount}</div>
                        <div className="project-operate-row">{projectOperate.noEndBugCount}</div>
                        <div className="project-operate-row">{projectOperate.bugEndAveragePeriod}</div>
                        <div className="project-operate-row">{projectOperate.overdueWorkItemCount}</div>
                    </div>
                </div>


            </div>
            <div className="project-workItem-static">
                <div className="workItem-static-row">
                    <div className="workItem-static">
                        <div className="workItem-static-title">事项进展</div>
                        {
                            workItemStatusCount && <div className="workItem-static-content">
                                <div className="workItem-static-content-item">
                                    <div>{workItemStatusCount.all} 个</div>
                                    <div>全部事项</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{workItemStatusCount.noEnd} 个</div>
                                    <div>已完成事项</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{workItemStatusCount.start} 个</div>
                                    <div>已开始事项</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{workItemStatusCount.todo} 个</div>
                                    <div>未开始事项</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{workItemStatusCount.overdue} 个</div>
                                    <div>已逾期事项</div>
                                </div>
                            </div>
                        }

                    </div>
                    <div className="workItem-static">
                        <div className="workItem-static-title">需求进展</div>
                        {
                            demandStatusCount && <div className="workItem-static-content">
                                <div className="workItem-static-content-item">
                                    <div>{demandStatusCount.all} 个</div>
                                    <div>全部需求</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{demandStatusCount.noEnd} 个</div>
                                    <div>已完成需求</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{demandStatusCount.start} 个</div>
                                    <div>已开始需求</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{demandStatusCount.todo} 个</div>
                                    <div>未开始需求</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{demandStatusCount.overdue} 个</div>
                                    <div>已逾期需求</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="workItem-static-row">
                    <div className="workItem-static">
                        <div className="workItem-static-title">任务进展</div>
                        {
                            taskStatusCount && <div className="workItem-static-content">
                                <div className="workItem-static-content-item">
                                    <div>{taskStatusCount.all} 个</div>
                                    <div>全部任务</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{taskStatusCount.noEnd} 个</div>
                                    <div>已完成任务</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{taskStatusCount.start} 个</div>
                                    <div>已开始任务</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{taskStatusCount.todo} 个</div>
                                    <div>未开始任务</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{taskStatusCount.overdue} 个</div>
                                    <div>已逾期任务</div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="workItem-static">
                        <div className="workItem-static-title">缺陷进展</div>
                        {
                            bugStatusCount && <div className="workItem-static-content">
                                <div className="workItem-static-content-item">
                                    <div>{bugStatusCount.all} 个</div>
                                    <div>全部缺陷</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{bugStatusCount.noEnd} 个</div>
                                    <div>已完成缺陷</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{bugStatusCount.start} 个</div>
                                    <div>已开始缺陷</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{bugStatusCount.todo} 个</div>
                                    <div>未开始缺陷</div>
                                </div>
                                <div className="workItem-static-content-item">
                                    <div>{bugStatusCount.overdue} 个</div>
                                    <div>已逾期缺陷</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div>
                <div className="project-trend-row">
                    <div className="project-trend-workItem" id="project-trend-workItem">

                    </div>
                    <div className="project-trend-demand" id="project-trend-demand">

                    </div>
                </div>
                <div className="project-trend-row">
                    <div className="project-trend-workItem" id="project-trend-task">

                    </div>
                    <div className="project-trend-demand" id="project-trend-bug">

                    </div>
                </div>
            </div>
            <div className="project-user">
                <div className="project-user-box" id="project-user-box"></div>
            </div>
        </Fragment>

    )
}

export default inject("insightStore")(observer(ProjectOperateTable));