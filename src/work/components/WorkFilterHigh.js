/*
 * @Descripttion: 事项详情页面的高级筛选组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:40:46
 */
import React, { useEffect, useState, useRef } from "react";
import {Form, DatePicker, Select, Space, Dropdown, Menu} from 'antd';
import Button from "../../common/button/Button";
import moment from 'moment';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
import { finWorkList } from "./WorkGetList"
import {searchWorkList, setWorkDeatilInList} from "./WorkSearch";
import WorkFilterHighItem from "./WorkFilterHighItem";
import "./WorkFilterHigh.scss"
import {PlusOutlined} from "@ant-design/icons";
import {getUser} from "tiklab-core-ui";

const WorkFilterHigh = (props) => {
    // 查找表单
    const [form] = Form.useForm();
    const { workStore, labelHidden, setFiltetModal } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const project = JSON.parse(localStorage.getItem("project"));
    const projectType = projectId ? project?.projectType?.type : "scrum";
    const [moreFilterValue, setMoreFilterValue] = useState([]);
    const [dropDownVisible, setDropDownVisible] = useState(false);
    const path = props.match.path;
    const userId = getUser().userId;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const heightFilter = useRef()
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 24 }
    };
    // 解析store数据
    const { workShowType, priorityList, findPriority, findSprintList, sprintList,
        getModuleList, moduleList, searchCondition, getWorkStatus, workStatusList,
        getSelectUserList, userList, setSearchConditionNull, tabValue, findVersionList,
        versionList, setTabValue, setQuickFilterValue, findStateNodeList, setSearchCondition } = workStore;

    /**
     * 获取事项各个属性列表
     */
    useEffect(() => {
        findPriority()
        findSprintList(projectId)
        findVersionList(projectId)
        getModuleList(projectId)
        getWorkStatus()
        getSelectUserList(projectId);
        return;
    }, [])

    useEffect(() => {
        initForm()
        return;
    }, [searchCondition])

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
     * 监听表单变化
     */
    const changeField = (changedValues, allValues) => {
        const field = Object.keys(changedValues)[0];
        let value;
        console.log("changeField    " + JSON.stringify(changedValues))
        if (field === "workQuickFilter"){
            getWorkStatusRangeWorkItem({value: changedValues.workQuickFilter})
            return
        }
        switch (field) {
            case "createdDate":
                value = {
                    buildTimeStart: changedValues.createdDate ? changedValues.createdDate[0].format('YYYY-MM-DD') : null,
                    buildTimeEnd: changedValues.createdDate ? changedValues.createdDate[1].format('YYYY-MM-DD') : null
                }
                break;
            case "updateDate":
                value = {
                    updateTimeStart: changedValues.updateDate ? changedValues.updateDate[0].format('YYYY-MM-DD') : null,
                    updateTimeEnd: changedValues.updateDate ? changedValues.updateDate[1].format('YYYY-MM-DD') : null
                }
                break;
            case "planStartDate":
                value = {
                    planStartDateStart: changedValues.planStartDate ? changedValues.planStartDate[0].format('YYYY-MM-DD') : null,
                    planStartDateEnd: changedValues.planStartDate ? changedValues.planStartDate[1].format('YYYY-MM-DD') : null
                }
                break;
            case "planEndDate":
                value = {
                    planEndDateStart: changedValues.planEndDate ? changedValues.planEndDate[0].format('YYYY-MM-DD') : null,
                    planEndDateEnd: changedValues.planEndDate ? changedValues.planEndDate[1].format('YYYY-MM-DD') : null
                }
                break;
            case "workPriorityIds":
                value = {
                    workPriorityIds: changedValues.workPriorityIds,
                }
                break;
            case "currentSprintIds":
                value = {
                    currentSprintIds: changedValues.currentSprintIds,
                }
                break;
            case "currentVersionIds":
                value = {
                    currentVersionIds: changedValues.currentVersionIds,
                }
                break;
            case "moduleIds":
                value = {
                    moduleIds: changedValues.moduleIds,
                }
                break;
            case "builderIds":
                value = {
                    builderIds: changedValues.builderIds,
                }
                break;
            case "assignerIds":
                value = {
                    assignerIds: changedValues.assignerIds,
                }
                break;
            case "workStatusIds":
                value = {
                    workStatusIds: changedValues.workStatusIds,
                }
                break;
            default:
                break;
        }
        value = {
            ...value,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        }

        findWorkItem(value)

    };

    /**
     * 获取事项状态范围对应的查询参数
     * @param value   {{value}}
     */
    const getWorkStatusRangeWorkItem = (value) => {
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
            assignerId: null,
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
            assignerId: userId,
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
            assignerId: userId,
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
            assignerId: null,
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
            builderId: userId,
            assignerId: userId,
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
     * 重置筛选条件
     */
    const resetFilter = () => {
        form.resetFields()
        setSearchConditionNull()
        setMoreFilterValue([])
        setQuickFilterValue(null)
        setTabValue({
            id: "all",
            type: "system",
            value: null,
            label: null
        })
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            workTypeId: tabValue?.id === "all" ? null : tabValue?.id
        }
        finWorkList(path, workStore, params)
    }

    /**
     * 查找事项
     */
    const findWorkItem = (value) => {
        searchWorkList(workStore, value)
    }

    const dateFormat = "YYYY-MM-DD"

    /**
     * 初始化表单
     */
    const initForm = () => {
        form.setFieldsValue({
            workStatusIds: searchCondition.workStatusIds,
            builderIds: searchCondition.builderIds,
            createdDate: searchCondition.buildTimeEnd ? [moment(searchCondition.buildTimeStart, dateFormat), moment(searchCondition.buildTimeEnd, dateFormat)] : null,
            planStartDate: searchCondition.planStartDateStart ? [moment(searchCondition.planStartDateStart, dateFormat), moment(searchCondition.planStartDateEnd, dateFormat)] : null,
            planEndDate: searchCondition.planEndDateStart ? [moment(searchCondition.planEndDateStart, dateFormat), moment(searchCondition.planEndDateEnd, dateFormat)] : null,
            workPriorityIds: searchCondition.workPriorityIds,
            currentSprintIds: searchCondition.currentSprintIds,
            currentVersionIds: searchCondition.currentVersionIds,
            moduleIds: searchCondition.moduleIds
        })
    }

    /**
     * 添加筛选条件
     */
    const addFilter = (value) => {
        console.log(value)
        setMoreFilterValue(value)
    }

    const handleMenuClick = (menu) => {
        const filterId = menu.key;// 筛选条件id
        setMoreFilterValue(prev => {
            // 使用新数组而不是修改原数组
            return prev.includes(filterId)
                ? prev.filter(item => item !== filterId) // 删除id
                : [...prev, filterId]; // 添加id
        });
    }

    /**
     * 隐藏的筛选条件选项
     */
    const selectArray = [
        { value: 'createdDate', label: '创建日期' },
        { value: 'updateDate', label: '更新日期' },
        { value: 'planStartDate', label: '计划开始日期' },
        { value: 'planEndDate', label: '计划结束日期' },
        { value: 'workPriorityIds', label: '优先级' },
        { value: 'moduleIds', label: '所属模块' },
    ]

    const menu = (
        <Menu
            selectedKeys={moreFilterValue}
            onClick={handleMenuClick}
        >
            {selectArray.map(item => (
                <Menu.Item key={item.value}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        width: "250px" ,
                        justifyContent: "space-between"
                    }}>
                        {item.label}
                        {
                            moreFilterValue.includes(item.value) &&
                            <span>✓</span>
                        }

                     </div>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div className={`height-filter ${workShowType === "table" ? "":"less-margin"}`} ref={heightFilter}>
            <div className="height-filter-content">
                <Form
                    form={form}
                    name="control-hooks"
                    layout="vertical"
                    className="workitem-filter-height"
                    labelAlign="left"
                    onValuesChange={(changedValues, allValues) => changeField(changedValues, allValues)}
                    {...formItemLayout}

                >
                    <Form.Item name="workQuickFilter" label={labelHidden ? null : "快速筛选"} rules={[{ required: false }]} >
                        <Select
                            placeholder="快速筛选"
                            className="work-select"
                            key="workQuickFilter"
                            maxTagCount={1}
                            getPopupContainer={() => heightFilter.current}
                            showArrow = {true}
                            style={{backgroundColor: '#f0f0f0'}}
                        >
                            {
                                quickFilterList && quickFilterList.map((item) => {
                                    return <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    {
                        workShowType === "list" && <>
                            <Form.Item name="workStatusIds" label={labelHidden ? null : "状态"} rules={[{ required: false }]} >
                                <Select
                                    mode="multiple"
                                    placeholder="状态"
                                    className="work-select"
                                    key="workStatusIds"
                                    maxTagCount={1}
                                    getPopupContainer={() => heightFilter.current}
                                    showArrow = {true}
                                    style={{backgroundColor: '#f0f0f0'}}
                                >
                                    {
                                        workStatusList && workStatusList.map((item) => {
                                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </>

                    }

                    <Form.Item name="builderIds" label={labelHidden ? null : "创建人"} rules={[{ required: false }]} >
                        <Select
                            mode="multiple"
                            placeholder="创建人"
                            className="work-select"
                            key="builderIds"
                            maxTagCount={1}
                            getPopupContainer={() => heightFilter.current}
                            showArrow = {true}
                            style={{backgroundColor: '#f0f0f0'}}
                        >
                            {
                                userList && userList.map((item) => {
                                    return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item name="assignerIds" label={labelHidden ? null : "负责人"} rules={[{ required: false }]} >
                        <Select
                            mode="multiple"
                            placeholder="负责人"
                            className="work-select"
                            key="assignerIds"
                            maxTagCount={1}
                            getPopupContainer={() => heightFilter.current}
                            showArrow = {true}
                            style={{backgroundColor: '#f0f0f0'}}
                        >
                            {
                                userList && userList.map((item) => {
                                    return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    {
                        (projectType === "scrum" && !sprintId) &&
                        <Form.Item name="currentSprintIds" label={labelHidden ? null : "所属迭代"} style={{ minWidth: '70px', flex: 1 }} rules={[{ required: false }]} >
                            <Select
                                mode="multiple"
                                placeholder="所属迭代"
                                className="work-select"
                                key="sprint"
                                maxTagCount={1}
                                getPopupContainer={() => heightFilter.current}
                                showArrow = {true}
                                style={{backgroundColor: '#f0f0f0'}}
                            >
                                {
                                    sprintList && sprintList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }
                    {
                        !versionId &&
                        <Form.Item
                            name="currentVersionIds"
                            label={labelHidden ? null : "所属版本"}
                            style={{ minWidth: '70px', flex: 1 }}
                            rules={[{ required: false }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="所属版本"
                                className="work-select"
                                key="version"
                                maxTagCount={1}
                                getPopupContainer={() => heightFilter.current}
                                showArrow = {true}
                                style={{backgroundColor: '#f0f0f0'}}
                            >
                                {
                                    versionList && versionList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }

                    {
                        moreFilterValue.map(item => {
                            return (
                                <WorkFilterHighItem
                                    labelHidden={labelHidden}
                                    priorityList={priorityList}
                                    moduleList={moduleList}
                                    heightFilter={heightFilter}
                                    filterKey={item}
                                />
                            )
                        })
                    }

                    <div className="workitem-filter-height-more">
                        <Dropdown
                            overlay={menu}
                            visible={dropDownVisible}
                            onVisibleChange={(visible) => setDropDownVisible(visible)}
                            trigger={['click']}
                            placement="bottomLeft"
                            getPopupContainer={() => heightFilter.current}
                        >
                            <Space>
                                <PlusOutlined />
                                <span>更多条件</span>
                            </Space>

                        </Dropdown>
                    </div>
                </Form>
            </div>


            <div className="workitem-filter-height-buttom">
                <div className="workitem-filter-height-botton">
                    <Button onClick={() => resetFilter()}>重置</Button>
                    <Button onClick={() => setFiltetModal(false)}>取消</Button>
                    <Button type="primary" onClick={() => setFiltetModal(false)}>确定</Button>
                </div>

            </div>
        </div>

    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkFilterHigh)));