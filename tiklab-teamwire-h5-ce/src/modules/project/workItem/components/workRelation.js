import React, { Fragment, useEffect, useState } from "react";
import { Avatar, SearchBar,Button } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { observer, inject } from "mobx-react";
import "./workRelation.scss"
import { withRouter } from "react-router";

const WorkRelation = (props) => {
    const { workRelation, workItemStore } = props;
    const workId  = props.match.params.id;;
    const { selectWorkRelationList, getSelectWorkRelationList } = workRelation;
    const [selectIds, setSelectIds] = useState();
    
    useEffect(() => {
        getSelectWorkRelationList({ workId: workId }).then((res) => {
            let array = [workId];
            if (res && res.length > 0) {
                res.map((item) => {
                    array.push(item.relateWorkItem.id)
                    return array;
                })
            }

            setSelectIds(array)
        })


    }, [workId])

    return (
        <div className="work-relation">
            <div className='work-relation-search'>
                <SearchBar
                    placeholder='请输入内容'
                    style={{
                        '--border-radius': '100px',
                    }}
                    onChange = {(value) => searchWorkItem(value)}
                />
            </div>
            <div className='work-relation-content'>
                {
                    selectWorkRelationList && selectWorkRelationList.length > 0 && selectWorkRelationList.map(item => {
                        return <div className="work-relation-list" key = {item.id}>
                            <div className='work-relation-left'>
                                <div className='work-relation-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div className='work-relation-title'  onClick={() => props.history.push(`/workItemDetail/${item.id}`)}>{item.relateWorkItem.title}</div>
                                    <div>
                                        {item.relateWorkItem.builder ?item.relateWorkItem.builder.name : "admin"}
                                    </div>
                                </div>
                            </div>
                            <div className='work-relation-type'>
                                {item.relateWorkItem.workType.name}
                            </div>
                            <div>
                                未开始
                            </div>
                            <div>
                                <EyeOutline />
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(inject(
    "workItemStore",
    "workRelation"
)(observer(WorkRelation)));