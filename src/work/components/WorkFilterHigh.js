import React, { useEffect, useState, useRef } from "react";
import { Form, DatePicker, Select } from 'antd';
import Button from "../../common/button/Button";
import moment from 'moment';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
import WorkFilterQuick from "./WorkFilterQuick"
import { finWorkList } from "./WorkGetList"
import { searchWorkList } from "./WorkSearch";
const { RangePicker } = DatePicker;
const WorkFilterHigh = (props) => {
    // 查找表单
    const [form] = Form.useForm();
    const { workStore, labelHidden, setFiltetModal } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const path = props.match.path;
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
        getSelectUserList, userList, setSearchConditionNull, tabValue, eveWorkTypeNum } = workStore;

    useEffect(() => {
        findPriority()
        findSprintList(projectId)
        getModuleList(projectId)
        getWorkStatus()
        getSelectUserList(projectId);
        return;
    }, [])

    useEffect(() => {
        initForm()
        return;
    }, [searchCondition])


    //查找事务
    const changeField = (changedValues, allValues) => {
        const field = Object.keys(changedValues)[0];
        let value;
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
            case "currentSprintId":
                value = {
                    currentSprintIds: changedValues.currentSprintId,
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

    const resetFilter = () => {
        form.resetFields()
        setSearchConditionNull()
        
        const params = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            workTypeId: tabValue?.id === "all" ? null : tabValue?.id 
        }
        finWorkList(path, workStore, params)
    }

    const findWorkItem = (value) => {
        searchWorkList(workStore, value)
    }
    const dateFormat = "YYYY-MM-DD"
    const initForm = () => {
        form.setFieldsValue({
            workStatusIds: searchCondition.workStatusIds,
            builderIds: searchCondition.builderIds,
            createdDate: searchCondition.buildTimeEnd ? [moment(searchCondition.buildTimeStart, dateFormat), moment(searchCondition.buildTimeEnd, dateFormat)] : null,
            planStartDate: searchCondition.planStartDateStart ? [moment(searchCondition.planStartDateStart, dateFormat), moment(searchCondition.planStartDateEnd, dateFormat)] : null,
            planEndDate: searchCondition.planEndDateStart ? [moment(searchCondition.planEndDateStart, dateFormat), moment(searchCondition.planEndDateEnd, dateFormat)] : null,
            workPriorityIds: searchCondition.workPriorityIds,
            currentSprintId: searchCondition.currentSprintId,
            moduleIds: searchCondition.moduleIds
        })
    }

    return (
        <div className="height-filter" ref={heightFilter}>
            <Form
                form={form}
                name="control-hooks"
                layout="vertical"
                className="workitem-filter-height"
                labelAlign="left"
                onValuesChange={(changedValues, allValues) => changeField(changedValues, allValues)}
                {...formItemLayout}

            >
                {
                    workShowType === "list" && <>
                        {/* <Form.Item name="quickFilter" label={labelHidden ? null : "快速筛选"} rules={[{ required: false }]} >
                            <WorkFilterQuick heightFilter={heightFilter} />
                        </Form.Item> */}

                        <Form.Item name="assignerIds" label={labelHidden ? null : "负责人"} rules={[{ required: false }]} >
                            <Select
                                mode="multiple"
                                placeholder="负责人"
                                className="work-select"
                                key="assignerIds"
                                maxTagCount={1}
                                getPopupContainer={() => heightFilter.current}
                            >
                                {
                                    userList && userList.map((item) => {
                                        return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="workStatusIds" label={labelHidden ? null : "状态"} rules={[{ required: false }]} >
                            <Select
                                mode="multiple"
                                placeholder="状态"
                                className="work-select"
                                key="workStatusIds"
                                maxTagCount={1}
                                getPopupContainer={() => heightFilter.current}
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
                    >
                        {
                            userList && userList.map((item) => {
                                return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="createdDate" label={labelHidden ? null : "创建日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>
                <Form.Item name="updateDate" label={labelHidden ? null : "更新日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>
                <Form.Item name="planStartDate" label={labelHidden ? null : "计划开始日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>

                <Form.Item name="planEndDate" label={labelHidden ? null : "计划结束日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>

                <Form.Item name="workPriorityIds" label={labelHidden ? null : "优先级"} rules={[{ required: false }]} >
                    <Select
                        mode="multiple"
                        placeholder="优先级"
                        className="work-select"
                        key="status"
                        maxTagCount={1}
                        getPopupContainer={() => heightFilter.current}
                    // bordered={false}
                    >
                        {
                            priorityList && priorityList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="currentSprintId" label={labelHidden ? null : "所属迭代"} style={{ minWidth: '70px', flex: 1 }} rules={[{ required: false }]} >
                    <Select
                        mode="multiple"
                        placeholder="所属迭代"
                        className="work-select"
                        key="assigner"
                        maxTagCount={1}
                        getPopupContainer={() => heightFilter.current}
                    >
                        {
                            sprintList && sprintList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="moduleIds" label={labelHidden ? null : "所属模块"} style={{ minWidth: '70px', flex: 1 }} rules={[{ required: false }]} >
                    <Select
                        mode="multiple"
                        placeholder="所属模块"
                        className="work-select"
                        key="assigner"
                        maxTagCount={1}
                        getPopupContainer={() => heightFilter.current}
                    >
                        {
                            moduleList && moduleList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>

            </Form>
            <div className="workitem-filter-height-botton">
                <Button onClick={() => resetFilter()}>重置</Button>
                <Button onClick={() => setFiltetModal(false)}>取消</Button>
                <Button type="primary" onClick={() => setFiltetModal(false)}>确定</Button>
            </div>
        </div>

    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkFilterHigh)));