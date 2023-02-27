/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 17:04:29
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:38:24
 */
import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Button, Drawer } from 'antd';
import WorkDetail from "./WorkDetail";
import "./WorkDetail.scss"
import { observer, inject } from "mobx-react";

const WorkBorderDetail = (props) => {
    const detailRef = useRef()
    const { isModalVisible, setIsModalVisible, workStore, modelRef } = props;
    const { setWorkId, setWorkIndex } = workStore;
    const [title, setTitle] = useState("查看事项");

    const showModal = (id, index, title) => {
        setIsModalVisible(true);
        
    }
       

    useImperativeHandle(modelRef, () => ({
        showDetail: showModal
    }))


    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Drawer
            placement="right"
            onClose={handleCancel}
            // title={"事项详情"}
            visible={isModalVisible}
            className="work-table-detail"
            width={1000}
            closable={false}
            destroyOnClose={true}
        >
            <WorkDetail detailRef={detailRef} {...props} />
        </Drawer>
    );
};

export default inject("workStore")(observer(WorkBorderDetail));