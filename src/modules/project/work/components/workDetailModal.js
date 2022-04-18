/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 17:04:29
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:38:24
 */
import React, { useRef,useImperativeHandle,useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import WorkDetail from "./workDetail"
import { observer, inject } from "mobx-react";

const workDetailModal = (props) => {
    const detailRef = useRef()
    const {isModalVisible, setIsModalVisible,workStore,modelRef} = props;
    const {setWorkId,setWorkIndex} = workStore;
    const [title,setTitle] = useState("查看事项");
    
    const showModal = (id,index,title) => {
        setIsModalVisible(true);
        setWorkIndex(index)
        setWorkId(id)
        setTitle(title)
    };

    useImperativeHandle(modelRef,()=> ({
        showDetail: showModal
    }))
    

    const handleOk = () => {
        setIsModalVisible(false);
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    return (
            <Modal 
                title={title}
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel} 
                className="work-detailmodel"
                width= {800}
                destroyOnClose={true}
            >
                <WorkDetail detailRef = {detailRef} {...props}/>
            </Modal>
    );
};

export default inject("workStore")(observer(workDetailModal));