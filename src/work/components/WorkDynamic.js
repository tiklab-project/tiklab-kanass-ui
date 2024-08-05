/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-03 16:36:24
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-03 18:23:31
 */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import "./WorkDynamic.scss"
import { Empty } from 'antd';
import "./WorkDynamic.scss";
import WorkDynamicStore from '../store/WorkDynamicStore';
import DynamicListItem from "../../common/overviewComponent/DynamicItem"
import DyncmicTimeAxis from "../../project/overview/components/DyncmicTimeAxis";
const WorkDynamic = (props) => {
    const { workStore } = props;
    const { findLogpage, logList } = WorkDynamicStore;
    const { workId } = workStore;
    const [list, setList] = useState([])
    useEffect(() => {
        findLogpage({data: { workItemId: workId }})
    }, [workId])

    return <>
        <div className="work-dynamic">
            {
                logList && logList.length > 0 ? <DyncmicTimeAxis logList = {logList} /> :
                    <Empty />
            }
        </div>

    </>


}
export default observer(WorkDynamic);