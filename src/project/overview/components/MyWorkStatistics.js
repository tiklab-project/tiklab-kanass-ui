/* @Descripttion: 项目事项统计组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 18:00:13
 */

import React, { Fragment, useEffect, useState } from 'react';
import "./MyWorkStatistics.scss";
const MyWorkStatistics = (props) => {
    const { workStatusList, projectId } = props;
    const path = props.match.path.split("/")[2];

    /**
     * 点击跳转到工作列表
     * @param {tab key} index 
     */
    const goWorkItemList = (index) => {
        switch (index) {
            case 0:
                goAllWorkItemList();
                break;
            case 1:
                goTodoWorkItemList()
                break;
            case 2:
                goDoneWorkItemList()
                break;
            case 3:
                goProcess();
                break;
            case 4:
                props.history.push({ pathname: `/index/${path}/${projectId}/work/overdue` })
            default:
                break;
        }
    }

    /**
     * 跳转到全部事项列表
     */
    const goAllWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/work/all`)
    }

    /**
     * 跳转到进行中事项列表
     */
    const goProcess = () => {
        props.history.push({ pathname: `/index/${path}/${projectId}/work/process` })
    }

    /**
     * 跳转到待办事项列表
     */
    const goTodoWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/work/workTodo`)
    }

    /**
     * 跳转到已完成事项列表
     */
    const goDoneWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/work/done`)
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