import React, { useEffect, useState } from 'react';
import "./WorkItemSurvey.scss";
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import HomeStore from '../store/HomeStore';
import WorkStore from '../../../work/store/WorkStore';
import { setWorkDeatilInList } from '../../../work/components/WorkSearch';


const WorkItemSurvey = (props) => {
    const { statisticsWorkItemByStatus } = HomeStore;
    const { setSearchCondition, findStateNodeList, quickFilterValue, setQuickFilterValue } = WorkStore;
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


    return (
        <div className="statistics-workitem">
            <div className="statistics-workitem-title">
                事项概况
            </div>
            <div className="statistics-workitem-content">
                <div className="statistics-workitem-box" onClick={() => selectMenu("pending")}>
                    <div>{workItemCount.remain}</div>
                    <div>未完成</div>
                </div>
                <div className="statistics-workitem-box" onClick={() => selectMenu("progress")}>
                    <div>{workItemCount.progress}</div>
                    <div>进行中</div>
                </div>
                <div className="statistics-workitem-box" onClick={() => selectMenu("todo")}>
                    <div>{workItemCount.todo}</div>
                    <div>未开始</div>
                </div>
                <div className="statistics-workitem-box" onClick={() => selectMenu("overdue")}>
                    <div>{workItemCount.overdue}</div>
                    <div>逾期</div>
                </div>
            </div>

        </div>
    )
}
export default withRouter(inject("homeStore")(observer(WorkItemSurvey)));