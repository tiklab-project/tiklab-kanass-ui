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

    return <>
        <div className="work-dynamic" ref = {workDynamic}>
            <WorkDynamicTimeAxis workId={workId} workDynamicStore={WorkDynamicStore}/>
        </div>

    </>


}
export default observer(WorkDynamic);