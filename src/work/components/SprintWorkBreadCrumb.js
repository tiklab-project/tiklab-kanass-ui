import React, { useState, useRef, useEffect } from "react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { DownOutlined, CodepenOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Form, Popconfirm, message } from 'antd';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { useSelector } from "tiklab-plugin-core-ui";
import "./WorkBreadCrumb.scss";
import WorkAddModel from "./WorkAddModel";
import WorkFilterSort from "./WorkChangeView";
import Button from "../../common/button/button";

const SprintWorkBreadCrumb = (props) => {
    const { workStore } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { workTypeList, workId, workBreadCrumbText,
        workShowType, viewType, setViewType, setWorkShowType,
        getWorkConditionPageTree, getWorkConditionPage, setWorkIndex, setWorkId, getWorkBoardList } = workStore;
    const [stateType, setState] = useState();
    const projectId = props.match.params.id ? props.match.params.id : null;
    const pluginStore = useSelector(state => state.pluginStore);
    const workAddModel = useRef()

    const [showViewDropDown, setShowViewDropDown] = useState(false);
    const viewDropDown = useRef();


    const [showTreeDropDown, setShowTreeDropDown] = useState(false);
    const treeDropDown = useRef();

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

    useEffect(() => {
        window.addEventListener("mousedown", closeTreeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeTreeModal, false);
        }
    }, [showViewDropDown])

    const closeTreeModal = (e) => {
        if (!treeDropDown.current) {
            return;
        }
        if (!treeDropDown.current.contains(e.target) && treeDropDown.current !== e.target) {
            setShowTreeDropDown(false)
        }
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
                            <div onClick={() => buy()}>导入?</div>
                        </Popconfirm>
                }
            </Menu.Item>
        </Menu>
    );

    const buy = () => {
        message.info('暂未开通购买渠道')
    }

    const importFile = () => {
        setIsModalVisible(true);
    };

    const menu = (id) => {
        return <Menu onClick={(value) => selectAddType(value, id)}>
            {
                workTypeList && workTypeList.map((item) => {
                    return <Menu.Item key={item.id} typework={item.workType.category} icon={<CodepenOutlined />}>
                        {item.name}
                    </Menu.Item>
                })
            }
        </Menu>
    };

    const selectAddType = (e) => {
        const params = { type: e.key, id: workId, title: `添加事项`, typework: e.item.props.typework }
        setState(params)
        workAddModel.current.setShowAddModel(true)
    }


    const getPageTree = (value) => {
        getWorkConditionPageTree(value).then((res) => {
            if (res.dataList.length > 0) {
                if (props.match.path === "/index/projectDetail/:id/workMessage/:id"
                ) {
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
        <div className="work-top">
            <div className="work-top-head">
                <div className="work-top-title">事项</div>
                <div className="work-top-right">
                    <PrivilegeProjectButton code={'WorkAdd'} domainId={projectId}  {...props}>
                        <Dropdown trigger="click" overlay={menu} className="right-item add-work">

                            <Button type="primary">
                                添加事项
                            </Button>
                        </Dropdown>
                    </PrivilegeProjectButton>
                    <Dropdown trigger="click" overlay={menuPlugin} className="right-item">
                        <Button>
                            <svg className="work-button-icon" aria-hidden="true">
                                <use xlinkHref={`#icon-more`}></use>
                            </svg>
                        </Button>
                    </Dropdown>
                    <WorkFilterSort
                        getPageList={getPageList}
                        getPageTree={getPageTree}
                        getWorkConditionPage={getWorkConditionPage}
                        getWorkConditionPageTree={getWorkConditionPageTree}
                        getWorkBoardList={getWorkBoardList}
                        viewType={viewType}
                        workShowType={workShowType}
                        setWorkShowType={setWorkShowType}
                        setViewType={setViewType}
                        buttonType="button"
                    />
                    {/* <WorkSort upDownSort={upDownSort} sortType={sortType} buttonType = {"button"}/> */}
                </div>
                <WorkAddModel workAddModel={workAddModel} state={stateType} {...props} />
            </div>
        </div>
    )
}
export default withRouter(inject("workStore")(observer(SprintWorkBreadCrumb)));