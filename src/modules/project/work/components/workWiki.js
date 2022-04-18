/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-27 09:41:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-10-09 15:25:16
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Button, Input, Table  } from 'antd';
import { observer, inject } from "mobx-react";
import "./workRelation.scss"
import WorkWikiAddmodal from "./workWikiAdd"

const { Search  } = Input;

const WorkWiki = (props) => {
    const { workWikiStore,workStore } = props;
    const {findDocumentPageByItemId,deleteWorkItemDocument} = workWikiStore;
    const {workId} = workStore;
    const [workDoucumentList,setWorkDoucumentList] = useState([])
    const [selectIds,setSelectIds] = useState()
    useEffect(()=> {
        findDocumentPageByItemId({workItemId: workId}).then((data)=> {
            setWorkDoucumentList([...data])
        })
    },[workId])

    const searchSelectWorkWiki = (value)=> {
        // getSelectWorkRelationList({title: value})
        findDocumentPageByItemId({workItemId: workId,name: value}).then((data)=> {
            setWorkDoucumentList([...data])
        })
    }
    
    // 
    const delectWiki = (id) => {
        deleteWorkItemDocument({workItemId: workId,documentId: id}).then((data)=> {
            if(data.code === 0) {
                findDocumentPageByItemId({workItemId: workId}).then((data)=> {
                    setWorkDoucumentList([...data])
                })
            }
        })
    }
    const columns=[
        {
            title: "标题",
            dataIndex: "name",
            key: "name",
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
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                    <span onClick={()=>delectWiki(record.id)} className = "span-botton" >删除</span>
            ),
        }
    ];


    return (
        <div className="work-relation">
            <div className="relation-top"> 
                <Search 
                    allowClear
                    placeholder="请输入关联文档名称" 
                    onSearch={searchSelectWorkWiki} 
                    enterButton 
                    style={{ width: 200 }}
                />
                <WorkWikiAddmodal
                    {...props}
                    name="添加文档"
                    selectIds = {selectIds}
                    setWorkDoucumentList={setWorkDoucumentList}
                />
            </div>
            <Table
                columns={columns}
                dataSource={workDoucumentList}
                rowKey={record=> record.id}
            />
        </div>
    )
}
export default inject(
    "workStore",
    "workRelation",
    "workWikiStore"
)(observer(WorkWiki));