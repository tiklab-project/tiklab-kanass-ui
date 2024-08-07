import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Row, Col } from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkRelation.scss"
import WorkRelationAddmodal from "./WorkRelationAdd";
import Button from "../../common/button/Button";
import WorkRelationStore from "../store/WorkRelationStore";
import { getSessionStorage, setSessionStorage } from "../../common/utils/setSessionStorage";
import ImgComponent from "../../common/imgComponent/ImgComponent";
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
            title: "事件类型",
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
        // {
        //     title: "负责人",
        //     dataIndex: ["workItem", "assigner", "name"],
        //     key: "assigner",
        //     width: "10%"
        // },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "10%",
            render: (text, record) => (
                <span onClick={() => delectRelation(record.id)} className="span-botton" >解除关联</span>
            ),
        }
    ];

    return (<Provider {...store}>
        <div className="work-relation">
            <div className="relation-top">
                <div className="relation-top-title">关联事项({selectWorkRelationList.length})</div>
                {
                    !addRelation &&
                    <Button onClick={() => showAddRelation(true)}>
                        添加事项
                    </Button>
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
                <Table
                    columns={columns}
                    dataSource={selectWorkRelationList}
                    rowKey={record => record.id}
                    pagination={false}
                    showHeader={false}
                />
            </div>
        </div>
    </Provider>

    )
}
export default inject("workStore")(observer(WorkRelation));