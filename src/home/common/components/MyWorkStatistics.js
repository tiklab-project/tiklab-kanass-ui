import React, { Fragment, useEffect, useState } from 'react';
import "./MyWorkStatistics.scss";

const MyWorkStatistics = (props) => {
    const { statWorkItemByBusStatus } = props;
    const [workStatusList, setWorkStatusList] = useState();
     useEffect(() => {
        // StatWorkItemByBusStatus().then(res => {
        //     setWorkStatusList(res.data)
        // })
        statWorkItemByBusStatus().then(res => {
            if(res.code === 0) {
                setWorkStatusList(res.data)
            }
        })
     },[])

     const goWorkItemList = (index) => {
        // setWorkTabs("all")

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