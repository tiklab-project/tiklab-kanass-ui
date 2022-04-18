import React, {useState} from "react";
import { Modal, Button,Table,Select,message,Input } from 'antd';
import {observer, inject} from "mobx-react";

const { Search } = Input;

const  WorkChildAddmodal = (props) => {
    const {proStore,workStore,workChild,workType,workId,addWorkChild} = props;
    const {projectName} = proStore;
    const {workTypeList,getProlist,projectList,getWorkConditionPageTree,workShowType} = workStore;
    const projectId = localStorage.getItem("projectId")

    const [visible, setVisible] = useState(false);
    const [selectedRowKeys,setSelectedRowKeys] = useState([]);
    const [workChildList,setWorkChildList] = useState([]);
    const { selectWorkChildList,findEpicSelectWorkItemList,findSelectWorkItemList,getWorkChildList,setChildWorkItem,total } = workChild;
    
    const showModal = () => {
        setVisible(true);
        getProlist()
        if(workType === "3" ){
            const params = {
                projectId: projectId,
                workTypeId: workType,
                parentId: workId,
                title: null,
                pageParam: {
                    currentPage: 1,
                    pageSize: 10
                }
            }
            findEpicSelectWorkItemList(params).then(res=> {
                if(res.code === 0){
                    setWorkChildList(res.data.dataList)
                }
            })
        }else {
            const params = {
                projectId: projectId,
                workTypeId: workType,
                parentId: workId,
                title: null,
                pageParam: {
                    currentPage:1,
                    pageSize: 10
                }
            }
            findSelectWorkItemList(params).then(res=> {
                if(res.code === 0){
                    setWorkChildList(res.data.dataList)
                }
            })
        }
    };
    const columns=[
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            width: 150
        },
        {
            title: "事件类型",
            dataIndex: ["workType","name"],
            key: "workType",
            width: 150
            
        },
        {
            title: "事项状态",
            dataIndex: ["workStatus","name"],
            key: "workStatus",
            width: 150
        },
        {
            title: "负责人",
            dataIndex: ["assigner","name"],
            key: "assigner",
            width: 150
        }
    ];
    
    const onCancel = () => {
        setVisible(false);
        
    };
    
    // 选择用户
    const selectWorkChild=(selected, selectedRows)=> {
        setSelectedRowKeys(selected)
    }
    //提交添加列表
    const submitWorkChildList = ()=> {
        if(selectedRowKeys.length !== 0){
            for(let i=0;i<selectedRowKeys.length;i++) {
                let params = {
                        id: selectedRowKeys[i],
                        parentWorkId: workId,
                        projectId: projectId
                    }
                addWorkChild(params).then(()=>{
                    if(i === selectedRowKeys.length - 1){
                        setSelectedRowKeys([])
                        setVisible(false)
                        if(workShowType === "bodar"){
                            getWorkBoardList()
                        }else if((workShowType === "list" || workShowType === "table") && viewType === "tree" ){
                            getWorkConditionPageTree()
                        }else if((workShowType === "list" || workShowType === "table") && viewType === "tile"){
                            getWorkConditionPage()
                        }
                        let params = {};
                        if(workType !== "3"){
                            params = {
                                parentId: workId,
                                workTypeId: workType
                            }
                        }else {
                            params = {
                                parentId: workId
                            }
                        }
                        getWorkChildList(params).then((res)=> {
                            if(res.code === 0){
                                setChildWorkItem(res.data.dataList)
                            }
                        })
                    }
                })  
            }
            
            
        }else {
            info()
        }
    }
    //没有选择用户提升
    const info = () => {
        message.info('请选择用户');
    };

    // 搜索成员
    const searchUnselectWorkChild = (value) => {
        // getSelectWorkChildList({title: value})
        // .then((res)=> {
        //     let newList = res.filter((item)=> {
        //         return !selectWorkChildList.some((selectItem,index)=> {
        //             return selectItem.id === item.id
        //         })
        //     })
        //     setWorkChildList(newList)
        // })
        const params = {
            title: value
        }
        if(workType === "3" ){
            findEpicSelectWorkItemList(params).then(res=> {
                if(res.code === 0){
                    setWorkChildList(res.data.dataList)
                }
            })
        }else {
            findSelectWorkItemList(params).then(res=> {
                if(res.code === 0){
                    setWorkChildList(res.data.dataList)
                }
            })
        }
    }
    const searchUnselectWorkChildByStatus = (value) => {
        getSelectWorkChildList({workTypeId: value})
        .then((res)=> {
            let newList = res.filter((item)=> {
                return !selectWorkChildList.some((selectItem,index)=> {
                    return selectItem.id === item.id
                })
            })
            setWorkChildList(newList)
        })
    }

    // 改变页码
    const onChangePage = (page)=> {
        const params = {
            pageParam: {
                currentPage: page.current,
                pageSize: 10
            }
        }
        if(workType === "3" ){
            findEpicSelectWorkItemList(params).then(res=> {
                if(res.code === 0){
                    setWorkChildList(res.data.dataList)
                }
            })
        }else {
            findSelectWorkItemList(params).then(res=> {
                if(res.code === 0){
                    setWorkChildList(res.data.dataList)
                }
            })
        }
    }
    return (
        <>
        <div className="addmodel">
            {props.type !== "edit"?<Button type="primary" onClick={showModal}>
                    +{props.name}
                </Button>: <span onClick={showModal} style={{color: "$blue-main"}}>{props.name}</span>

            }
            <Modal
                title="选择事项"
                visible={visible}
                onCancel={onCancel}
                width={800}
                onOk={submitWorkChildList}
                className="work-child-addmodel"
            >
                
                <div className="work-child-search">
                    {
                        props.location.pathname == "/index/work/worklist" ? 
                        <Select defaultValue={projectId} style={{ width: 200 }}>
                            {
                                projectList && projectList.map((item)=>{
                                    return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                })
                            }
                        </Select> :  
                        <Select defaultValue={projectId} style={{ width: 200 }} disabled>
                            <Select.Option value={projectId}>{projectName}</Select.Option>
                        </Select>
                    }
                    
                    <Select style={{ width: 200 }} 
                        allowClear 
                        onChange={searchUnselectWorkChildByStatus}
                        onClear={searchUnselectWorkChildByStatus}
                        defaultValue={workTypeList[0].id}
                        disabled
                    >
                    { 
                        workTypeList && workTypeList.map((item)=> {
                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        }) 
                    }
                    </Select>
                    <Search
                        placeholder="输入成员名字、手机号、邮箱"
                        allowClear
                        style={{ width: 200}}
                        onSearch={searchUnselectWorkChild}
                    />
                </div>
                <Table 
                    columns={columns} 
                    dataSource={workChildList} 
                    rowKey={record=> record.id}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectWorkChild
                    }}
                    pagination = {{defaultCurrent:1, total:total}}
                    onChange = {onChangePage}
                    okText="确定"
                    cancelText="取消"
                    
                />

            </Modal>
        </div>
        
        </>
    );
};
export default inject('proStore','workStore','workChild')(observer(WorkChildAddmodal));