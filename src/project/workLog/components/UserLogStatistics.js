
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
import { Input, Table, Select, Button, Form, Pagination, DatePicker,Empty } from 'antd';
import moment from "moment";
import "./UserLogStatistics.scss"
const { RangePicker } = DatePicker;


const UserLogStatistics = (props) => {
    const { logStore } = props
    const { findAllUser,userList, findUserProjectLog } = logStore;
    const [form] = Form.useForm();
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';
    const [workLog, setworkLog] = useState()
    const [headerDay, setHeaderDay] = useState()
    const [workItemManhour, setWorkItemManhour] = useState()
    useEffect(() => {
        findAllUser()
        const values = {
            startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
            endTime: moment().format('YYYY-MM-DD'),
            currentPage: 1
        }
        findUserProjectLog(values).then(res => {
            if (res.code === 0) {
                setworkLog(res.data)
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
            }
            serCurrent(1)
        })
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
        <Fragment>
            <div className="log-from">
                <div>
                    <Form
                        layout="inline"
                        form={form}
                        onFinish={submitSeachInfo}
                    >
                        <Form.Item name="worker">
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
                        </Form.Item>
                        <Form.Item name="startTime" rules={[{ required: true }]}>
                            <RangePicker
                                format={dateFormat}
                            />
                        </Form.Item>
                        <Form.Item name="keywords" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <Pagination simple defaultCurrent={1} pageSize= {10} total={workLog && workLog.total} current={current} onChange={(value) => changeDataPage(value)} />
            </div>                     
            {
                workItemManhour && workItemManhour.length > 0 ? <div className="work-logtable">
                    <div className="work-logtable-heard">
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
                        workItemManhour && workItemManhour.length > 0  && workItemManhour.map(userItem => {
                            return <div className="work-logtable-contant">
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

        </Fragment>
    )
}
export default inject('logStore')(observer(UserLogStatistics));