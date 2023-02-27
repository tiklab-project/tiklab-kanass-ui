import React, { Fragment, useEffect, useState } from 'react';
import { getUser } from 'tiklab-core-ui';
import "./MyWorkStatistics.scss";
//import "../../assets/font-icon/iconfont";
const MyWorkStatistics = (props) => {
    const { workStatusList, projectId } = props;
    const masterId = getUser().userId;
    const path = props.match.path.split("/")[2];
    // useEffect(() => {
    //     statWorkItemByBusStatus(projectId, masterId).then(res => {
    //         setWorkStatusList(res.data)
    //     })
    // },[])

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

    const goAllWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/work/all`)
    }


    const goProcess = () => {
        props.history.push({ pathname: `/index/${path}/${projectId}/work/process` })
    }

    const goTodoWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/work/workTodo`)
    }


    const goDoneWorkItemList = () => {
        props.history.push(`/index/${path}/${projectId}/work/done`)
    }

    //  const goWorkItemList = (index) => {
    //     // setWorkTabs("all")

    //     switch (index) {
    //         case 0:
    //             props.history.push({ pathname: "/index/work/worklist/all"})
    //             break;
    //         case 1:
    //             props.history.push({ pathname: "/index/work/worklist/done"})
    //             break;
    //         case 2:
    //             props.history.push({ pathname: "/index/work/worklist/process"});
    //             break
    //         case 3:
    //             props.history.push({ pathname: "/index/work/worklist/overdue"})
    //             break;
    //         default:
    //             break;
    //     }
       
    //     sessionStorage.setItem("menuKey", "work")

    // }

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