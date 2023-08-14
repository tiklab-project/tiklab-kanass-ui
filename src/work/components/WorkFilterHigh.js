import React, { useEffect, useState, useRef } from "react";
import { Form, DatePicker, Select } from 'antd';
import Button from "../../common/button/Button";
import moment from 'moment';
import "./Work.scss";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
const { RangePicker } = DatePicker;
const WorkFilterHigh = (props) => {
    // 查找表单
    const [form] = Form.useForm();
    const { workStore, labelHidden, setFiltetModal } = props;
    const projectId = props.match.params.id ? props.match.params.id : null;
    const heightFilter = useRef()
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    // 解析store数据
    const { getWorkConditionPage, getWorkConditionPageTree, workShowType,
        getWorkBoardList, getWorkGanttListTree, setWorkId, setWorkIndex,
        viewType, priorityList, findPriority, getsprintlist, sprintList,
        getModuleList, moduleList, searchCondition, getWorkStatus, workStatusList,
        getSelectUserList, userList, setSearchConditionNull } = workStore;

    useEffect(() => {
        findPriority()
        getsprintlist(projectId)
        getModuleList(projectId)
        getWorkStatus()
        getSelectUserList(projectId);
    }, [])

    useEffect(() => {
        initForm()
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
            case "sprintIds":
                value = {
                    sprintIds: changedValues.sprintIds,
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
        // setSearchConditionNull()
        let value = {
            projectIds: projectId ? [projectId] : [],
            builderIds: [],
            workStatusIds: [],
            createdDate: [],
            planStartDate: [],
            planEndDate: [],
            workPriorityIds: [],
            sprintIds: [],
            moduleIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        }
        findWorkItem(value)
    }

    const findWorkItem = (value) => {
        if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
            getWorkConditionPageTree(value).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList?.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }

                }
            })
        }
        if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
            getWorkConditionPage(value).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }
                }
            })
        }
        if (workShowType === "bodar") {
            getWorkBoardList(value)
        }
        if (workShowType === "time") {
            getWorkGanttListTree(value)
        }
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
            sprintIds: searchCondition.sprintIds,
            moduleIds: searchCondition.moduleIds
        })
    }

    return (
        <div className="height-filter" ref={heightFilter}>
            <Form
                form={form}
                name="control-hooks"
                // onFinish={search}
                // layout={l?ayout}
                className="workitem-filter-height"
                labelAlign="left"
                // initialValues={{
                //     workPriorityIds: ['56035266d43ed3e87d1919fcde3848ea']

                // }}
                onValuesChange={(changedValues, allValues) => changeField(changedValues, allValues)}
                {...formItemLayout}

            >
                {
                    workShowType === "list" && <Form.Item name="workStatusIds" label={labelHidden ? null : "状态"} rules={[{ required: false }]} >
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
                                return <Select.Option value={item.user.id} key={item.user.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="createdDate" label={labelHidden ? null : "创建日期"} rules={[{ required: false }]} >
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
                <Form.Item name="sprintIds" label={labelHidden ? null : "所属迭代"} style={{ minWidth: '70px', flex: 1 }} rules={[{ required: false }]} >
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
                <div className="workitem-filter-height-botton">
                    <Button onClick={() => resetFilter()}>重置</Button>
                    <Button onClick={() => setFiltetModal(false)}>取消</Button>
                    <Button type="primary" onClick={() => setFiltetModal(false)}>确定</Button>
                </div>
            </Form>
        </div>

    )
}
export default withRouter(inject("workStore", "workCalendarStore")(observer(WorkFilterHigh)));