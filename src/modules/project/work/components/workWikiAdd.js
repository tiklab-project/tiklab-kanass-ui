import React, {useEffect,useState} from "react";
import { Modal, Button,Table,Select,message,Input } from 'antd';
import {observer, inject} from "mobx-react";

const { Search } = Input;
const { Option } = Select;

const  WorkWikiAddmodal = (props) => {
    const {workWikiStore,workStore,setWorkDoucumentList} = props;
    const {workId} = workStore;
    const {findDocumentPage,findDocumentPageByItemId,createWorkItemDocument,getWikiAllList} = workWikiStore;
    const [visible, setVisible] = useState(false);
    const [selectedRowKeys,setSelectedRowKeys] = useState([]);
    const [doucumentList,setDoucumentList] = useState([])
    const [wikiallList,setWikiaLLList] = useState([]);
    
    const showModal = () => {
        setVisible(true)
    };

    useEffect(()=> {
        console.log(visible)
        if(visible === true){
            findDocumentPage({workItemId:workId}).then((data)=> {
                setDoucumentList([...data])
            
            })
            getWikiAllList().then(data => {
                setWikiaLLList([...data])
            })

        }
        
    },[visible])

    const columns=[
        {
            title: "标题",
            dataIndex: "name",
            key: "title",
            width: 150
        },
        {
            title: "知识库",
            dataIndex: ["repository","name"],
            key: "workStatus",
            width: 150
        },
        {
            title: "作者",
            dataIndex: ["repository","master","name"],
            key: "assigner",
            width: 150
        }
    ];
    
    const onCancel = () => {
        setVisible(false);
    };
    
    // 选择知识库筛选数据
    const searchUnselectWorkWiki = (value) => {
        const categoryQuery = {
            repositoryId: value,
            workItemId:workId
        }
        findDocumentPage(categoryQuery).then((data)=> {
            setDoucumentList([...data])
        })
    }
    const searchSelectWorkWiki = (value)=> {
        // getSelectWorkRelationList({title: value})
        const categoryQuery = {
            name: value,
            workItemId:workId
        }
        findDocumentPage(categoryQuery).then((data)=> {
            setDoucumentList([...data])
        })
    }
    // 选择文档
    const selectWorkWiki=(selected)=> {
        setSelectedRowKeys(selected)
        // setSelectedWorkWikiList(selectedRows)
    }
    //提交用户列表
    const submitWorkWikiList = ()=> {
        console.log(workId)
        const workItemDocument = [];
        if(selectedRowKeys.length !== 0){
            for(let i=0; i<selectedRowKeys.length; i++) {
                // createWorkItemDocument({id: selectedRowKeys[i],workitemId:workId })
                workItemDocument.push({documentId: selectedRowKeys[i],workItemId: workId})
            }
            createWorkItemDocument(workItemDocument).then((data)=> {
                if(data.code === 0) {
                    findDocumentPageByItemId({workItemId: workId}).then((data)=> {
                        setWorkDoucumentList([...data])
                    })
                    setSelectedRowKeys([])
                    setVisible(false)
                }
            })
        }else {
            info()
        }
    }
    //没有选择用户提升
    const info = () => {
        message.info('请选择事项');
    };


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
                onOk={submitWorkWikiList}
                className="work-wiki-addmodel"
                destroyOnClose={true}
            >   
            
                <div className="work-wiki-search" style={{marginBottom : "10px"}}>
                    选择知识库：
                    <Select style={{ width: 200 }} 
                        allowClear 
                        onChange={(value)=>searchUnselectWorkWiki(value)}
                        // onClear={searchUnselectWorkWiki}
                    >
                        {
                            wikiallList && wikiallList.map((item)=> {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                    <Search 
                        allowClear
                        placeholder="请输入关联文档名称" 
                        onSearch={searchSelectWorkWiki} 
                        enterButton 
                        style={{ width: 200,marginLeft: "10px" }}
                    />
                </div>
                <Table 
                    columns={columns} 
                    dataSource={doucumentList} 
                    rowKey={record=> record.id}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectWorkWiki,
                        getCheckboxProps: (record) => ({
                            disabled: record.rele === true
                        })
                    }}
                    okText="确定"
                    cancelText="取消"
                    
                />

            </Modal>
        </div>
        
        </>
    );
};

export default inject('workStore','workWikiStore')(observer(WorkWikiAddmodal));
