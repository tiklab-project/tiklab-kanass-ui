/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:58:21
 * @Description: 事项关联
 */
import React, { useEffect, useState } from "react";
import {Table, Empty, Button, Input, Popconfirm} from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkRelation.scss"
import WorkRelationAddmodal from "./WorkRelationAdd";
import WorkRelationStore from "../store/WorkRelationStore";
import { getSessionStorage, setSessionStorage } from "../../common/utils/setSessionStorage";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import WorkPrivilegeComponent from "./WorkPrivilegeComponent";
const WorkRelation = (props) => {
    const store = {
        workRelation: WorkRelationStore
    }
    const { workStore, workRelation } = props;
    const { workId, setWorkId, createRecent } = workStore;
    const { selectWorkRelationList, getSelectWorkRelationList,
        addWorkRelation, searchAllWorkRelation, deleWorkRelation, findWorkRelateAndChildNum } = workRelation;
    const [selectIds, setSelectIds] = useState();
    const [addRelation, showAddRelation] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const project = JSON.parse(localStorage.getItem("project"));
    
    /**
     * 获取关联事项列表
     */
    useEffect(() => {
        if (!addRelation) {
            getSelectWorkRelationList({ workItemId: workId }).then((res) => {
                let array = [workId];
                if (res && res.length > 0) {
                    res.map((item) => {
                        array.push(item.workItem.id)
                        return array;
                    })
                }
                setSelectIds(array)
            })
        }

        return;
    }, [workId, addRelation])

    const inputChange = (value) => {
        setInputValue(value)
        getSelectWorkRelationList({title: value}).then((res) => {
            let array = [workId];
            if (res && res.length > 0) {
                res.map((item) => {
                    array.push(item.workItem.id)
                    return array;
                })
            }
            setSelectIds(array)
        })
    }

    /**
     * 删除关联事项
     */
    const delectRelation = (id) => {
        deleWorkRelation(id).then((res) => {
            findWorkRelateAndChildNum(workId)
        })
    }

    /**
     * 跳转事项详情
     */
    const goWorkItem = (workItem) => {
        setWorkId(workItem.id)
        const newDetailCrumbArray = getSessionStorage("detailCrumbArray");
        newDetailCrumbArray.push({ id: workItem.id, code: workItem.code, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl })
        setSessionStorage("detailCrumbArray", newDetailCrumbArray)
        const params = {
            name: workItem.title,
            model: "workItem",
            modelId: workItem.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
        }
        // 创建最近访问
        createRecent(params)
    }

    /**
     * 设置事项状态样式
     */
    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
                break;
            case "done":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
    }

    const columns = [
        {
            title: "标题",
            dataIndex: ["workItem", "title"],
            key: "title",
            ellipsis: true,
            width: "50%",
            render: (text, record) =>
                <div className="work-title" onClick={() => goWorkItem(record.workItem)}>
                    <ImgComponent
                        alt=""
                        className="svg-icon"
                        src={record.workItem?.workTypeSys?.iconUrl}
                    />
                    <div className="work-name">{text}</div>
                </div>
        },
        {
            title: "优先级",
            dataIndex: ["workItem", "workPriority", "name"],
            key: "workPriority",
            width: "10%",
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.workItem.workPriority?.iconUrl}
                        alt=""
                        className="img-icon-right"
                    />
                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: "事项状态",
            dataIndex: ["workItem", "workStatusNode", "name"],
            key: "workStatus",
            width: "10%",
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workItem?.workStatusNode?.id)}`}>
                {text}
            </div>
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "10%",
            align: "center",
            cellStyle: {
                textAlign: 'right',
                paddingRight: '10px', // 调整间距
            },
            render: (text, record) => (
                <WorkPrivilegeComponent workId = {workId} code = "WorkRelationDelete">
                    {/*<span onClick={() => delectRelation(record.id)} className="span-botton">解除关联</span>*/}
                    <Popconfirm
                        title={"确认解除关联吗？"}
                        onConfirm={() => delectRelation(record.id)}
                        onCancel={null}
                        okText="确认"
                        cancelText="取消"
                    >
                        <svg className="icon-18" aria-hidden="true" style={{cursor: 'pointer' }}>
                            <use xlinkHref={`#icon-unLink`}></use>
                        </svg>
                    </Popconfirm>
                </WorkPrivilegeComponent>
                
            ),
        }
    ];

    return (<Provider {...store}>
        <div className="work-relation">
            <div className="relation-top">
                <div className="relation-top-title">
                    {/*<div className="search-input">*/}
                    {/*        <svg className="svg-icon" aria-hidden="true">*/}
                    {/*            <use xlinkHref="#icon-search"></use>*/}
                    {/*        </svg>*/}
                    {/*        <Input bordered={false} allowClear*/}
                    {/*               className="work-relation-search-input"*/}
                    {/*               key={"search"}*/}
                    {/*               onChange={(value) => inputChange(value.target.value)}*/}
                    {/*               placeholder="搜索事项"*/}
                    {/*               value={inputValue}*/}
                    {/*        />*/}
                    {/*</div>*/}
                    <svg className="icon-22" aria-hidden="true" style={{ cursor: "pointer" }} onClick={() => {
                        getSelectWorkRelationList({ workItemId: workId }).then((res) => {
                            let array = [workId];
                            if (res && res.length > 0) {
                                res.map((item) => {
                                    array.push(item.workItem.id)
                                    return array;
                                })
                            }
                            setSelectIds(array)
                        })
                    }}>
                        <use xlinkHref="#icon-refresh"></use>
                    </svg>
                </div>
                {
                    !addRelation &&
                    <WorkPrivilegeComponent workId = {workId} code = "WorkRelationAdd">
                        <Button
                            style={{
                                display: "flex",
                                textAlign: "center",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            type="text"
                            onClick={() => showAddRelation(true)}>
                            <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }}>
                                <use xlinkHref="#icon-add2"></use>
                            </svg>
                            添加事项
                        </Button>
                    </WorkPrivilegeComponent>
                    
                }
            </div>
            <div className="relation-content">
                {
                    addRelation && <WorkRelationAddmodal
                        {...props}
                        name="添加事项"
                        addWorkRelation={addWorkRelation}
                        searchAllWorkRelation={searchAllWorkRelation}
                        selectIds={selectIds}
                        addRelation={addRelation}
                        showAddRelation={showAddRelation}
                    />
                }
                {
                    selectWorkRelationList?.length > 0 ? <Table
                        columns={columns}
                        dataSource={selectWorkRelationList}
                        rowKey={record => record.id}
                        pagination={false}
                        showHeader={false}
                        scroll={{ x: "100%" }}
                    />
                        :
                        <Empty description="暂无关联事项" />
                }

            </div>
        </div>
    </Provider>

    )
}
export default inject("workStore", "workRelation")(observer(WorkRelation));