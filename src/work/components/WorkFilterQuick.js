import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterQuick.scss"
import { getUser } from "thoughtware-core-ui";
import { setWorkDeatilInList } from "./WorkSearch";

const WorkFilterQuick = (props) => {
    const { workStore, heightFilter } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const { setSearchCondition, findStateNodeList, quickFilterValue, setQuickFilterValue,
        viewType, getWorkConditionPage, getWorkConditionPageTree,
        workShowType, setWorkIndex, setWorkId, eveWorkTypeNum, setSearchType } = workStore;


    const userId = getUser().userId;

    const quickFilterList = [
        {
            value: "all",
            label: "全部"
        },
        {
            value: "pending",
            label: "我的待办"
        },
        {
            value: "ending",
            label: "我的已办"
        },
        {
            value: "creat",
            label: "我创建的"
        },
        {
            value: "overdue",
            label: "已逾期"
        }
    ]

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
        let data = value;
        setQuickFilterValue(value)

        data = value.value;
        setSearchType(data)
        if (!value) {
            getAllWorkItem();
            return
        } else {
            switch (data) {
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
        setSearchType("all")

    }

    const getAllWorkItem = () => {
        const initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },

        }
        setSearchCondition(initValues)
        getWorkList(initValues);
    }

    const getPendingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ quickName: "pending" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    const getEndingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ quickName: "done" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    const getCreatWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: userId,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues);
        getWorkList(initValues);
    }

    const getOverdueWorkItem = () => {
        let initValues = {
            sprintId: sprintId,
            overdue: true,
            builderId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        getWorkList(initValues);
    }

    const getWorkList = (initValues) => {
        setWorkDeatilInList(workStore, initValues)
    }


    return (<div className="work-quick-filter">
        <SelectSimple name="quickFilter"
            onChange={(value) => selectMenu(value)}
            title={`全部`}
            ismult={false}
            value={quickFilterValue}
            suffixIcon={true}
        >
            {
                quickFilterList.map(item => {
                    return <SelectItem
                        value={item.value}
                        label={`${item.label}`}
                        key={item.value}

                    />
                })
            }
        </SelectSimple>

    </div>

    )
}
export default withRouter(inject("workStore")(observer(WorkFilterQuick)));