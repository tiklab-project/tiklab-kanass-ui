import React,{ useState, useRef } from "react";
import { Table, Space } from 'antd';
import { observer, inject } from "mobx-react";
import WorkDetailModal from "./workDetailModal"
import WorkAddModel from "./workAddModel";

const workTable=(props) => {
    const {workStore } =props
    const {workList,total,searchCondition,getWorkConditionPageTree,setIndexParams,detWork,workShowType,getWorkConditionPage}
            = workStore;

    const modelRef = useRef()
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            width: "35%",
            sorter: {
                multiple: 1
            },
            render: (text, record,index) => <span className = "span-botton" onClick={()=> showModal(record.id,index,record.title)}>{text}</span> 
        },
        {
            title: '事项类型',
            dataIndex: ['workType','name'],
            width: "8%",
            sorter: {
                multiple: 2
            },
            key: 'workTypeId',
        },
        {
            title: '事项名称',
            width: "20%",
            dataIndex: 'title',
            sorter: {
                multiple: 3
            },
            key: 'title',
        },
        {
            title: '负责人',
            width: "8%",
            dataIndex: ['assigner','name'],
            sorter: {
                multiple: 4
            },
            key: 'assignerId',
        },
        {
            title: 'project',
            width: "8%",
            dataIndex: ['project','projectName'],
            key: 'project',
        },
        {
            title: 'action',
            key: 'action',
            width: "15%",
            render: (text, record) => (
                <Space size="middle">
                    <span className = "span-botton" onClick={()=>deleteWork(record.id)}>删除</span>
                    <span className = "span-botton" onClick={()=>eidtWork(record.id,record.title)}>编辑</span>
                    <span className = "span-botton">更多</span>
                </Space>
                ),
        },
    ];
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 显示详情页面
    const showModal = (id,index,title)=> {
        setIndexParams(1,11)
        modelRef.current.showDetail(id,index,title)
    }

    // 改变页数
    const changePage = (page)=> {
        const values = {
            pageParam: {
                pageSize: 10,
                currentPage: page,
            }
        }
        if(viewType === "tree"){
            getWorkConditionPageTree(values)
        }
        if(viewType === "tile"){
            getWorkConditionPage(values)
        }
        
    }
    
    // 删除事项
    const deleteWork = (id)=> {
        detWork(id).then(()=> {
            if(viewType === "tree"){
                getWorkConditionPageTree(values)
            }
            if(viewType === "tile"){
                getWorkConditionPage(values)
            }
        })
    }

    // 编辑事项
    const workAddModel = useRef()
    const [stateType,setState] = useState()
     // 编辑事务
    const eidtWork = (id,title) => {
        const params= {
            type: "edit",
            id: id,
            title: `编辑${title}`,
            typework: 1
        }
        setState(params)
        workAddModel.current.setShowAddModel(true)
    }

    const sorter = (pagination, filters, sorter, extra) => {
        console.log(filters, sorter)
        const sortParams = []
        const sorterArr = Array.isArray(sorter) ? sorter : [ sorter ];
        sorterArr.map(item => {
            if(item.order === "ascend"){
                sortParams.push({
                    name: item.columnKey,
                    orderType: "asc"
                })
            }
            if(item.order === "descend"){
                sortParams.push({
                    name: item.columnKey,
                    orderType: "desc"
                })
            }
            return sortParams;
        })
        searchCondition.orderParams = sortParams;
        if(workShowType === "tableTree"){
            getWorkConditionPageTree()
        }
        if(workShowType === "tableTile"){
            getWorkConditionPage()
        }
        
    }
    
    return (
        <div style={{overflow: "hidden"}}>
            <Table
                columns={columns}
                dataSource={workList}
                rowKey={(record) => record.id}
                style={{overflow: "auto",height: "90%"}}
                onChange={sorter}
                pagination = {{
                    total:total,
                    pageSize:10,
                    defaultCurrent:searchCondition.current,
                    current: searchCondition.current,
                    onChange: changePage
                }}
            />
                <WorkDetailModal 
                    isModalVisible = {isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    modelRef = {modelRef}
                    {...props}
                />
                <WorkAddModel workAddModel={workAddModel} state={stateType} {...props}/>
        </div>
    );
}

export default inject("workStore")(observer(workTable))