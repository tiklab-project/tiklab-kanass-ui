/*
 * @Descripttion: 日志筛选
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-28 16:55:28
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-18 09:46:31
 */
import React, { useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Form, DatePicker } from 'antd';
import "./LogFilter.scss"
import moment from "moment";
import { getUser } from "tiklab-core-ui";
import { withRouter } from "react-router";
import { useState } from "react";
const { RangePicker } = DatePicker;

const LogFilter = (props) => {
    const { workStore, logStore, type } = props;
    const { findProjectList, projectList } = workStore;
    const { findWorkLogPage, logList } = logStore;
    // 项目id
    const projectId = props.match.params.id;
    const [dateValue, setDateValue] = useState()
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';
    const userId = getUser().userId

    /**
     * 获取项目列表
     */
    useEffect(() => {
        findProjectList()
        getList()
        return;
    }, [])

    /**
     * 进入页面获取一周的日志列表
     */
    const getList = () => {
        if (type === "allLog") {
            const data = {
                projectId: projectId,
                startTime: moment().subtract(7, 'days').startOf("day").format("YYYY-MM-DD"),
                endTime: moment().add(1, 'days').format("YYYY-MM-DD"),
            }
            findWorkLogPage(data)
        }
        if (type === "myLog") {
            const data = {
                worker: userId,
                projectId: projectId,
                startTime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                endTime: moment().add(1, 'days').format('YYYY-MM-DD'),
            }
            findWorkLogPage(data)
        }
        console.log([moment().subtract(7, 'days'), moment()])
        setDateValue([moment().subtract(7, 'days'), moment()])
    }

    /**
     * 根据搜索条件查询日志
     * @param {*} dateValue 
     */
    const changeData = (dateValue) => {
        setDateValue(dateValue)
        if (type === "allLog") {
            const values = {
                projectId: projectId,
                'startTime': dateValue[0].format('YYYY-MM-DD'),
                'endTime': moment(dateValue[1]).add(1, 'days').format('YYYY-MM-DD'),
                currentPage: 0
            }
            findWorkLogPage(values)
        }
        if (type === "myLog") {
            const values = {
                worker: userId,
                projectId: projectId,
                'startTime': dateValue[0].format('YYYY-MM-DD'),
                'endTime': moment(dateValue[1]).add(1, 'days').format('YYYY-MM-DD'),
                currentPage: 0
            }
            findWorkLogPage(values)
        }

    }


    return (
        <RangePicker
            value = {dateValue}
            format={dateFormat}
            onChange = {changeData}
        />

    )
}
export default withRouter(inject('workStore', 'logStore')(observer(LogFilter)));