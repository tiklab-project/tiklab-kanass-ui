/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-03 16:36:24
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-03 18:23:31
 */
import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import "./WorkDynamic.scss"
import { DatePicker, Empty } from 'antd';
import "./WorkDynamic.scss";
import WorkDynamicStore from '../store/WorkDynamicStore';
import DynamicListItem from "../../common/overviewComponent/DynamicItem"
import DyncmicTimeAxis from "../../project/overview/components/DyncmicTimeAxis";
import ProjectEmpty from "../../common/component/ProjectEmpty";
import PaginationCommon from "../../common/page/Page";

const { RangePicker } = DatePicker;
const WorkDynamic = (props) => {

    const { workStore } = props;
    const { logTimeList, findLogPageByTime, opLogTimeCondition } = WorkDynamicStore;
    const { workId } = workStore;
    const workDynamic = useRef();
    useEffect(() => {
        findLogPageByTime({ data: { workItemId: workId } })
    }, [workId])

    const onPageChange = (page) => {
        const params = {
            pageParam: {
                ...opLogTimeCondition.pageParam,
                currentPage: page
            }

        }
        findLogPageByTime(params)
    };

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
        <div className="work-dynamic" ref = {workDynamic}>
            <div className="work-dynamic-top">
                <div className="work-dynamic-title">共{opLogTimeCondition.pageParam.total}个</div>
                <RangePicker

                    format={'YYYY/MM/DD'}
                    onChange={changeData}
                    getPopupContainer = {()=> workDynamic.current}
                />
            </div>
            {
                logTimeList && logTimeList.length > 0 ? <DyncmicTimeAxis logList={logTimeList} /> :
                    <ProjectEmpty description={"暂无动态"} />
            }
            <PaginationCommon

                currentPage={opLogTimeCondition.pageParam.currentPage}
                changePage={(currentPage) => onPageChange(currentPage)}
                totalPage={opLogTimeCondition.pageParam.totalPage}
                total={opLogTimeCondition.pageParam.total}
                showRefer={false}
            />
        </div>

    </>


}
export default observer(WorkDynamic);