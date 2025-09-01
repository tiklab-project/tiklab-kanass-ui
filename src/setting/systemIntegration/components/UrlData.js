import React, { Fragment, useEffect, useState } from "react";
import { Collapse, Button, message, Space, Tooltip } from 'antd';
import { LinkOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import "./UrlData.scss";
import { observer, Provider } from "mobx-react";
import UrlAddData from "./UrlAddData";
import UrlDataStore from "../store/UrlDataStore";
import {PrivilegeButton} from "tiklab-privilege-ui";

const { Panel } = Collapse;

const UrlData = () => {
    const store = {
        urlDataStore: UrlDataStore
    };

    const { findAllSystemUrl, deleteSystemUrl } = UrlDataStore;
    const [urlDataList, setUrlDataList] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const [urlAddvisible, setUrlAddvisible] = useState(false);
    const [actionType, setActionType] = useState("");
    const [urlId, setUrlId] = useState("");
    const [selectedSystem, setSelectedSystem] = useState("");

    // 预定义的系统列表
    const systemList = [
        { name: "sward", description: "sward知识库文档服务地址配置" },
        // { name: "testhubo", description: "testhubo测试系统地址配置" }
    ];

    // 获取系统数据
    const getSystemData = (systemName) => {
        return urlDataList.find(item => item.name === systemName) || null;
    };

    // 编辑地址
    const editSystemUrl = (id, system, e) => {
        e.stopPropagation(); // 阻止冒泡，防止触发 Collapse 的展开/折叠
        setActionType("edit");
        setUrlId(id);
        setSelectedSystem(system);
        setUrlAddvisible(true);
        setModalTitle("编辑地址");
    };

    // 删除地址
    const deleSystemUrl = (id, e) => {
        e.stopPropagation(); // 阻止冒泡，防止触发 Collapse 的展开/折叠
        const params = new FormData();
        params.append("id", id);
        deleteSystemUrl(params).then(res => {
            if (res.code === 0) {
                findAllSystemUrl().then(data => {
                    if (data.code === 0) {
                        setUrlDataList(data.data);
                    }
                });
                message.success("删除成功");
            }
        });
    };

    // 添加地址
    const addUrl = (system, e) => {
        if (e) e.stopPropagation();
        setModalTitle(`设置${system}地址`);
        setUrlAddvisible(true);
        setActionType("add");
        setSelectedSystem(system);
    };

    // 初始加载数据
    useEffect(() => {
        findAllSystemUrl().then(res => {
            setUrlDataList(res.data);
        });
    }, []);

    return (
        <Provider {...store}>
            <Fragment>
                <div className="url-data">
                    <Breadcumb firstText="服务集成" />

                    <Collapse
                        expandIconPosition="right"
                        className="url-collapse"
                        defaultActiveKey={[]}
                    >
                        {systemList.map(system => {
                            const systemData = getSystemData(system.name);

                            return (
                                <Panel
                                    key={system.name}
                                    header={
                                        <div className="panel-header">
                                            <span className="panel-title">
                                                <LinkOutlined className="link-icon" /> {system.name}
                                            </span>
                                            <span className="panel-desc">{system.description}</span>
                                        </div>
                                    }
                                >
                                    {!systemData ? (
                                        <div className="empty-content">
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={(e) => addUrl(system.name, e)}
                                            >
                                                设置{system.name}服务
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="panel-content">
                                            <div className="url-item">
                                                <div className="url-label">系统地址:</div>
                                                <div className="url-value">{systemData.systemUrl}</div>
                                            </div>
                                            {/*{systemData.webUrl && (*/}
                                            {/*    <div className="url-item">*/}
                                            {/*        <div className="url-label">浏览器端地址:</div>*/}
                                            {/*        <div className="url-value">{systemData.webUrl}</div>*/}
                                            {/*    </div>*/}
                                            {/*)}*/}
                                            <div className="action-buttons">
                                                <Space>
                                                    <PrivilegeButton code={"url_data_update"}>
                                                        <Button
                                                            type="primary"
                                                            size="small"
                                                            icon={<EditOutlined />}
                                                            onClick={(e) => editSystemUrl(systemData.id, system.name, e)}
                                                        >
                                                            编辑
                                                        </Button>
                                                    </PrivilegeButton>
                                                    <PrivilegeButton code={"url_data_delete"}>
                                                        <Button
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            onClick={(e) => deleSystemUrl(systemData.id, e)}
                                                        >
                                                            删除
                                                        </Button>
                                                    </PrivilegeButton>
                                                </Space>
                                            </div>
                                        </div>
                                    )}
                                </Panel>
                            );
                        })}
                    </Collapse>
                </div>

                <UrlAddData
                    urlAddvisible={urlAddvisible}
                    setUrlAddvisible={setUrlAddvisible}
                    modalTitle={modalTitle}
                    actionType={actionType}
                    setUrlDataList={setUrlDataList}
                    urlId={urlId}
                    selectedSystem={selectedSystem}
                />
            </Fragment>
        </Provider>
    );
};

export default observer(UrlData);