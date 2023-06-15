
/*
 * @Descripttion: 用户工时
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-30 17:40:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-25 13:24:52
 */
import React, { useEffect, useState } from "react"
import { observer, inject } from "mobx-react";
import { Select, Form, Pagination, DatePicker, Empty } from 'antd';
import moment from "moment";
import "../components/LogStatistics.scss";
import { withRouter } from "react-router";
import statisticStore from "../store/StatisticStore";
const { RangePicker } = DatePicker;

const LogProjectUserStatistics = (props) => {
    const { findProjectList,  findProjectUserLog} = statisticStore;
    const [form] = Form.useForm();
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint;
    const projectSetId = props.match.params.projectSetId;
    const [workLog, setworkLog] = useState()
    const [headerDay, setHeaderDay] = useState()
    const [workItemManhour, setWorkItemManhour] = useState()
    const reportId = props.match.params.id;
    const startTime = moment().subtract(1, 'months').format('YYYY-MM-DD');
    const endTime = moment().format('YYYY-MM-DD');
    const [projectList, setProjectList] = useState()
    useEffect(() => {
        if (projectSetId) {
            findProjectList({ projectSetId: projectSetId }).then(res => {
                if (res.code === 0) {
                    setProjectList(res.data)
                }
            })
        }
        const values = {
            startTime: startTime,
            endTime: endTime,
            currentPage: 1,
            projectId: projectId,
            projectSetId: projectSetId
        }
        form.setFieldsValue({
            dateRanger: [moment(startTime, dateFormat), moment(endTime, dateFormat)],
            projectId: projectId,
            projectSetId: projectSetId
        })
        findProjectUserLog(values).then(res => {
            if (res.code === 0) {
                setworkLog(res.data)
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
            }
            setCurrent(1)
        })

        return;
    }, [reportId])


    // 当前页数
    const [current, setCurrent] = useState(0)

    const submitSeachInfo = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            'startTime': fieldsValue.startTime[0].format('YYYY-MM-DD'),
            'endTime': fieldsValue.startTime[1].format('YYYY-MM-DD'),
            currentPage: 1
        }
        findProjectUserLog(values).then(res => {
            if (res.code === 0) {
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
                setworkLog(res.data)
            }
            // setTableWork(res.data)
            setCurrent(1)
        })
    }

    // 日期翻页
    const changeDataPage = (value) => {
        setCurrent(value)
        findProjectUserLog({ currentPage: value }).then(res => {
            if (res.code === 0) {
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
                setworkLog(res.data)
            }
        })
    }


    const changField = (changedValues, allValues) => {
        let params;
        if(Object.keys(changedValues)[0] === "dateRanger"){
            params = {
                startTime: changedValues.dateRanger[0].format('YYYY-MM-DD'),
                endTime: changedValues.dateRanger[1].format('YYYY-MM-DD'),
                projectSetId: projectSetId
            }
        }

        if(Object.keys(changedValues)[0] === "projectId"){
            params = {
                startTime: allValues.dateRanger[0].format('YYYY-MM-DD'),
                endTime: allValues.dateRanger[1].format('YYYY-MM-DD'),
                projectSetId: projectSetId,
                ...changedValues
            }
        }

        findProjectUserLog(params).then(res => {
            if (res.code === 0) {
                setworkLog(res.data)
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
            }
            setCurrent(1)
        })
    }

    return (
        <div className="project-log-project">
            <div className="log-project-top">
                <div className="first-level">项目成员统计</div>
                <div className="log-project-form">
                    <Form
                        layout="inline"
                        form={form}
                        onFinish={submitSeachInfo}
                        onValuesChange={(changedValues, allValues) => changField(changedValues, allValues)}
                    >
                        <Form.Item name="dateRanger" rules={[{ required: true }]}>
                            <RangePicker
                                format={dateFormat}
                            />
                        </Form.Item>
                        {
                            projectSetId && <Form.Item name="projectId" label="项目">
                                <Select
                                    placeholder="项目"
                                    allowClear
                                    style={{
                                        width: 120,
                                    }}
                                >
                                    {
                                        projectList && projectList.map(item => {
                                            return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    </Form>
                    <Pagination simple defaultCurrent={1} pageSize={10} total={workLog && workLog.total} current={current} onChange={(value) => changeDataPage(value)} />
                </div>
            </div>

            {
                workItemManhour && workItemManhour.length > 0 ? <div className="project-logtable">
                    <div className="project-logtable-heard">
                        <div className="logtable-heard-user">
                            项目
                        </div>
                        <div className="logtable-heard-total">
                            总计
                        </div>
                        <div className="logtable-heard-project">
                            成员
                        </div>
                        <div className="logtable-heard-timemap">
                            {
                                headerDay && headerDay.length > 0 && headerDay.map((item, index) => {
                                    return <div key = {index}>
                                        <div>
                                            {item.dateTime.substring(0, 10)}
                                        </div>
                                        <div>
                                            {item.weekDay}
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>

                    {
                        workItemManhour && workItemManhour.length > 0 && workItemManhour.map(projectItem => {
                            return <div className="project-logtable-contant" key = {projectItem.project?.id}>
                                <div className="logtable-contant-user">
                                    {projectItem.project?.projectName}
                                </div>
                                <div className="logtable-contant-user">
                                    {projectItem.total}
                                </div>
                                <div className="logtable-contant-statistic">
                                    {
                                        projectItem.projectListLogList.length > 0 && projectItem.projectListLogList.map(userItem => {
                                            return (
                                                <div className="logtable-contant-statistic-item" key = {userItem?.user?.id}>
                                                    <div className="logtable-contant-project">{userItem?.user?.name}</div>
                                                    <div className="logtable-contant-takeuptime">
                                                        {
                                                            userItem.statisticsList && userItem.statisticsList.length > 0 && userItem.statisticsList.map((statisticItem, index) => {
                                                                return (
                                                                    <div key= {index}>{statisticItem.statistics}</div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }

                </div>
                    :
                    <Empty />
            }
        </div>
    )
}
export default withRouter(LogProjectUserStatistics);