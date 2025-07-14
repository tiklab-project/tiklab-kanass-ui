import {Dropdown, Menu, message, Modal} from "antd";
import React, {useState} from "react";
import ModuleStore from "../../project/setting/module/store/ModuleStore";
import WorkModuleEditModal from "./WorkModuleEditModal";


const WorkModuleFilterOperateSelectModal = (props) => {
    const { getPopupContainer, moduleInfo, selectTreeData, handleNodeClick } = props;
    const {deleteModule} = ModuleStore
    const [editModalVisible, setEditModalVisible] = useState(false)

    const handleDeleteNodeClick = (id) => {
        // 先检查是否存在关联的事项
        deleteModule(id).then(res => {
            if (res.data === false){
                message.error("该模块下存在事项无法删除")
            }
            selectTreeData()
            handleNodeClick(null, null)
        });
    }

    const deleteModal = (id) => {
        Modal.confirm({
            title: '确定删除?',
            centered: true,
            className: "delete-modal",
            getContainer: getPopupContainer,
            onOk() { handleDeleteNodeClick(id) },
            onCancel() { },
        });
    }

    const selectAction = (value) => {

        if(value.key === "delete"){
            deleteModal(moduleInfo.id);
        }else if(value.key === "edit") {
            setEditModalVisible(true)
        }

    }

    const moreMenu = () => {
        return <Menu onClick={(value) => selectAction(value)}>
            <Menu.Item key="edit">
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <span>编辑</span>
                </div>
            </Menu.Item>
            <Menu.Item key="delete">
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                        <use xlinkHref="#icon-delete"></use>
                    </svg>
                    <span>删除</span>
                </div>
            </Menu.Item>
        </Menu>
    };

    return(
        <>
            <Dropdown
                overlay={() => moreMenu()}
                placement="bottomLeft"
                trigger="click"
                getPopupContainer = {getPopupContainer ? () => getPopupContainer.current : null}
            >
                <svg style={{
                    width: "22px",
                    height: "22px"
                }} className="operate-icon" aria-hidden="true">
                    <use xlinkHref="#icon-more-default"></use>
                </svg>

            </Dropdown>

            <WorkModuleEditModal
                moduleInfo={moduleInfo}
                moduleStore={ModuleStore}
                moduleVisible={editModalVisible}
                setModuleVisible={setEditModalVisible}
                selectTreeData={selectTreeData}
            />

        </>


    )
};

export default WorkModuleFilterOperateSelectModal;