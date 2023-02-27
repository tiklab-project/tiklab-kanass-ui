
/*
 * @Descripttion: 事项工时
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-30 17:40:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-10 10:01:44
 */
import React, { Fragment, useEffect, useState } from "react"
import { observer, inject } from "mobx-react";
import { Input, Table, Select, Button, Form, Pagination, DatePicker, Empty } from 'antd';
import moment from "moment";
import "./LogStatistics.scss"
const { RangePicker } = DatePicker;


const UserLogStatistics = (props) => {
    const { logStore, statisticsStore } = props
    const { findAllUser, userList, findUserProjectLog } = logStore;
    const { findProjectList } = statisticsStore;
    const [form] = Form.useForm();
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';
    const [workLog, setworkLog] = useState()
    const [headerDay, setHeaderDay] = useState()
    const [workItemManhour, setWorkItemManhour] = useState()
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint;
    const projectSetId = props.match.params.projectSetId;
    const [projectList, setProjectList] = useState()
    useEffect(() => {
        findAllUser()
        const startTime = moment().subtract(1, 'months').format('YYYY-MM-DD');
        const endTime = moment().format('YYYY-MM-DD');
        const values = {
            startTime: startTime,
            endTime: endTime,
            currentPage: 1,
            projectId: projectId,
            projectSetId: projectSetId
        }
        form.setFieldsValue({
            dateRanger: [moment(startTime, dateFormat), moment(endTime, dateFormat)]
        })
        findUserProjectLog(values).then(res => {
            if (res.code === 0) {
                setworkLog(res.data)
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
            }
            serCurrent(1)
        })

        if (projectSetId) {
            findProjectList({ projectSetId: projectSetId }).then(res => {
                if (res.code === 0) {
                    setProjectList(res.data)
                }
            })
        }
        return;
    }, [])

    const [current, serCurrent] = useState(0)

    const submitSeachInfo = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            'startTime': fieldsValue.startTime[0].format('YYYY-MM-DD'),
            'endTime': fieldsValue.startTime[1].format('YYYY-MM-DD'),
            currentPage: 1
        }
        findUserProjectLog(values).then(res => {
            if (res.code === 0) {
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
                setworkLog(res.data)
            }
            // setTableWork(res.data)
            serCurrent(1)
        })

    }

    const changField = (changedValues, allValues) => {
        console.log(allValues)
        console.log(Object.keys(changedValues)[0])
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

        findUserProjectLog(params).then(res => {
            if (res.code === 0) {
                setworkLog(res.data)
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
            }
            serCurrent(1)
        })
    }

    // 日期翻页
    const changeDataPage = (value) => {
        serCurrent(value)
        findUserProjectLog({ currentPage: value }).then(res => {
            if (res.code === 0) {
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
                setworkLog(res.data)
            }
        })
    }

    return (
        <div className="project-log-project">
            <div className="log-project-top">
                <div className="first-level">人员项目工时统计</div>
                <div className="log-project-form">
                    <Form
                        layout="inline"
                        form={form}
                        onFinish={submitSeachInfo}
                        onValuesChange={(changedValues, allValues) => changField(changedValues, allValues)}
                    >
                        {/* <Form.Item name="worker">
                            <Select
                                placeholder="所有成员"
                                allowClear
                                key="project"
                                style={{ width: 100, marginRight: "20px" }}
                            >
                                {
                                    userList && userList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item> */}
                        <Form.Item name="dateRanger" rules={[{ required: true }]}>
                            <RangePicker
                                format={dateFormat}
                            />
                        </Form.Item>
                        {/* <Form.Item name="keywords" rules={[{ required: false }]}>
                            <Input placeholder="项目名称"/>
                        </Form.Item> */}
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
                        {/* <Form.Item>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item> */}
                    </Form>
                    <Pagination simple defaultCurrent={1} pageSize={10} total={workLog && workLog.total} current={current} onChange={(value) => changeDataPage(value)} />
                </div>
            </div>

            {
                workItemManhour && workItemManhour.length > 0 ? <div className="project-logtable">
                    <div className="project-logtable-heard">
                        <div className="logtable-heard-user">
                            成员
                        </div>
                        <div className="logtable-heard-total">
                            总计
                        </div>
                        <div className="logtable-heard-project">
                            项目
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
                        workItemManhour && workItemManhour.length > 0 && workItemManhour.map(userItem => {
                            return <div className="project-logtable-contant">
                                <div className="logtable-contant-user">
                                    {userItem.user.name}
                                </div>
                                <div className="logtable-contant-user">
                                    {userItem.total}
                                </div>
                                <div className="logtable-contant-statistic">
                                    {
                                        userItem.projectListLogList.length > 0 && userItem.projectListLogList.map(projectItem => {
                                            return (
                                                <div className="logtable-contant-statistic-item">
                                                    <div className="logtable-contant-project">{projectItem.project?.projectName}</div>
                                                    <div className="logtable-contant-takeuptime">
                                                        {
                                                            projectItem.statisticsList && projectItem.statisticsList.length > 0 && projectItem.statisticsList.map(statisticItem => {
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

        </div>
    )
}
export default inject('logStore', 'statisticsStore')(observer(UserLogStatistics));