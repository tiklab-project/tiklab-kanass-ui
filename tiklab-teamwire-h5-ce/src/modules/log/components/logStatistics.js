/*
 * @Descripttion: 日志页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-27 15:36:42
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-10 10:05:52
 */
import React, { Fragment, useEffect, useState } from "react";
import { Button, Empty, Picker, DatePicker } from 'antd-mobile'
import { observer, inject } from "mobx-react";
import "./logStatistics.scss"
import { DownFill } from 'antd-mobile-icons'
import dayjs from 'dayjs';

const LogStatistics = (props) => {
    const { logStore } = props
    const { findAllWorkLog, findAllProject, perWorkingHours, findMatterWorkingHours } = logStore;

    const [typeVisible, setTypeVisible] = useState(false);
    const [projectPickerVisible, setProjectPickerVisible] = useState(false);
    const [startPickerVisible, setStartPickerVisible] = useState(false);
    const [endPickerVisible, setEndPickerVisible] = useState(false);

    const [type, setType] = useState({ label: "人员", value: "user" })
    const [project, setProject] = useState({ label: "所有项目", value: "0" })
    const [startDate, setStartDate] = useState(dayjs().subtract(7, "day").format("YYYY-MM-DD"))
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"))

    const [projectList, setProjectList] = useState([[]])
    const [userStatistic, setUserStatistic] = useState()
    const [hourStatistic, setHourStatistic] = useState()
    const typeColums = [
        [
            {
                value: "user",
                label: '人员'
            },
            {
                value: "workitem",
                label: '事项'
            }

        ]
    ]

    useEffect(() => {
        submitUserInfo()
        findAllWorkLog()
        findAllProject().then(res => {
            if (res.code === 0) {
                const list = res.data;
                const project = [{ value: "0", label: "所有项目" }];
                list.map(item => {
                    project.push({ value: item.id, label: item.projectName });
                    return 0;
                })
                setProjectList(project);
            }
        })
        return;
    }, [])

    const showTypePicker = () => {
        setTypeVisible(true)
    }

    const selectType = (value, extend) => {
        console.log(value, extend)
        setType(extend.items[0])
    }


    const showProjectPicker = () => {
        setProjectPickerVisible(true)
    }
    const selectProject = (value, extend) => {
        setProject(extend.items[0])
    }

    const showStartDatePicker = () => {
        setStartPickerVisible(true)
    }
    const selectStartDate = (value) => {
        setStartDate(dayjs(value).format('YYYY-MM-DD'))
    }

    const showEndDatePicker = () => {
        setEndPickerVisible(true)
    }
    const selectEndDate = (value) => {
        setEndDate(dayjs(value).format('YYYY-MM-DD'))
    }

    const submit = () => {
        switch (type.value) {
            case "user":
                submitUserInfo();
                break;
            case "workitem":
                submitWorkItemInfo();
                break;
        }
    }

    const submitUserInfo = () => {
        const values = {
            projectId: project.value,
            startTime: startDate,
            endTime: endDate,
            currentPage: 1
        }
        perWorkingHours(values).then(res => {
            if (res.code === 0) {
                console.log(res.data)
                setUserStatistic(res.data.headerDay)
                setHourStatistic(res.data.manHour)
            }
        })
    }

    const submitWorkItemInfo = () => {
        const values = {
            projectId: project.value,
            startTime: startDate,
            endTime: endDate,
            currentPage: 1
        }
        findMatterWorkingHours(values).then(res => {
            if (res.code === 0) {
                setUserStatistic(res.data.headerDay)
                setHourStatistic(res.data.workItemManhour)
            }
        })

    }

    return (
        <Fragment>
            <div className="log-filter">
                {/* <div className="log-filter-search">
                    <SearchBar placeholder='请输入内容' />
                </div> */}
                <div className="log-filter-picker">
                    <div className="picker-user" onClick={() => showTypePicker()}>
                        {type.label}
                        <DownFill className="picker-icon" />
                    </div>
                    <div className="picker-project" onClick={() => showProjectPicker()}>
                        {project.label}
                        <DownFill className="picker-icon" />
                    </div>
                    <div className="picker-date" onClick={() => showStartDatePicker()}>
                        {startDate}
                        <DownFill className="picker-icon" />
                    </div>
                    <div className="picker-date" onClick={() => showEndDatePicker()}>
                        {endDate}
                        <DownFill className="picker-icon" />
                    </div>
                    <div className="filter-submit" onClick={() => submit()}>确定</div>
                </div>
            </div>
            {
                userStatistic && userStatistic.length > 0 ? <div className="log-statistics-box">
                    <div className="log-statistics-table">
                        <div className="table-head">
                            <div className="statistics-user">
                                成员
                            </div>
                            <div className="statistics-total">
                                总计
                            </div>
                            {
                                userStatistic && userStatistic.map(item => {
                                    return (<div className="statistics-table-tr" key={item.dateTime}>
                                        <div>{item.dateTime}</div>
                                        <div>{item.weekDay}</div>
                                    </div>
                                    )
                                })
                            }
                        </div>
                        {
                            hourStatistic && hourStatistic.map((item, index) => {
                                return (<div className="table-row" key={index}>
                                    <div className="statistics-user">
                                        {item.name}
                                    </div>
                                    <div className="statistics-total">
                                        {item.totalNumber}
                                    </div>
                                    {
                                        item.statisticsList.map((staticticsItem, index) => {
                                            return (<div className="statistics-table-tr" key={index}>
                                                {staticticsItem}
                                            </div>
                                            )
                                        })
                                    }
                                </div>

                                )
                            })
                        }
                    </div>
                </div>
                :
                <Empty description='暂无数据' />
            }


            <Picker
                columns={typeColums}
                visible={typeVisible}
                onClose={() => {
                    setTypeVisible(false)
                }}
                onConfirm={(value, extend) => selectType(value, extend)}
            />
            <Picker
                columns={[projectList]}
                visible={projectPickerVisible}
                onClose={() => {
                    setProjectPickerVisible(false)
                }}
                onConfirm={(value, extend) => selectProject(value, extend)}
            />
            <DatePicker
                visible={startPickerVisible}
                precision='day'
                onClose={() => {
                    setStartPickerVisible(false)
                }}
                onConfirm={(value, extend) => selectStartDate(value)}
            >
            </DatePicker>
            <DatePicker
                visible={endPickerVisible}
                precision='day'
                onClose={() => {
                    setEndPickerVisible(false)
                }}
                onConfirm={(value, extend) => selectEndDate(value)}
            >
            </DatePicker>

        </Fragment>
    )
}
export default inject('logStore')(observer(LogStatistics));