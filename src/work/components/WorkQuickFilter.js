import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";

const WorkQuickFilter = (props) => {
    const { workStore, getWorkList, flowIds } = props;
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const { setSearchCondition, setWorkId, setWorkIndex, 
        statWorkItemOverdue, findStateNodeList, setQuickFilterValue, quickFilterValue } = workStore;

    const quickFilterList = [
        {
            value: "all",
            name: "所有"
        },
        {
            value: "pending",
            name: "我的待办"
        },
        {
            value: "ending",
            name: "我的已办"
        },
        {
            value: "creat",
            name: "我创建的"
        },
        {
            value: "overdue",
            name: "已逾期"
        }
    ]

    const getStateNodeList = async (value) => {
        const stateNodeList = []
        await findStateNodeList(value).then(res => {
            if (res.code === 0) {
                if (res.data.length > 0) {
                    res.data.map(item => {
                        stateNodeList.push(item.node.id)
                    })
                }
            }
        })
        const newStateNodeList = stateNodeList.filter((item,index) =>{
            return stateNodeList.indexOf(item) === index;  // 因为indexOf 只能查找到第一个  
         });
       
        return newStateNodeList;
    }

    const selectMenu = (values) => {
        setQuickFilterValue(values)
        switch (values.value) {
            case "all":
                getAllWorkItem();
                break;
            case "pending":
                getPendingWorkItem();
                break;
            case "ending":
                getEndingWorkItem();
                break;
            case "creat":
                getCreatWorkItem();
                break;
            case "overdue":
                getOverdueWorkItem();
                break;
            default:
                break;

        }
    }

    const getAllWorkItem = () => {
        const initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            workStatusIds: []
        }
        setSearchCondition(initValues)
        // initFrom(initValues)
        getWorkList();

    }

    const getPendingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ inNodeStatus: ['TODO', 'PROGRESS'], inFlowIds: flowIds }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            console.log(initValues)
            setSearchCondition(initValues)
            getWorkList();
        })
    }

    const getEndingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ nodeStatus: 'DONE', inFlowIds: flowIds }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues)
            getWorkList();
        })
    }

    const getCreatWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        // initFrom(initValues)
        getWorkList();
    }

    const getOverdueWorkItem = () => {
        let initValues = {
            sprintId: sprintId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        // initFrom(initValues)
        statWorkItemOverdue({ projectId: projectId, sprintId: sprintId }).then(res => {
            if (res.dataList.length > 0) {
                setWorkId(res.dataList[0].id)
                setWorkIndex(1)
            }

        })
    }


    return (
        <SelectSimple name="quickFilter"
            onChange={(value) => selectMenu(value)}
            title={"所有"} 
            ismult={false}
            selectValue = {quickFilterValue}
        >
            {
                quickFilterList.map(item => {
                    return <SelectItem
                        value={item.value}
                        label={item.name}
                        key={item.value}

                    />
                })
            }
        </SelectSimple>
    )
}
export default withRouter(inject("workStore")(observer(WorkQuickFilter)));