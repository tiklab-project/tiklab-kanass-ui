
/*
 * @Descripttion: 用户工时
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-30 17:40:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-25 13:24:52
 */
import React, { Fragment, useEffect, useState } from "react"
import { observer, inject } from "mobx-react";
import { Input, Table, Select, Button, Form, Pagination, DatePicker, Empty } from 'antd';
import moment from "moment";
import "./LogStatistics.scss";
import ReportAddOrEdit from "./ReportAddOrEdit"
const { RangePicker } = DatePicker;

const ProjectWorkItemLogStatistics = (props) => {
    const { logStore, statisticsStore } = props
    const { findProjectWorkItemLog } = logStore;
    const { findProjectList } = statisticsStore;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fromData, setFromData] = useState()
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint;
    const projectSetId = props.match.params.projectSetId;
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';

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
            projectId: projectId
        }
        form.setFieldsValue({
            dateRanger: [moment(startTime, dateFormat), moment(endTime, dateFormat)],
            projectId: projectId,
            projectSetId: projectSetId
        })
        findProjectWorkItemLog(values).then(res => {
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
        findProjectWorkItemLog(values).then(res => {
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
        findProjectWorkItemLog({ currentPage: value }).then(res => {
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

        findProjectWorkItemLog(params).then(res => {
            if (res.code === 0) {
                setworkLog(res.data)
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
            }
            setCurrent(1)
        })
    }

    const addReport = () => {
        form.validateFields().then((values) => {
            const params = {
                ...values,
                startDate: values.startTime[0].startOf("day").format("YYYY-MM-DD"),
                endDate: values.startTime[1].endOf("day").format("YYYY-MM-DD")
            }
            setFromData(params)
        })
        setVisible(true)
    }

    return (
        <div className="project-log-project">
            <div className="log-project-top">
                <div className="first-level">项目事项工时统计</div>
                <div className="log-project-form">
                    <div>
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
                    </div>
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
                            事项
                        </div>
                        <div className="logtable-heard-timemap">
                            {
                                headerDay && headerDay.length > 0 && headerDay.map(item => {
                                    return <div>
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
                            return <div className="project-logtable-contant">
                                <div className="logtable-contant-user">
                                    {projectItem.project?.projectName}
                                </div>
                                <div className="logtable-contant-user">
                                    {projectItem.total}
                                </div>
                                <div className="logtable-contant-statistic">
                                    {
                                        projectItem.projectListLogList.length > 0 && projectItem.projectListLogList.map(workItem => {
                                            return (
                                                <div className="logtable-contant-statistic-item">
                                                    <div className="logtable-contant-project">{workItem.workItem.title}</div>
                                                    <div className="logtable-contant-takeuptime">
                                                        {
                                                            workItem.statisticsList && workItem.statisticsList.length > 0 && workItem.statisticsList.map(statisticItem => {
                                                                return (
                                                                    <div>{statisticItem.statistics}</div>
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
            <ReportAddOrEdit
                fromData={fromData}
                visible={visible}
                setVisible={setVisible}
                reportType="logprojectwork"
                type="log"
                {...props}
            />
        </div>
    )
}
export default inject('statisticsStore', 'logStore')(observer(ProjectWorkItemLogStatistics));