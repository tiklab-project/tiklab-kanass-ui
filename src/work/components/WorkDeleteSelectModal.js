/*
 * @Descripttion: 删除事项下拉框
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:31:54
 */
import { inject, observer } from "mobx-react";
import { Dropdown, Menu, Modal } from "antd";
import React from "react";
import "./WorkDeleteSelectModal.scss"
const WorkDeleteSelectModal = (props) => {
    const { getPopupContainer, delectCurrentWorkItem, haveChildren, workId, setWorkId, workStore } = props;
    const {workList} = workStore;

    /**
     * 选择删除事项
     */
    const selectAction = (value) => {
        setWorkId(workId)
        haveChildren({ id: workId }).then(res => {
            console.log("查询下级事项",workList)
            if (res.code === 0) {
                let buttonText = "删除"
                if (res.data) {
                    buttonText = "删除事项和下级事项";
                } else {
                    buttonText = "删除"
                }
                if(value.key === "delete"){
                    Modal.confirm({
                        title: '删除事项?',
                        content: "确定删除事项",
                        centered: true,
                        okText: buttonText,
                        cancelText: "取消",
                        className: "delete-modal",
                        getContainer: getPopupContainer ? () => getPopupContainer.current : null,
                        onOk() { delectCurrentWorkItem(workId) },
                        // onCancel() { closeDeleteSelectModal(workId)},
                    });
                }
            }
        })
       
    }
    const moreMenu = () => {
        return <Menu onClick={(value) => selectAction(value)}>
            <Menu.Item key="delete">
                <div>删除</div>
            </Menu.Item>
        </Menu>
    };
    return (<>
        <Dropdown
            overlay={() => moreMenu()}
            placement="bottomLeft"
            trigger="click"
            getPopupContainer = {getPopupContainer ? () => getPopupContainer.current : null}
        >
            <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }}>
                <use xlinkHref="#icon-more"></use>
            </svg>

        </Dropdown> 
    </>


    )
}

export default inject("workStore")(observer(WorkDeleteSelectModal));