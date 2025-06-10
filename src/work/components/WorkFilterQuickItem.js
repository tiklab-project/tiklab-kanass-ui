/*
 * @Descripttion: 事项详情页面的快捷筛选组件  不带下拉框的版本
 */
import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterQuickItem.scss"
import { getUser } from "tiklab-core-ui";
import { setWorkDeatilInList } from "./WorkSearch";
import { Input, Radio, Space } from 'antd';

const WorkFilterQuickItem = (props) => {
    const { workStore } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const { setSearchCondition, findStateNodeList, quickFilterValue, setQuickFilterValue} = workStore;

    const userId = getUser().userId;

    const quickFilterList = [
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

    /**
     * 根据条件获取状态节点列表
     */
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

    /**
     * 选择快捷筛选条件
     */
    const selectMenu = (value) => {
        setQuickFilterValue(value.value)
        console.log("筛选条件++++++" + JSON.stringify(value))
        if (!value) {
            getAllWorkItem();
            return
        } else {
            let data = value.value;
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

    }

    /**
     * 获取全部事项
     */
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

    /**
     * 获取待办事项
     */
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

    /**
     * 获取已办事项
     */
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

    /**
     * 获取我创建的事项
     */
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

    /**
     * 获取已逾期的事项
     */
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

    /**
     * 获取事项列表
     */
    const getWorkList = (initValues) => {
        setWorkDeatilInList(workStore, initValues)
    }


    return (
        <div className="work-quick-filter-item">
            <Radio.Group
                value={quickFilterValue}
                onChange={(e) => selectMenu({ value: e.target.value })}
                optionType="button"
                buttonStyle="solid"
            >
                <Space direction="vertical">
                    {quickFilterList.map(item => (
                        <Radio key={item.value} value={item.value}>
                            {item.label}
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>
        </div>
    )
}
export default withRouter(inject("workStore")(observer(WorkFilterQuickItem)));