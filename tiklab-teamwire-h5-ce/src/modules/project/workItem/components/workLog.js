import React, { useEffect, useState, useRef, Fragment } from "react";
import {  Avatar, SearchBar,Button } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { observer, inject } from "mobx-react";
import "./workLog.scss"
import { withRouter } from "react-router";

const WorkLog = (props) => {
    const { workLogStore, workItemStore } = props;
    const { getWorkLogList, workLogList, versionTime } = workLogStore;
    const workId = props.match.params.id;
    const [date, setDate] = useState('')
    const [remainTime, setRemainTime] = useState(0)


    useEffect(() => {
        getGemianTime()
        setDate(getNowFormatDate())
        return;
    }, [workId])


    // 计算剩余时间
    const getGemianTime = (page) => {
        getWorkLogList({ workItemId: workId }, page).then((res) => {
            let useTime = 0;
            if (res.length > 0) {
                res.map((item) => {
                    useTime += parseInt(item.takeupTime)
                })
                setRemainTime(parseInt(versionTime) - useTime)
            }
        })
    }



    // 设置日期选择器格式
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const getNowFormatDate = () => {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
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
            </div>
            <div className='workLog-content'>
                {
                    workLogList && workLogList.length > 0 && workLogList.map(item => {
                        return <div className="workLog-list" key = {item.id}>
                            <div className='workLog-left'>
                                <div className='workLog-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div className='workLog-title'  onClick={() => props.history.push(`/workItemDetail/${item.id}`)}>{item.workItem.title}</div>
                                    <div onClick={() => props.history.push({ pathname: "/project/projectDetail" })}>
                                        {item.worker ?item.worker.name : "admin"}
                                    </div>
                                </div>
                            </div>
                            <div className='workLog-time'>
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
                }
            </div>
        </Fragment>
    );
}

export default withRouter(inject("workLogStore","workItemStore")(observer(WorkLog)));
