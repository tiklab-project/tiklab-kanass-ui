import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import { Select } from 'antd';

const WorkQuickFilter = (props) => {
    const { workStore, heightFilter } = props;
    const projectId = JSON.parse(localStorage.getItem("project"))?.id;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const { setSearchCondition, findStateNodeList,quickFilterValue, setQuickFilterValue,
        findDmFlowList, viewType, getWorkConditionPage, getWorkConditionPageTree,
        workShowType, setWorkIndex, setWorkId } = workStore;
    const [flowIds, setFlowIds] = useState();
    useEffect(() => {
        findDmFlowList({ domainId: projectId }).then(res => {
            if (res.code === 0) {
                const list = [];
                res.data.map(item => {
                    list.push(item.flow.id)
                })
                setFlowIds(list)
            }
        })

        return;
    }, [])
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
        const newStateNodeList = stateNodeList.filter((item, index) => {
            return stateNodeList.indexOf(item) === index;  // 因为indexOf 只能查找到第一个  
        });

        return newStateNodeList;
    }

    const selectMenu = (value) => {
        let data = value;
        if( workShowType !== "list"){
            setQuickFilterValue(value)
            data = value.value;
        }
        
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

    const getAllWorkItem = () => {
        const initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            workStatusIds: []
        }
        setSearchCondition(initValues)
        getWorkList();
    }

    const getPendingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ inNodeStatus: ['TODO', 'PROGRESS'], inFlowIds: flowIds }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList();
        })
    }

    const getEndingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ nodeStatus: 'DONE', inFlowIds: flowIds }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList();
        })
    }

    const getCreatWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues);
        getWorkList();
    }

    const getOverdueWorkItem = () => {
        let initValues = {
            sprintId: sprintId,
            overdue: true,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        getWorkList();
    }

    const getWorkList = () => {
        if (viewType === "tile") {
            getPageList();
        } else if (viewType === "tree") {
            getPageTree();
        }
    }

    const getPageTree = (value) => {
        getWorkConditionPageTree(value).then((res) => {
            if (res.dataList.length > 0) {
                if (workShowType === "list") {
                    setWorkIndex(1)
                    setWorkId(res.dataList[0].id)
                }
            } else {
                setWorkIndex(0)
                setWorkId(0)
            }
        })
    }

    const getPageList = (value) => {
        getWorkConditionPage(value).then((res) => {
            if (res.dataList.length > 0) {
                if (workShowType === "list") {
                    setWorkIndex(1)
                    setWorkId(res.dataList[0].id)
                }
            } else {
                setWorkIndex(0)
                setWorkId(0)
            }
        })
    }

    return (<>
        {
            workShowType === "list" ? <Select
                // mode="multiple"
                placeholder="快速筛选"
                className="work-select"
                key="quickFilter"
                maxTagCount={1}
                getPopupContainer={() => heightFilter.current}
                onChange={(value) => selectMenu(value)}
            >
                {
                    quickFilterList && quickFilterList.map((item) => {
                        return <Select.Option value={item.value} key={item.label}>{item.name}</Select.Option>
                    })
                }
            </Select>
            :
            <SelectSimple name="quickFilter"
                onChange={(value) => selectMenu(value)}
                title={"所有"}
                ismult={false}
                selectValue={quickFilterValue}
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

        }

    </>

    )
}
export default withRouter(inject("workStore")(observer(WorkQuickFilter)));