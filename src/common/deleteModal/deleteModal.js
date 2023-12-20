import React from "react";
import { Dropdown, Modal, Menu } from "antd";
import "./deleteModal.scss"
const DeleteModal = (props) => {
    const {deleteFunction, id, getPopupContainer} = props;
    const moreMenu = () => {
        return <Menu onClick={(value) => selectAction(value)}>
            <Menu.Item key="delete">
                <div>删除</div>
            </Menu.Item>
        </Menu>
    };

    const selectAction = (value) => {
        console.log(value)
        if(value.key === "delete"){
            Modal.confirm({
                title: '确定删除?',
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