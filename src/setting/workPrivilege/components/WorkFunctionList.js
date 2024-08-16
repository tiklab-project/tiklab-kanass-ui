import React, { useCallback, useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Table } from 'antd';
import "./WorkFunctionList.scss"
import Breadcrumb from '../../../common/breadcrumb/Breadcrumb';
import Button from '../../../common/button/Button';
import WorkFunctionAddModal from './WorkFunctionAddModal';
import WorkPrivilegeStore from '../store/WorkPrivilegeStore';
import DraggableFeatureBodyRow from './DraggableFeatureBodyRow';
const columns = [
    {
        title: '功能名称',
        dataIndex: 'name',
    },
    {
        title: '功能编码',
        dataIndex: 'code',
    }
];

const WorkFunctionList = () => {
    const [dataSource, setDataSource] = useState([]);
    const { findWorkFunctionTreeList } = WorkPrivilegeStore;


    useEffect(() => {
        findWorkFunctionTreeList({}).then(res => {
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

    return (
        <div className="work-function">
            <Breadcrumb
                firstText="事项功能"
            >
                <Button type="primary">
                    <WorkFunctionAddModal />
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