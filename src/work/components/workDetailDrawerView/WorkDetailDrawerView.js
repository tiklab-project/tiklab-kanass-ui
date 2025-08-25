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
import WorkDetail from "../WorkDetail";
import "./WorkDetailDrawerView.scss"
import { observer, inject } from "mobx-react";

const WorkDetailDrawer = (props) => {
    const detailRef = useRef()
    const { isModalVisible, setIsModalVisible, showPage, modelRef, workStore,
        delectCurrentWorkItem, detailWidth } = props;
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
        console.log("出发了  父组件effect")
        const handleClickOutside = (event) => {
            if (detailRef.current && !detailRef.current.contains(event.target)) {
                closeDrawer();
            }
        };

        document.addEventListener("mouseup", handleClickOutside, false);
        return () => {
            document.removeEventListener("mouseup", handleClickOutside, false);
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
                className={"work-detail-drawer-view"}
                closable={false}
                destroyOnClose={true}
                width={detailWidth}
                style={{
                    transform: 'translateX(0)',
                    // maxWidth: '800px',
                    // minWidth: '500px'
                }}//子抽屉打开后父抽屉不被推动
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
                        drawerView={true}
                    />
                </div>
            </Drawer>
        </>


    );
};

export default inject("workStore")(observer(WorkDetailDrawer));