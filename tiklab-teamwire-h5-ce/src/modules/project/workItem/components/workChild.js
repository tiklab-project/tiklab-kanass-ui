import React, { useState, useRef, useEffect, Fragment } from "react";
import { observer, inject } from "mobx-react";
import {  Avatar, SearchBar,Button } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import "./workChild.scss"
import { withRouter } from "react-router";

const WorkChild = (props) => {
    const { workChild, workType } = props;
    const { getWorkChildList } = workChild;
    const [childWorkList, setChildWorkList] = useState([]);
    const workId = props.match.params.id;
    useEffect(() => {
        findWorkChildList()
        return;
    }, [workId])

    const findWorkChildList = () => {
        const params = {
            parentId: workId,
            workTypeId: workType.id,
            title: null,
            pageParam: {
                currentPage: 1,
                pageSize: 10
            }
        }
        getWorkChildList(params).then(res => {
            if (res.code === 0) {
                setChildWorkList(res.data.dataList)
            }

        })
    }


    return (
        <Fragment>
            <div className='workLog-search'>
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
            <div className='workLog-content'>
                {
                    childWorkList && childWorkList.length > 0 && childWorkList.map(item => {
                        return <div className="workLog-list" key = {item.id}>
                            <div className='workLog-left'>
                                <div className='workLog-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div className='workLog-title'  onClick={() => props.history.push(`/workItemDetail/${item.id}`)}>{item.title}</div>
                                    <div onClick={() => props.history.push({ pathname: "/project/projectDetail" })}>
                                        {item.builder ?item.builder.name : "admin"}
                                    </div>
                                </div>
                            </div>
                            <div className='workLog-time'>
                                {item.workStatus.name}
                            </div>
                            <div>
                                {item.workPriority && item.workPriority.name}
                            </div>
                            <div>
                                <EyeOutline />
                            </div>
                        </div>
                    })
                }
            </div>
        </Fragment>
    )
}
export default withRouter(inject("workItemStore", "workChild")(observer(WorkChild)));