import React, { useCallback, useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Space, Table } from 'antd';
import "./WorkFunctionList.scss"
import Breadcrumb from '../../../common/breadcrumb/Breadcrumb';
import Button from '../../../common/button/Button';
import WorkFunctionAddModal from './WorkFunctionAddModal';
import WorkPrivilegeStore from '../store/WorkPrivilegeStore';
import DraggableFeatureBodyRow from './DraggableFeatureBodyRow';

const WorkFunctionList = () => {
    const [dataSource, setDataSource] = useState([]);
    const { findAllWorkItemFunction, deleteWorkItemFunction } = WorkPrivilegeStore;

    const deleteWorkFunction = (id) => {
        deleteWorkItemFunction({id: id}).then(res => {
            if(res.code === 0){
                findAllWorkItemFunction({}).then(res => {
                    if (res.code === 0) {
                        setDataSource(res.data)
                    }
                })
            }
        })
    }

    useEffect(() => {
        findAllWorkItemFunction({}).then(res => {
            if (res.code === 0) {
                setDataSource(res.data)
            }
        })
    }, [])
    const moveRow = useCallback(() => { })
    const onExpand = (expanded, record) => {
        // setExpandedData({
        //     ...expandedData,
        //     [record.id]: expanded
        // })
    }

    const columns = [
        {
            title: '功能名称',
            dataIndex: 'name',
        },
        {
            title: '功能编码',
            dataIndex: 'code',
        },
        {
            title: "操作",
            key: "action",
            align: "left",
            width: '10%',
            render: (text, record) => (
                <Space size="middle">
                    <WorkFunctionAddModal type = "edit" id = {record.id} setDataSource = {setDataSource}/>
                    <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }} onClick={() => deleteWorkFunction(record.id)}>
                        <use xlinkHref="#icon-delete"></use>
                    </svg>
                </Space>
            ),
        },
    ];
    
    return (
        <div className="work-function">
            <Breadcrumb
                firstText="事项功能"
            >
                <Button type="primary">
                    <WorkFunctionAddModal setDataSource = {setDataSource}/>
                </Button>
            </Breadcrumb>
            <DndProvider backend={HTML5Backend}>
                <Table
                    rowKey="id"
                    dataSource={dataSource}
                    columns={columns}
                    tableLayout="fixed"
                    pagination={false}
                    components={{
                        body: {
                            row: DraggableFeatureBodyRow,
                        },
                    }}
                    onRow={(record, index) => ({
                        record,  // 当前数据
                        data: dataSource,    // 完整数据
                        index: index,   // 当前数据索引
                        moveRow  // 移动后修改数据的方法
                    })}
                    expandable={{
                        onExpand: onExpand
                    }}
                    scroll={{x: "100%"}}
                />
            </DndProvider>
        </div>

    );
};
export default WorkFunctionList;