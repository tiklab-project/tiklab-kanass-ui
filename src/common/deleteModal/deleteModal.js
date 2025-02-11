/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 13:45:43
 * @Description: 删除dropdown
 */

import React from "react";
import { Dropdown, Modal, Menu } from "antd";
import "./deleteModal.scss"
const DeleteModal = (props) => {
    const {deleteFunction, id, getPopupContainer, content} = props;
    const moreMenu = () => {
        return <Menu onClick={(value) => selectAction(value)}>
            <Menu.Item key="delete">
                <div>删除</div>
            </Menu.Item>
        </Menu>
    };

    const selectAction = (value) => {
        if(value.key === "delete"){
            Modal.confirm({
                title: '确定删除?',
                content: content,
                centered: true,
                className: "delete-modal",
                getContainer: getPopupContainer,
                onOk() { deleteFunction(id) },
                onCancel() { },
            });
        }
    }
    return (
        <Dropdown
            overlay={() => moreMenu()}
            placement="bottomLeft"
            trigger="click"
            getPopupContainer = {getPopupContainer ? () => getPopupContainer : null}
        >
            <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }}>
                <use xlinkHref="#icon-more"></use>
            </svg>

        </Dropdown> 
        
    )
}

export default DeleteModal;