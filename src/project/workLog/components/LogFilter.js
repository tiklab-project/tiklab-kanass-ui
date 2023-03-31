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
const { RangePicker } = DatePicker;

const LogFilter = (props) => {
    const {logStore, type, dateValue, setDateValue } = props;
    const { findWorkLogPage, logList } = logStore;
    // 项目id
    const projectId = props.match.params.id;
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';
    const userId = getUser().userId

   

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