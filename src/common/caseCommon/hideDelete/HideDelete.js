import React from "react";
import {Dropdown, Menu, Modal, Popconfirm} from "antd";
import IconCommon from "../IconCommon";
import {EllipsisOutlined} from "@ant-design/icons";

const HideDelete = (props) =>{
    const {deleteFn} = props;


    const menu = (
        <Menu>
            <Menu.Item key={1}>
                <div style={{cursor:"pointer",width:"100px"}}  onClick={() => showDeleteConfirm()}>删除</div>
            </Menu.Item>
        </Menu>
    );


    // 删除确认
    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: '删除',
            content: '确定要删除吗？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteFn()
            },
        });
    };


    return(
        <>
            <Dropdown overlay={menu} placement="bottomRight">
                <span>
                    <EllipsisOutlined style={{fontSize:24}} />
                </span>
            </Dropdown>

        </>
    )
}

export default HideDelete;