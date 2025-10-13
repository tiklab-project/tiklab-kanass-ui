import React from "react";
import {Dropdown, Menu, Modal, Popconfirm} from "antd";
import "./HideDelete.scss"
import {EllipsisOutlined} from "@ant-design/icons";
import {PrivilegeButton, PrivilegeProjectButton} from "tiklab-privilege-ui";

const HideDelete = (props) =>{
    const {deleteFn, privilegeCode, projectId} = props;


    const menu = () => {
        return(
            <div className="delete-dropdown-more">
                {
                    privilegeCode ?
                        projectId ?
                            <PrivilegeProjectButton code={privilegeCode} domainId={projectId}  {...props}>
                                <div onClick={() => showDeleteConfirm(true)} className="dropdown-more-item">
                                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                                        <use xlinkHref="#icon-delete"></use>
                                    </svg>
                                    <span>删除</span>
                                </div>
                            </PrivilegeProjectButton>
                            :
                            <PrivilegeButton code={privilegeCode} {...props}>
                                <div onClick={() => showDeleteConfirm(true)} className="dropdown-more-item">
                                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                                        <use xlinkHref="#icon-delete"></use>
                                    </svg>
                                    <span>删除</span>
                                </div>
                            </PrivilegeButton>
                        :
                        <div onClick={() => showDeleteConfirm(true)} className="dropdown-more-item">
                            <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                                <use xlinkHref="#icon-delete"></use>
                            </svg>
                            <span>删除</span>
                        </div>
                }
            </div>
        )
    };


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
        <div className={"hide-delete"}>
            <Dropdown overlay={() => menu()} placement="bottomRight">
                <span>
                    <EllipsisOutlined style={{fontSize:24}} />
                </span>
            </Dropdown>

        </div>
    )
}

export default HideDelete;