import React, { useState, useRef, useEffect, Fragment } from "react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { Menu, Dropdown, Popconfirm, message } from 'antd';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { useSelector } from "tiklab-plugin-core-ui";
import "./WorkTableHead.scss";
import WorkAddModel from "./WorkAddModel";
import WorkFilterSort from "./WorkChangeView";
import Button from "../../common/button/Button";
import WorkCreatDropdown from "./workCreatDropdown";


const WorkTableHead = (props) => {
    const { workStore } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { workTypeList, workShowType, viewType, setViewType, setWorkShowType,
        getWorkConditionPageTree, getWorkConditionPage, searchCondition,
        setWorkIndex, setWorkId, getWorkBoardList, exportWorkItemXml } = workStore;
    const [stateType, setState] = useState();
    const projectId = props.match.params.id ? props.match.params.id : null;
    const pluginStore = useSelector(state => state.pluginStore);
    const workAddModel = useRef()

    const [showViewDropDown, setShowViewDropDown] = useState(false);
    const viewDropDown = useRef();


    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showViewDropDown])

    const closeModal = (e) => {
        if (!viewDropDown.current) {
            return;
        }
        if (!viewDropDown.current.contains(e.target) && viewDropDown.current !== e.target) {
            setShowViewDropDown(false)
        }
    }

    const exportFile = () => {
        exportWorkItemXml().then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file_name.xls');
            document.body.appendChild(link);
            link.click();
        })
    }

    const menuPlugin = (
        <Menu>
            <Menu.Item>
                {
                    pluginStore.filter(item => item.point === "import-modal").length > 0 ? <div onClick={() => importFile()}>导入</div> :
                        <Popconfirm
                            title="此服务需要购买，确认购买?"
                            okText="Yes"
                            cancelText="No"
                        >
                            <div onClick={() => buy()}>导入ss?</div>
                        </Popconfirm>
                }
            </Menu.Item>
            <Menu.Item>
                <div onClick={() => exportFile()}>导出</div>
            </Menu.Item>
        </Menu>
    );

    const buy = () => {
        message.info('暂未开通购买渠道')
    }

    const importFile = () => {
        setIsModalVisible(true);
    };


    const getPageTree = (value) => {
        getWorkConditionPageTree(value).then((res) => {
            if (res.dataList.length > 0) {
                setWorkIndex(1)
                setWorkId(res.dataList[0].id)
                props.history.push(`/index/projectDetail/${projectId}/workList/${res.dataList[0].id}`)
            } else {
                setWorkIndex(0)
                setWorkId(0)
            }
        })
    }

    const getPageList = (value) => {
        getWorkConditionPage(value).then((res) => {
            if (res.dataList.length > 0) {
                if (props.match.path === "/index/projectDetail/:id/workMessage/:id") {
                    setWorkIndex(1)
                    setWorkId(props.match.params.id)
                } else {
                    setWorkIndex(1)
                    setWorkId(res.dataList[0].id)
                }
            } else {
                setWorkIndex(0)
                setWorkId(0)
            }
        })
    }


    return (
        <Fragment>
            <div className="work-breadcrumb">
                <div className="work-title">事项</div>
                <div className="work-top-right">
                    <PrivilegeProjectButton code={'WorkAdd'} domainId={projectId}  {...props}>
                        <WorkCreatDropdown workTypeList={workTypeList}  {...props} />
                    </PrivilegeProjectButton>
                    <Dropdown trigger="click" overlay={menuPlugin} className="right-item">
                        <Button>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref={`#icon-more`}></use>
                            </svg>
                        </Button>
                    </Dropdown>
                    <WorkFilterSort
                        getPageList={getPageList}
                        getPageTree={getPageTree}
                        searchCondition={searchCondition}
                        getWorkConditionPage={getWorkConditionPage}
                        getWorkConditionPageTree={getWorkConditionPageTree}
                        getWorkBoardList={getWorkBoardList}
                        viewType={viewType}
                        workShowType={workShowType}
                        setWorkShowType={setWorkShowType}
                        setViewType={setViewType}
                        buttonType="button"
                    />
                </div>

            </div>
            <WorkAddModel workAddModel={workAddModel} workType={stateType} {...props} />
        </Fragment>
    )
}
export default withRouter(inject("workStore")(observer(WorkTableHead)));