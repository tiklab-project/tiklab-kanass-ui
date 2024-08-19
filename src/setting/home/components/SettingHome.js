import React, { useEffect, useState } from "react";
import "./SettingHome.scss";
import { Row, Col } from "antd";
import SettingHomeStore from "../store/SettingHomeStore"
import { observer } from "mobx-react";
import ImgComponent from "../../../common/imgComponent/ImgComponent";

const SettingHome = (props) => {
    const { findOrgaNum, setSelectKey, selectKey } = SettingHomeStore;
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

    const list = {
        user: {
            title: '用户与权限',
            key: "user",
            cloudShow: false,
            eeShow: true,
            children: [
                {
                    title: '部门',
                    desc: "管理公司的部门以及部门的用户",
                    key: "orga",
                    islink: true,
                    path: '/setting/orga',
                    icon: "set-orga"

                },
                {
                    title: '用户',
                    key: "user",
                    desc: "管理所有用户、设置用户的个人信息",
                    islink: true,
                    path: '/setting/user',
                    icon: "set-user"
                },
                {
                    title: '用户组',
                    key: "userGroup",
                    desc: "以分组的形式管理用户，便于组织",
                    islink: true,
                    path: '/setting/userGroup',
                    icon: "set-usergroup"
                },
                {
                    title: '用户目录',
                    key: "userDir",
                    desc: "用于同步内部目录、LDAP、企业微信等目录的用户",
                    islink: true,
                    path: '/setting/dir',
                    icon: "set-userdir"
                },
                {
                    title: '权限',
                    key: "role",
                    desc: "管理各个用户的权限，保证数据安全",
                    path: '/setting/systemRole',
                    icon: "set-privilege"
                }
            ]
        },
        userSaas: {
            title: '权限',
            key: "user",
            cloudShow: true,
            eeShow: false,
            children: [
                {
                    title: '权限',
                    key: "role",
                    path: '/setting/systemRole'
                }
            ]
        },
        workItem: {
            title: '事项配置',
            key: "workItem",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '事项类型',
                    desc: "管理事项类型，可自定义",
                    key: "workType",
                    icon: "set-worktype",
                    path: '/setting/worktype',
                },
                {
                    title: '事项优先级',
                    desc: "管理事项优先级，可自定义",
                    key: "workPriority",
                    icon: "set-privil",
                    path: '/setting/workpriority',
                }
            ]
        },
        message: {
            title: '消息',
            key: "message",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '消息通知方案',
                    key: "messageNotice",
                    icon: "set-message",
                    path: '/setting/messageNotice',
                },
                {
                    title: '消息发送方式',
                    key: "sendType",
                    icon: "set-messtem",
                    path: '/setting/messageSendType',
                },
            ]
        },
        form: {
            title: '表单',
            key: "form",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '字段类型',
                    key: "fieldType",
                    path: '/setting/fieldType',
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
        flow: {
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
        system: {
            title: '系统集成',
            key: "systemIntergrtion",
            cloudShow: false,
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
                    key: "systemUrl",
                    path: '/setting/urlData',
                },
            ]
        },
        system: {
            title: '系统集成',
            key: "systemIntergrtion",
            cloudShow: true,
            eeShow: false,
            children: [
                {
                    title: 'JIRA',
                    key: "jira",
                    noShowNum: true,
                    path: '/setting/loadData',
                }
            ]
        },
        security: {
            title: '安全',
            key: "security",
            cloudShow: true,
            eeShow: true,
            children: [
                {
                    title: '操作日志',
                    key: "logList",
                    noShowNum: true,
                    path: '/setting/log',
                },
                {
                    title: '备份与恢复',
                    key: "lastBackups",
                    noShowNum: true,
                    path: '/setting/backups',
                },
            ]
        },
        version: {
            title: '应用',
            key: "systemversion",
            cloudShow: false,
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
                    key: "applyAuth",
                    path: '/setting/productAuth',
                },
            ]
        }
    }


    const goPage = (data) => {

        if (data.islink && !authType) {
            const authUrl = JSON.parse(localStorage.getItem("authConfig")).authServiceUrl + "#" + data.path;
            window.open(authUrl, '_blank');
        } else {
            props.history.push(data.path)

        }
        setSelectKey(data.path)
    }

    const setVersion = (version) => {
        let data = "";
        if (!version?.expired) {
            data = "企业版"
        } else {
            data = "社区版"
        }
        return data
    }

    return (
        <Row className="setting-home-row">
            <Col xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={{ span: 20, offset: 2 }}>
                <div className="setting-first">
                    <div className="setting-user">
                        {/* <div className="setting-user-title">
                            用户
                        </div> */}
                        <div className="setting-user-box">
                            {
                                list.user.children.map(item => {
                                    return <div className="setting-user-item" key={item.key} onClick={() => goPage(item)}>
                                        <svg className="icon-40" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <div className="module-title">{item.title} : {numList[item.key] ? numList[item.key] : 0}</div>
                                        <div className="module-desc">{item.desc}</div>

                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="setting-work">
                        <div className="setting-work-box">
                            {
                                list.workItem.children.map(item => {
                                    return <div className="setting-work-item" key={item.key} onClick={() => goPage(item)}>
                                        <div className="module-left">
                                            <div className="module-title">{item.title}: {numList[item.key] ? numList[item.key] : 0}</div>
                                            <div className="module-desc">{item.desc}</div>
                                        </div>

                                        <ImgComponent className="module-img" src={`${item.icon}.png`} alt="" width="180px" height="180px" />

                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="setting-message">
                        <div className="setting-message-box">
                            <div className="setting-message-left">
                                <div className="module-title">消息</div>
                                <div className="module-desc">消息模块管理消息的通知，消息模版的设置，可根据自己需求设置</div>
                            </div>
                            <div className="setting-message-right">
                                {
                                    list.message.children.map(item => {
                                        return <div className="setting-message-item" key={item.key} onClick={() => goPage(item)}>
                                            <svg className="icon-40" aria-hidden="true">
                                                <use xlinkHref={`#icon-${item.icon}`}></use>
                                            </svg>
                                            <div className="module-title">{item.title} : {numList[item.key] ? numList[item.key] : 0}</div>
                                        </div>
                                    })
                                }
                            </div>

                        </div>
                    </div>
                </div>

            </Col>
        </Row>

    )
}
export default observer(SettingHome);