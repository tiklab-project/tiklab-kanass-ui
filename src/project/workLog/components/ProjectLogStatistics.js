
/*
 * @Descripttion: 用户工时
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-30 17:40:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-25 13:24:52
 */
import React,{ Fragment, useEffect, useState } from "react"
import {observer, inject} from "mobx-react";
import { Input,Table, Select,Button,Form, Pagination,DatePicker,Empty } from 'antd';
import moment from "moment";
import "./UserLogStatistics.scss"
const { RangePicker } = DatePicker;

const ProjectLogStatistics = (props)=> {
    const {workStore,logStore} = props
    const {findProjectList, projectList} = workStore;
    const {findProjectUserLog} = logStore;
    const [form] = Form.useForm();
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';

    const [workLog, setworkLog] = useState()
    const [headerDay, setHeaderDay] = useState()
    const [workItemManhour, setWorkItemManhour] = useState()

    useEffect(()=> {
        findProjectList().then(data=> {
        })
        const values = {
            startTime: moment().subtract(1, 'months').format('YYYY-MM-DD') ,
            endTime: moment().format('YYYY-MM-DD') ,
            currentPage: 1
        }
        findProjectUserLog(values).then(res => {
            if (res.code === 0) {
                setworkLog(res.data)
                setHeaderDay(res.data.headerDay)
                setWorkItemManhour(res.data.workItemManhour)
            }
            setCurrent(1)
        })
        return;
    },[])

    const initColumns = [{
        title: '成员',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        align: "left"
    },
    {
        title: '总计',
        width: 100,
        dataIndex: 'statistics',
        key: 'age',
        fixed: 'left',
        align: "left"
    }]
    // 当前页数
    const [current,setCurrent] = useState(0)
    

    
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

    return (
        <Fragment>
            <div className="log-from">
                <div>
                    <Form
                        layout="inline"
                        form={form}
                        onFinish={submitSeachInfo}
                    >   
                        <Form.Item name="projectId">
                            <Select
                                placeholder="所有项目"
                                allowClear
                                key="project"
                                style={{ width:100,marginRight: "20px"}}
                            >
                                {
                                    projectList && projectList.map((item)=>{
                                        return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="startTime" rules={[{ required: true }]}>
                            <RangePicker
                                format={dateFormat}
                            />
                        </Form.Item>
                        <Form.Item  name="keywords" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <Pagination simple defaultCurrent={1} pageSize= {10} total={workLog && workLog.total}  current= {current} onChange={(value)=>changeDataPage(value)}/>
            </div>
            {
                workItemManhour && workItemManhour.length > 0 ? <div className="work-logtable">
                    <div className="work-logtable-heard">
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
                        workItemManhour && workItemManhour.length > 0  && workItemManhour.map(projectItem => {
                            return <div className="work-logtable-contant">
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
                                                <div className="logtable-contant-statistic-item">
                                                    <div className="logtable-contant-project">{userItem.user.name}</div>
                                                    <div className="logtable-contant-takeuptime">
                                                        {
                                                            userItem.statisticsList && userItem.statisticsList.length > 0 && userItem.statisticsList.map(statisticItem => {
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
export default inject('workStore','logStore')(observer(ProjectLogStatistics));