/*
 * @Descripttion: 事项添加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-15 14:34:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-25 15:46:44
 */
import React, { useImperativeHandle, useState, useRef, useEffect } from "react";
import {Modal, message, Button} from 'antd';
import WorkAddPage from "./WorkAddPage";
import "./WorkAddModel.scss"
import { observer, inject } from "mobx-react";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import IconBtn from "../../../common/caseCommon/iconBtn/IconBtn";

const WorkAddModel = (props) => {

    const { testPlanId,caseId,workAddModel,  getWorkDetail, setChildWorkList, workTypeId, stageList } = props
    const workAddPageRef = useRef()
    const [showAddModel, setShowAddModel] = useState(false)
    const [isEditStart, setIsEditStart] = useState(false);
    const projectId = localStorage.getItem("projectId")

    const showModal =async () => {


        setShowAddModel(true);
    };

    // 关闭详情弹窗,提交数据
    const handleOk =  () => {

        workAddPageRef.current.submit(setShowAddModel)
    };




    // 点击取消按钮
    const handleCancel = () => {
        if (isEditStart === true) {
            Modal.confirm({
                title: '您的更改将不会保存',
                icon: <ExclamationCircleOutlined />,
                content: '如果您离开此页面，我们将无法保存您的数据',
                className: "work-addmodel-close-cinfirm",
                onOk() {
                    setShowAddModel(false);
                }
            });
        }else {
            setShowAddModel(false);
        }
        setIsEditStart(false)
    };


    // 暴露方法给父组件
    useImperativeHandle(workAddModel, () => ({
        setShowAddModel: setShowAddModel
    }))

    const getModalWidth = () => {
        const width = window.innerWidth;

        if (width >= 1600) {
            return 1100;
        } else if (width < 1600 && width >= 1200) {
            return 1000;
        } else if (width < 1200 && width >= 992) {
            return 900;
        } else if (width < 992 && width >= 768) {
            return 700;
        } else if (width < 768 && width >= 576) {
            return 500;
        } else if (width < 576) {
            return 400;
        }
    }


    return (
        <>
            {/*<IconBtn*/}
            {/*    className="pi-icon-btn-grey"*/}
            {/*    name={"添加缺陷"}*/}
            {/*    onClick={showModal}*/}
            {/*/>*/}
            <div onClick={showModal} style={{cursor:"pointer", display:"flex", alignItems:"center"}}>
                <svg className="icon-18" aria-hidden="true">
                    <use xlinkHref={`#icon-add2`}></use>
                </svg>
                <span>添加缺陷</span>
            </div>
            <Modal
                title="添加缺陷"
                visible={showAddModel}
                width={getModalWidth()}
                className="work-addmodel"
                destroyOnClose={true}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="取消"
                okText="确定"
                // closable={false}
                footer={null}
                maskClosable={false}
                bodyStyle={{
                    // maxHeight: 'calc(100vh - 200px)',
                    // overflow: 'auto',
                    padding: '16px'
                }}
                // style={{
                //     top: '50px'
                // }}
            >
                <WorkAddPage
                    projectId={projectId}
                    caseId={caseId}
                    workAddPageRef={workAddPageRef}
                    getWorkDetail={getWorkDetail}
                    setChildWorkList={setChildWorkList}
                    setShowAddModel={setShowAddModel}
                    handleCancel = {handleCancel}
                    stageTreeList = {stageList}
                    {...props}
                    workTypeId={workTypeId}
                    setIsEditStart={setIsEditStart}
                    testPlanId={testPlanId}
                ></WorkAddPage>
            </Modal>
        </>

    )
}
export default observer(WorkAddModel);