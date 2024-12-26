/*
 * @Descripttion: 事项详情页面的高级筛选组件的单个筛选条件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:40:45
 */
import React, { useEffect, useState, useRef } from "react";
import { Form, DatePicker, Select } from 'antd';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
const { RangePicker } = DatePicker;


const WorkFilterHighItem = (props) => {
    const { heightFilter, filterKey, priorityList, moduleList, labelHidden } = props;

    /**
     * 根据选择的属性渲染对应的筛选条件的项
     */
    const getFilterItem = () => {
        let dom = null;
        switch (filterKey) {
            case "createdDate":
                dom = <Form.Item name="createdDate" label={labelHidden ? null : "创建日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>
                break;
            case "updateDate":
                dom = <Form.Item name="updateDate" label={labelHidden ? null : "更新日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>
                break;
            case "planStartDate":
                dom = <Form.Item name="planStartDate" label={labelHidden ? null : "计划开始日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>
                break;
            case "planEndDate":
                dom = <Form.Item name="planEndDate" label={labelHidden ? null : "计划结束日期"} rules={[{ required: false }]} >
                    <RangePicker getPopupContainer={() => heightFilter.current} />
                </Form.Item>
                break;
            case "workPriorityIds":
                dom = <Form.Item name="workPriorityIds" label={labelHidden ? null : "优先级"} rules={[{ required: false }]} >
                    <Select
                        mode="multiple"
                        placeholder="优先级"
                        className="work-select"
                        key="status"
                        maxTagCount={1}
                        getPopupContainer={() => heightFilter.current}
                        showArrow = {true}
                    >
                        {
                            priorityList && priorityList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                break;
            case "moduleIds":
                dom =
                    <Form.Item name="moduleIds" label={labelHidden ? null : "所属模块"} style={{ minWidth: '70px', flex: 1 }} rules={[{ required: false }]} >
                        <Select
                            mode="multiple"
                            placeholder="所属模块"
                            className="work-select"
                            key="assigner"
                            maxTagCount={1}
                            getPopupContainer={() => heightFilter.current}
                            showArrow = {true}
                        >
                            {
                                moduleList && moduleList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                break;
            default:
                break;
        }
        return dom;
    }


    return (
        <>
        {
            getFilterItem()
        }
        </>

    )
}
export default withRouter(observer(WorkFilterHighItem));