import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Row, Col, Empty } from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkRelation.scss"
import WorkRelationAddmodal from "./WorkRelationAdd";
import Button from "../../common/button/Button";
import WorkRelationStore from "../store/WorkRelationStore";
import { getSessionStorage, setSessionStorage } from "../../common/utils/setSessionStorage";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import WorkPrivilegeComponent from "./WorkPrivilegeComponent";
const WorkRelation = (props) => {
    const store = {
        workRelation: WorkRelationStore
    }
    const { workStore } = props;
    const { workId, setWorkId, createRecent } = workStore;
    const { selectWorkRelationList, getSelectWorkRelationList,
        addWorkRelation, searchAllWorkRelation, deleWorkRelation } = WorkRelationStore;
    const [selectIds, setSelectIds] = useState();
    const [addRelation, showAddRelation] = useState(false);
    const project = JSON.parse(localStorage.getItem("project"));
    

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


    const delectRelation = (id) => {
        deleWorkRelation(id)
    }

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
        createRecent(params)
    }

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
            render: (text, record) => <div className="work-title" onClick={() => goWorkItem(record.workItem)}>
                <ImgComponent
                    alt=""
                    className="svg-icon"
                    src={record.workItem?.workTypeSys?.iconUrl}
                />
                <div className="work-name">{text}</div>
            </div>
        },
        {
            title: "事项类型",
            dataIndex: ["workItem", "workTypeSys", "name"],
            key: "workType",
            width: "10%"
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
            render: (text, record) => (
                <WorkPrivilegeComponent workId = {workId} code = "WorkRelationDelete">
                    <span onClick={() => delectRelation(record.id)} className="span-botton">解除关联</span>
                </WorkPrivilegeComponent>
                
            ),
        }
    ];

    return (<Provider {...store}>
        <div className="work-relation">
            <div className="relation-top">
                <div className="relation-top-title">共{selectWorkRelationList.length}条</div>
                {
                    !addRelation &&
                    <WorkPrivilegeComponent workId = {workId} code = "WorkRelationAdd">
                        <Button onClick={() => showAddRelation(true)}>
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
export default inject("workStore")(observer(WorkRelation));