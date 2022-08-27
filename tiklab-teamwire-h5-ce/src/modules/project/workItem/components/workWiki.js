/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-27 09:41:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-10-09 15:25:16
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Avatar, SearchBar,Button, Empty } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { observer, inject } from "mobx-react";
import "./workWiki.scss"
const WorkWiki = (props) => {
    const { workWikiStore,workItemStore } = props;
    const {findDocumentPageByItemId,deleteWorkItemDocument} = workWikiStore;
    const {workId} = workItemStore;
    const [workDoucumentList,setWorkDoucumentList] = useState([])
    useEffect(()=> {
        findDocumentPageByItemId({workItemId: workId}).then((data)=> {
            setWorkDoucumentList([...data])
        })
        return;
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
    <div className='work-wiki'>
        <div className='work-wiki-search'>
            <SearchBar
                placeholder='请输入内容'
                style={{
                    '--border-radius': '100px',
                }}
                onChange = {(value) => searchWorkItem(value)}
            />
            {/* <Button
                size='mini'
                color='primary'
                onClick={() => {
                    props.history.push("/workItemAdd")
                }}
            >
                添加事项
            </Button> */}
        </div>
        <div className='work-wiki-content'>
            {
                workDoucumentList && workDoucumentList.length > 0 ? workDoucumentList.map(item => {
                    return <div className="work-wiki-list" key = {item.id}>
                        <div className='work-wiki-left'>
                            <div className='work-wiki-icon'>
                                <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                            </div>
                            <div>
                                <div className='work-wiki-title'  onClick={() => props.history.push(`/workItemDetail/${item.id}`)}>{item.workItem.title}</div>
                                <div>
                                    {item.worker ?item.worker.name : "admin"}
                                </div>
                            </div>
                        </div>
                        <div className='work-wiki-time'>
                            {item.takeupTime}
                        </div>
                        <div>
                            {item.workDate}
                        </div>
                        <div>
                            <EyeOutline />
                        </div>
                    </div>
                })
                :
                <Empty description='暂无数据' />
            }
        </div>
    </div>
    )
}
export default inject(
    "workItemStore",
    "workWikiStore"
)(observer(WorkWiki));