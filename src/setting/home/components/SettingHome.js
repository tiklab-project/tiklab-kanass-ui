import React, { useEffect, useState } from "react";
import "./SettingHome.scss";
import { Row, Col } from "antd";
import SettingHomeStore from "../store/SettingHomeStore"

const SettingHome = (props) => {
    const { findOrgaNum } = SettingHomeStore;
    const [numList, setNumList] = useState({});
    const authType = JSON.parse(localStorage.getItem("authConfig"))?.authType;
    useEffect(() => {
        findOrgaNum().then(res => {
            if (res.code === 0) {
                console.log(res.data)
                setNumList(res.data)
            }
        })
    }, [])

    const list = [
        {
            title: '用户与权限',
            key: "user",
            cloudShow: false,
            eeShow: true,
            children: [
                {
                    title: '部门',
                    key: "orga",
                    islink: true,
                    path: '/setting/organ'

                },
                {
                    title: '用户',
                    key: "user",
                    islink: true,
                    path: '/setting/user'
                },
                {
                    title: '用户组',
                    key: "userGroup",
                    islink: true,
                    path: '/setting/usergroup'
                },
                {
                    title: '用户目录',
                    key: "userDir",
                    islink: true,
                    path: '/setting/directory'
                },
                {
                    title: '权限',
                    key: "privilage",
                    path: '/setting/systemRole'
                }
            ]
        },
        {
            title: '权限',
            key: "user",
            cloudShow: true,
            eeShow: false,
            children: [
                {
                    title: '权限',
                    key: "privilage",
                    path: '/setting/systemRole'
                }
            ]
        },
        {
            title: '事项配置',
            key: "workItem",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '事项类型',
                    key: "workType",
                    path: '/setting/worktype',
                },
                {
                    title: '事项优先级',
                    key: "workPriority",
                    path: '/setting/workpriority',
                },
            ]
        },
        {
            title: '消息',
            key: "message",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '消息通知方案',
                    key: "messageNotice",
                    path: '/setting/messageNotice',
                },
                {
                    title: '消息发送方式',
                    key: "messageSendType",
                    path: '/setting/messageSendType',
                },
            ]
        },
        {
            title: '表单',
            key: "form",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '字段类型',
                    key: "fieldType",
                    path: '/setting/preliminaryType',
                },
                {
                    title: '字段',
                    key: "field",
                    path: '/setting/preliminary',
                },
                {
                    title: '表单',
                    key: "form",
                    path: '/setting/form',
                },
            ]
        },
        {
            title: '流程',
            key: "flow",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '流程',
                    key: "flow",
                    path: '/setting/systemFlow',
                },
                {
                    title: '节点',
                    key: "stateNode",
                    path: '/setting/nodestatus',
                }
            ]
        },
        {
            title: '插件',
            key: "plugin",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '插件',
                    key: "plugin",
                    path: '/setting/plugin',
                },
            ]
        },
        {
            title: '系统集成',
            key: "systemIntergrtion",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: 'JIRA',
                    key: "jira",
                    noShowNum: true,
                    path: '/setting/loadData',
                },
                {
                    title: '地址配置',
                    key: "urlData",
                    path: '/setting/urlData',
                },
            ]
        },
        {
            title: '安全',
            key: "security",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '操作日志',
                    key: "logList",
                    path: '/setting/logList',
                },
                {
                    title: '备份与恢复',
                    key: "backups",
                    noShowNum: true,
                    path: '/setting/backups',
                },
            ]
        },
        {
            title: '应用',
            key: "systemversion",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '版本与许可证',
                    key: "version",
                    noShowNum: true,
                    path: '/setting/version',
                },
                {
                    title: '应用访问权限',
                    key: "productAuth",
                    path: '/setting/productAuth',
                },
            ]
        }
    ]

    const goPage = (data) => {
        props.history.push(data.path)

        if (data.islink && !authType) {
            const authUrl = JSON.parse(localStorage.getItem("authConfig")).authServiceUrl;
            window.location.href = authUrl;
        } else {
            props.history.push(data.path)
        }
    }


    return (
        <Row className="setting-home-row">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                <div className="setting-home">
                    {
                        list.map(item => {
                            if (item.cloudShow && version === "cloud") {
                                return <div className="setting-home-block" key={item.key}>
                                    <div className="setting-home-block-title">{item.title}</div>
                                    <div className="setting-home-block-content">
                                        {
                                            item.children.map(moduleItem => {
                                                return <div className="setting-home-block-content-item" key={moduleItem.key} onClick={() => goPage(moduleItem)}>
                                                    {
                                                        moduleItem.noShowNum ?
                                                            <div className="module-num"></div>
                                                            :
                                                            <div className="module-num">{numList[moduleItem.key] ? numList[moduleItem.key] : 0}</div>
                                                    }

                                                    <div className="module-title">{moduleItem.title}</div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            if (version !== "cloud" && item.eeShow) {
                                return <div className="setting-home-block" key={item.key}>
                                    <div className="setting-home-block-title">{item.title}</div>
                                    <div className="setting-home-block-content">
                                        {
                                            item.children.map(moduleItem => {
                                                return <div className="setting-home-block-content-item" key={moduleItem.key} onClick={() => goPage(moduleItem)}>
                                                    {
                                                        moduleItem.noShowNum ?
                                                            <div className="module-num"></div>
                                                            :
                                                            <div className="module-num">{numList[moduleItem.key] ? numList[moduleItem.key] : 0}</div>
                                                    }

                                                    <div className="module-title">{moduleItem.title}</div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            }

                        })
                    }
                </div>
            </Col>
        </Row>

    )
}
export default SettingHome;