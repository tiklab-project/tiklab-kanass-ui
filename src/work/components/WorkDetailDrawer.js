/*
 * @Descripttion: 事项详情抽屉
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 17:04:29
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:31:29
 */
import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Select, Drawer } from 'antd';
import WorkDetail from "./WorkDetail";
import "./WorkDetail.scss"
import { observer, inject } from "mobx-react";

const WorkDetailDrawer = (props) => {
    const detailRef = useRef()
    const { isModalVisible, setIsModalVisible, showPage, modelRef, workStore, 
        delectCurrentWorkItem } = props;
    const { setWorkId, workShowType } = workStore;

    /**
     * 打开事项详情抽屉
     */
    const showModal = () => {
        setIsModalVisible(true);
    }

    /**
     * 暴露给父组件的方法
     */
    useImperativeHandle(modelRef, () => ({
        showDetail: showModal
    }))

    /**
     * 监听鼠标事件，关闭事项详情抽屉
     */ 
    useEffect(() => {
        document.addEventListener("mouseup", closeModal, false);
        return () => {
            document.removeEventListener("mouseup", closeModal, false);
        }

    }, [isModalVisible])

    /**
     * 关闭事项详情抽屉
     */
    const closeModal = (e) => {
        if (!detailRef.current) {
            return;
        }
        let IsSelectclear = false;
        if (e.target.localName === "path") {
            const classList = e.target.parentElement.parentElement.classList;
            if (classList.value === "anticon anticon-close-circle") {
                IsSelectclear = true
            }
        } else {
            IsSelectclear = false
        }

        if (!detailRef.current.contains(e.target) && detailRef.current !== e.target && !IsSelectclear && isModalVisible) {
            let pathname = props.location.pathname; // props.location.pathname;
            if(workShowType === "gantt"){
                props.history.replace(`${pathname}`)
            }else {
                const index = pathname.lastIndexOf("\/");
                pathname = pathname.substring(0, index);
                props.history.replace(`${pathname}`)
            }
            
            setIsModalVisible(false)
            setWorkId(0)
        }
    }

    /**
     * 手动关闭事项详情抽屉
     */
    const closeDrawer = () => {
        let pathname = props.location.pathname;
        const index = pathname.lastIndexOf("\/");
        pathname = pathname.substring(0, index);
        props.history.replace(`${pathname}`)
        setIsModalVisible(false);
        setWorkId(0)
    };

    return (<>
        <Drawer
            placement="right"
            onClose={closeDrawer}
            visible={isModalVisible}
            className={`${isModalVisible ? "work-table-detail" : ''} `}
            closable={false}
            destroyOnClose={true}
            mask={false}
        >
            <div className="work-detail-drawer" ref={detailRef}>
                <WorkDetail 
                    {...props} 
                    showPage={showPage} 
                    // deleteWork = {deleteWork} 
                    setIsModalVisible={setIsModalVisible} 
                    delectCurrentWorkItem = {delectCurrentWorkItem}
                    closeModal = {closeModal}
                />
            </div>
        </Drawer>
    </>


    );
};

export default inject("workStore")(observer(WorkDetailDrawer));