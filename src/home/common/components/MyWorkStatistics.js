/*
 * @Descripttion: 我的事项统计数量
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { Fragment, useEffect, useState } from 'react';
import "./MyWorkStatistics.scss";

const MyWorkStatistics = (props) => {
    const { statWorkItemByBusStatus } = props;
    // 各个状态事项数量统计列表
    const [workStatusList, setWorkStatusList] = useState();
     useEffect(() => {
        /**
         * 获取各个状态事项数量统计列表
         */
        statWorkItemByBusStatus().then(res => {
            if(res.code === 0) {
                setWorkStatusList(res.data)
            }
        })
     },[])

     /**
      * 跳转到不同事项列表
      * @param {列表顺序} index 
      */
     const goWorkItemList = (index) => {
        switch (index) {
            case 0:
                props.history.push({ pathname: "/index/work/worklist/all"})
                break;
            case 1:
                props.history.push({ pathname: "/index/work/worklist/done"})
                break;
            case 2:
                props.history.push({ pathname: "/index/work/worklist/process"});
                break
            case 3:
                props.history.push({ pathname: "/index/work/worklist/overdue"})
                break;
            default:
                break;
        }
        sessionStorage.setItem("menuKey", "work")

    }

    return <div className="work-statistics">
            <div className="work-statistics-title">
                <span>我的事项</span>
            </div>
            <div className="work-statistics-list">
                {
                    workStatusList && workStatusList.map((item, index) => {
                        return <div className="work-statistics-item" key={index} onClick={() => goWorkItemList(index)}>
                            {/* <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-zhuti"></use>
                            </svg> */}
                            <div className="work-count">
                                <div className="work-num">{item.groupCount}</div>
                                <div className="work-text">{item.statusName}</div>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>

}
export default MyWorkStatistics;