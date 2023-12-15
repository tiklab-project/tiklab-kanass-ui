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
const WorkDynamic = (props) => {
    const { workStore } = props;
    const { findlogpage } = WorkDynamicStore;
    const { workId } = workStore;
    const [list, setList] = useState([])
    useEffect(() => {
        findlogpage({ workItemId: workId }).then(data => {
            if (data.code === 0) {
                setList(data.data.dataList)
            }

        })
        return;
    }, [workId])

    return <>
        <div className="work-dynamic">
            {
                list && list.length > 0 ? list.map(item => {
                    return <DynamicListItem content = {item.data} type = {item.actionType.id} />
                }) :
                    <Empty />
            }
        </div>

    </>


}
export default observer(WorkDynamic);