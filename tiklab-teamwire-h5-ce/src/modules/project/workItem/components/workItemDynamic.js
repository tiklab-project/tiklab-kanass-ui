import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import Dynamic from '../../../../common/dynamic/dynamic';
import "./workItemDynamic.scss"
import { getUser } from 'tiklab-core-ui';
const WorkItemDynamic = (props) => {
    const { workItemStore } = props;
    const { findDynamicPage } = workItemStore;

    const [dynamicList, setDynamicList] = useState([]);

    useEffect(() => {
        findDynamicPage().then((data) => {
            if (data.code === 0) {
                setDynamicList(data.data.dataList)
            }
        })
    }, [])

    return (
        <div className="system-dynamic">
            <div className='system-dynamic-content'>
                {/* <div className='title'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                        }}
                        onChange = {(value) => searchProject(value)}
                    />
                    <Button
                        size='mini'
                        color='primary'
                        onClick={() => {
                            setVisible(true)
                        }}
                    >
                        添加项目
                    </Button>
                </div> */}
                <div className="system-dynamic-box">
                    {
                        dynamicList && dynamicList.length > 0 && dynamicList.map(item => {
                            return <Dynamic  dynamicData = {item} {...props} key = {item.id}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
export default inject("workItemStore")(observer(WorkItemDynamic));