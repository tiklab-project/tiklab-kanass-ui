/*
 * @Descripttion: 事项详情页面的动态tab页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-03 16:36:24
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:40:48
 */
import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { DatePicker, Empty } from 'antd';
import "./WorkDynamic.scss";
import WorkDynamicStore from '../store/WorkDynamicStore';
import ProjectEmpty from "../../common/component/ProjectEmpty";
import PaginationCommon from "../../common/page/Page";
import WorkDynamicTimeAxis from "./WorkDynamicTimeAxis";

const { RangePicker } = DatePicker;
const WorkDynamic = (props) => {

    const { workStore } = props;
    const { logTimeList, findLogPageByTime, opLogTimeCondition } = WorkDynamicStore;
    const { workId } = workStore;
    const workDynamic = useRef();
    useEffect(() => {
        findLogPageByTime({ data: { workItemId: workId } })
    }, [workId])

    /**
     * 分页
     */
    const onPageChange = (page) => {
        const params = {
            pageParam: {
                ...opLogTimeCondition.pageParam,
                currentPage: page
            }

        }
        findLogPageByTime(params)
    };

    /**
     * 时间范围选择
     */
    const changeData = (dateValue) => {
        let values = {}
        if(dateValue){
            values = {
                timestamp: [dateValue[0].format('YYYY-MM-DD'), dateValue[1].format('YYYY-MM-DD')]
            }
        }else {
            values = {
                timestamp: null
            }
        }
        
        findLogPageByTime(values)

    }

    return <>
        <div className="other-title">
            事项动态
        </div>
        <div className="work-dynamic" ref = {workDynamic}>
            {
                logTimeList && logTimeList.length > 0 ? <WorkDynamicTimeAxis logList={logTimeList} workId={workId} /> :
                    <ProjectEmpty description={"暂无动态"} />
            }
        </div>

    </>


}
export default observer(WorkDynamic);