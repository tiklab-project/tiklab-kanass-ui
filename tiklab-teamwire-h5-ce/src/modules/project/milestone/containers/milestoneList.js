/*
 * @Descripttion: 
 * @milestone: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 19:14:48
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-21 09:11:10
 */
/*
 * @Descripttion: 
 * @milestone: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 17:06:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:07:05
 */
import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import "../components/milestone.scss";
import { withRouter } from 'react-router';

const MilestoneList = (props) => {
    const { milestoneStore } = props;
    const { findMilestoneList } = milestoneStore;
    const [milestoneList, setMilestoneList] = useState();
    const projectId = localStorage.getItem("projectId");
    useEffect(() => {
        findMilestoneList({ projectId: projectId }).then((data) => {
            if (data.code === 0) {
                setMilestoneList(data.data)
            }
        })
    }, [])

    const statusSet = (value) => {
        let data = ""
        switch (value) {
            case "1":
                data = "未开始";
                break;
            case "2":
                data = "已启动";
                break;
            case "3":
                data = "已结束";
                break;
            default:
                data = "未知";
                break;

        }
        return data;
    }

    return (
        <div className="home">
            <div className='milestone'>
                <div className='milestone-search'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                        }}
                    />
                    <Button
                        size='mini'
                        color='primary'
                        onClick={() => {
                            props.history.push("/milestoneAdd")
                        }}
                    >
                        添加里程碑
                    </Button>
                </div>
                {
                    milestoneList && milestoneList.length > 0 && milestoneList.map(item => {
                        return <div className="milestone-list" key = {item.id}>
                            <div className='milestone-left'>
                                <div className='milestone-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div >
                                        <span className='milestone-title' onClick={() => props.history.push({ pathname: `/milestoneDetail/${item.id}` })}>{item.name}</span>
                                        <span>
                                            {item.master ? item.master.name : "admin"}
                                        </span>
                                    </div>
                                    <div>
                                        {item.milestoneTime}
                                    </div>
                                </div>
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
export default withRouter(inject("milestoneStore")(observer(MilestoneList)));