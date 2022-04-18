import React, { useEffect, useState } from "react";
import { Input, Table } from 'antd';
import { observer, inject } from "mobx-react";
import "./workRelation.scss"
import WorkRelationAddmodal from "./workRelationAdd"
const { Search } = Input;

const WorkRelation = (props) => {
    const { workRelation, workStore } = props;
    const { workId } = workStore;
    const { selectWorkRelationList, getSelectWorkRelationList,
        addWorkRelation, searchAllWorkRelation, deleWorkRelation } = workRelation;
    const [selectIds, setSelectIds] = useState();
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!visible) {
            getSelectWorkRelationList({ workItemId: workId }).then((res) => {
                let array = [workId];
                array = res.map((item) => {
                    array.push(item.relateWorkItem.id)
                    return array;
                })
                setSelectIds(array)
            })
        }


    }, [workId,visible])

    const searchSelectWorkRelation = (value) => {
        getSelectWorkRelationList({ title: value })
    }

    const delectRelation = (id) => {
        deleWorkRelation(id)
    }
    const columns = [
        {
            title: "标题",
            dataIndex: ["relateWorkItem", "title"],
            key: "title",
            width: 150
        },
        {
            title: "事件类型",
            dataIndex: ["relateWorkItem", "workType", "name"],
            key: "workType",
            width: 150

        },
        {
            title: "事项状态",
            dataIndex: ["relateWorkItem", "workStatus", "name"],
            key: "workStatus",
            width: 150
        },
        {
            title: "负责人",
            dataIndex: ["relateWorkItem", "assigner", "name"],
            key: "assigner",
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span onClick={() => delectRelation(record.id)} className="span-botton" >删除</span>
            ),
        }
    ];


    return (
        <div className="work-relation">
            <div className="relation-top">
                <Search
                    allowClear
                    placeholder="请输入关联事项名称"
                    onSearch={searchSelectWorkRelation}
                    enterButton
                    style={{ width: 200 }}
                />
                <WorkRelationAddmodal
                    {...props}
                    name="添加事项"
                    addWorkRelation={addWorkRelation}
                    searchAllWorkRelation={searchAllWorkRelation}
                    selectIds={selectIds}
                    visible={visible}
                    setVisible={setVisible}
                />
            </div>
            <Table
                columns={columns}
                dataSource={selectWorkRelationList}
                rowKey={record => record.id}
            />
        </div>
    )
}
export default inject(
    "workStore",
    "workRelation"
)(observer(WorkRelation));