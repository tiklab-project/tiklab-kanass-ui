import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Row, Col } from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkRelation.scss"
import WorkRelationAddmodal from "./WorkRelationAdd";
import Button from "../../common/button/Button";
import WorkRelationStore from "../store/WorkRelationStore";
import { getSessionStorage, setSessionStorage } from "../../common/utils/setSessionStorage";
import setImageUrl from "../../common/utils/setImageUrl";
const WorkRelation = (props) => {
    const store = {
        workRelation: WorkRelationStore
    }
    const { workStore } = props;
    const { workId, setWorkId, createRecent  } = workStore;
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
        newDetailCrumbArray.push({id: workItem.id, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl})
        setSessionStorage("detailCrumbArray", newDetailCrumbArray)
        const params = {
            name: workItem.title,
            model: "workItem",
            modelId: workItem.id,
            project: {id: project.id},
            projectType: {id: project.projectType.id},
        }
        createRecent(params)
    }

    const columns = [
        {
            title: "标题",
            dataIndex: ["workItem", "title"],
            key: "title",
            width: 150,
            render: (text, record) => <div className="work-name" >
                <div className="work-title" onClick={() => goWorkItem(record.workItem) }>
                    {
                        record.workItem?.workTypeSys?.iconUrl ?
                            <img
                                alt=""
                                className="svg-icon"
                                src = {setImageUrl(record.workItem?.workTypeSys?.iconUrl)}
                            />
                            :
                            <img
                                src={'/images/workType2.png'}
                                alt=""
                                className="svg-icon"
                            />
                    }
                    {text}
                </div>
            </div>
        },
        {
            title: "事件类型",
            dataIndex: ["workItem", "workType", "name"],
            key: "workType",
            width: 150

        },
        {
            title: "事项状态",
            dataIndex: ["workItem", "workStatus", "name"],
            key: "workStatus",
            width: 150
        },
        {
            title: "负责人",
            dataIndex: ["workItem", "assigner", "name"],
            key: "assigner",
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "15%",
            render: (text, record) => (
                <span onClick={() => delectRelation(record.id)} className="span-botton" >删除</span>
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