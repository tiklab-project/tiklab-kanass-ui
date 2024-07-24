import React, { useEffect, useState } from 'react';
import "./WorkItemSurvey.scss";
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import HomeStore from '../store/HomeStore';
import WorkStore from '../../../work/store/WorkStore';
import { setWorkDeatilInList } from '../../../work/components/WorkSearch';


const WorkItemSurvey = (props) => {
    const { statisticsWorkItemByStatus } = HomeStore;
    const { setSearchCondition, findStateNodeList, setQuickFilterValue } = WorkStore;
    const [workItemCount, setWorkItemCount] = useState({});

    useEffect(() => {
        statisticsWorkItemByStatus().then(res => {
            if (res.code === 0) {
                setWorkItemCount(res.data)
            }
        })

        return;
    }, [])

    const getStateNodeList = async (value) => {
        const stateNodeList = []
        await findStateNodeList(value).then(res => {
            if (res.code === 0) {
                if (res.data.length > 0) {
                    res.data.map(item => {
                        stateNodeList.push(item.id)
                    })
                }
            }
        })
        const newStateNodeList = stateNodeList.filter((item, index) => {
            return stateNodeList.indexOf(item) === index;  // 因为indexOf 只能查找到第一个  
        });

        return newStateNodeList;
    }

    const selectMenu = (value) => {
        switch (value) {
            case "pending":
                getPendingWorkItem();
                break;
            case "todo":
                getTodoWorkItem();
                break;
            case "progress":
                getProgressWorkItem();
                break;
            case "overdue":
                getOverdueWorkItem();
                break;
            default:
                break;
        }

    }


    const getPendingWorkItem = () => {
        let initValues = {
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setQuickFilterValue({
            value: "pending",
            label: "我的待办"
        })
        getStateNodeList({ quickName: "pending" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    const getTodoWorkItem = () => {
        let initValues = {
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setQuickFilterValue({
            value: "all",
            label: "全部"
        })
        getStateNodeList({ quickName: "todo" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    const getProgressWorkItem = () => {
        let initValues = {
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setQuickFilterValue({
            value: "all",
            label: "全部"
        })
        getStateNodeList({ quickName: "progress" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    const getOverdueWorkItem = () => {
        let initValues = {
            overdue: true,
            builderId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setQuickFilterValue({
            value: "overdue",
            label: "已逾期"
        })
        setSearchCondition(initValues)
        getWorkList(initValues);
    }

    const getWorkList = (initValues) => {
        setWorkDeatilInList(WorkStore, initValues)
        sessionStorage.setItem("menuKey", "work")
        props.history.push("/workTable")

    }

    const data = [
        {
            id: "remain",
            name: "未完成",
            icon: "allwork",
            code: "pending"
        },
        {
            id: "progress",
            name: "进行中",
            icon: "progress",
            code: "progress"
        },
        {
            id: "todo",
            name: "未开始",
            icon: "endwork",
            code: "todo"
        },
        {
            id: "overdue",
            name: "逾期",
            icon: "overdue",
            code: "overdue"
        }
    ]
    return (
        <div className="statistics-workitem">
            <div className="statistics-workitem-title">
                事项概况
            </div>
            <div className="statistics-workitem-content">
                {
                    data.map(item => {
                        return <div 
                            id = {item.id}
                            className="statistics-workitem-box" 
                            onClick={() => selectMenu(item.icon)}
                        >
                            <svg className="icon-40" aria-hidden="true">
                                <use xlinkHref={`#icon-${item.icon}`}></use>
                            </svg>
                            <div className="statistics-workitem-box-right">
                                <div className="statistics-workitem-box-num">{workItemCount[item.id]}</div>
                                <div className="statistics-workitem-box-name">{item.name}</div>
                            </div>

                        </div>
                    })
                }

            </div>

        </div>
    )
}
export default withRouter(inject("homeStore")(observer(WorkItemSurvey)));