import React, { useState } from 'react'
import { disableFunction, getVersionInfo } from "tiklab-core-ui";

import "./ProjectFeature.scss";
import { Modal } from 'antd';


const featureList = [
    {
        "id": "ce",
        "productType": {
            "id": "kanass",
            "code": null,
            "typeName": null
        },
        "type": "ce",
        "name": "Kanass-社区版",
        "price": "0",
        "modelList": [
            {
                "id": "project",
                "name": "项目模块",
                "sort": 1
               
            },
            {
                "id": "work",
                "name": "事项模块基础功能",
                "sort": 2
            },
            {
                "id": "projectset",
                "name": "项目集模块",
                "sort": 3
            },
            {
                "id": "log",
                "name": "工时模块",
                "sort": 5
               
            },
            {
                "id": "statistics",
                "name": "统计模块基础功能",
                "sort": 6
            },
            {
                "id": "user",
                "name": "用户与权限模块基础功能",
                "sort": 7
            },
            {
                "id": "message",
                "name": "消息模块基础功能",
                "sort": 8
            },
            {
                "id": "form",
                "name": "表单模块",
                "sort": 9
            },
            {
                "id": "flow",
                "name": "流程模块",
                "sort": 10
            }
        ],
        "resourcesList": [
            {
                "id": "form",
                "key": "自定义表单",
                "values": "6个",
                "sort": 1
            },
            {
                "id": "flow",
                "key": "自定义流程",
                "values": "5个",
                "sort": 1
            },
            {
                "id": "file",
                "key": "单文件上传",
                "values": "不限",
                "sort": 1
            },
            {
                "id": "log",
                "key": "日志保存时长",
                "values": "不限",
                "sort": 1
            },
            {
                "id": "message",
                "key": "消息保存时长",
                "values": "不限",
                "sort": 1
            }
        ],
        "customerList": [
            {
                "id": "groupchat",
                "key": null,
                "values": "应用群聊",
                "sort": 1,
            },
            {
                "id": "workorder",
                "key": null,
                "values": "在线工单支持",
                "sort": 2
            }
        ]
    },
    {
        "id": "ee",
        "productType": {
            "id": "kanass",
            "code": null,
            "typeName": null
        },
        "type": "ee",
        "name": "Kanass-企业版",
        "price": "3000",
        "version": "V1.0.2",
        "modelList": [
            {
                "id": "statistics",
                "name": "统计模块：事项统计、工时统计",
                "sort": 1
            },
            {
                "id": "work",
                "name": "事项模块：事项甘特图视图",
                "sort": 2
            },
            {
                "id": "user",
                "name": "用户与权限模块：Ldap用户登录管理、企业微信用户登录管理",
                "sort": 3
            },
            {
                "id": "message",
                "name": "消息模块：企业微信机器人消息",
                "sort": 4
            }
        ],
        "resourcesList": [
            {
                "id": "form",
                "key": "自定义表单",
                "values": "不限"
            },
            {
                "id": "flow",
                "key": "自定义流程",
                "values": "不限"
            },
            {
                "id": "file",
                "key": "单文件上传",
                "values": "不限"
            },
            {
                "id": "log",
                "key": "日志保存时长",
                "values": "不限"
            },
            {
                "id": "message",
                "key": "消息保存时长",
                "values": "不限"
            }
        ],
        "customerList": [
            {
                "id": "workorder",
                "key": null,
                "values": "在线工单支持",
                "sort": 1,
            },
            {
                "id": "wechat",
                "key": null,
                "values": "企业微信专属客服",
                "sort": 1
            },
            {
                "id": "customer",
                "key": null,
                "values": "7*24 小时智能客服",
                "sort": 2
            },
            {
                "id": "technical",
                "key": null,
                "values": "提供私有化专属技术支持",
                "sort": 3
            },
            {
                "id": "groupchat",
                "key": null,
                "values": "应用专属群聊",
                "sort": 1
            }
        ]
    },
    {
        "id": "cloud-free",
        "productType": {
            "id": "kanass",
            "code": null,
            "typeName": null
        },
        "type": "cloud-free",
        "name": "Kanass-免费版",
        "price": "0",
        "modelList": [
            {
                "id": "project",
                "name": "项目模块",
                "sort": 1
               
            },
            {
                "id": "work",
                "name": "事项模块基础功能",
                "sort": 2
            },
            {
                "id": "projectset",
                "name": "项目集模块",
                "sort": 3
            },
            {
                "id": "log",
                "name": "工时模块",
                "sort": 5
               
            },
            {
                "id": "statistics",
                "name": "统计模块基础功能",
                "sort": 6
            },
            {
                "id": "privilege",
                "name": "权限模块",
                "sort": 7
            },
            {
                "id": "message",
                "name": "消息模块基础功能",
                "sort": 8
            },
            {
                "id": "form",
                "name": "表单模块",
                "sort": 9
            },
            {
                "id": "flow",
                "name": "流程模块",
                "sort": 10
            },
            {
                "id": "security",
                "name": "安全模块",
                "sort": 11
            }
        ],
        "resourcesList": [
            {
                "id": "form",
                "key": "自定义表单",
                "values": "6个",
                "sort": 1
            },
            {
                "id": "flow",
                "key": "自定义流程",
                "values": "5个",
                "sort": 1
            },
            {
                "id": "file",
                "key": "单文件上传",
                "values": "不限",
                "sort": 1
            },
            {
                "id": "log",
                "key": "日志保存时长",
                "values": "不限",
                "sort": 1
            },
            {
                "id": "message",
                "key": "消息保存时长",
                "values": "不限",
                "sort": 1
            }
        ],
        "customerList": [
            {
                "id": "groupchat",
                "key": null,
                "values": "应用群聊",
                "sort": 1,
            },
            {
                "id": "workorder",
                "key": null,
                "values": "在线工单支持",
                "sort": 2
            }
        ]
    },
    {
        "id": "cloud-pay",
        "productType": {
            "id": "kanass",
            "code": null,
            "typeName": null
        },
        "type": "cloud-pay",
        "name": "Kanass-企业版",
        "price": "3000",
        "version": "V1.0.2",
        "modelList": [
            
            {
                "id": "work",
                "name": "事项模块：事项甘特图视图",
                "sort": 1
            },
            {
                "id": "statistics",
                "name": "统计模块：事项统计、工时统计",
                "sort": 2
            },
            {
                "id": "message",
                "name": "消息模块：企业微信机器人消息",
                "sort": 3
            }
        ],
        "resourcesList": [
            {
                "id": "form",
                "key": "自定义表单",
                "values": "不限"
            },
            {
                "id": "flow",
                "key": "自定义流程",
                "values": "不限"
            },
            {
                "id": "file",
                "key": "单文件上传",
                "values": "不限"
            },
            {
                "id": "log",
                "key": "日志保存时长",
                "values": "不限"
            },
            {
                "id": "message",
                "key": "消息保存时长",
                "values": "不限"
            }
        ],
        "customerList": [
            {
                "id": "workorder",
                "key": null,
                "values": "在线工单支持",
                "sort": 1,
            },
            {
                "id": "wechat",
                "key": null,
                "values": "企业微信专属客服",
                "sort": 1
            },
            {
                "id": "customer",
                "key": null,
                "values": "7*24 小时智能客服",
                "sort": 2
            },
            {
                "id": "technical",
                "key": null,
                "values": "提供私有化专属技术支持",
                "sort": 3
            },
            {
                "id": "groupchat",
                "key": null,
                "values": "应用专属群聊",
                "sort": 1
            }
        ]
    }
]

/**
 * 应用管理产品特性
 * @param props
 * @constructor
 */
const ProjectFeature = props => {

    const { featureType = 'ce' } = props;

    // const isVip = disableFunction();
    const versionInfo = getVersionInfo();

    const [visible, setVisible] = useState(false);

    const onOk = () => {
        if (featureType === 'ee') {
            window.open(`https://tiklab.net/account/subscribe/apply/eas`)
        } else {
            window.open(`https://work.tiklab.net/#/enterprise/application/eas`)
        }
        onCancel()
    }

    const onCancel = () => {
        setVisible(false)
    }

    const featureHtml = type => {
        let item = featureList.find(li => li.type === type);
        return (
            <div className='feature-item'>
                <div className='feature-item-header'>
                    <div className='header-title'>
                        {type === 'ce' && '社区版'}
                        {type === 'ee' && '企业版'}
                        {type === 'cloud-free' && '免费版'}
                        {type === 'cloud-pay' && '专业版'}
                    </div>
                    <div className='header-desc'>
                        {type === 'ce' && '适用于个人和小型团队快速部署和使用。'}
                        {type === 'ee' && '适用于大型组织和企业的复杂需求。'}
                        {type === 'cloud-free' && '适用于个人和小型团队快速部署和使用。'}
                        {type === 'cloud-pay' && '适用于大型组织和企业的复杂需求。'}
                    </div>
                </div>
                <div className='feature-item-body'>
                    <div className='feature-item-body-model'>
                        <div className='feature-item-body-title'>
                            <span>功能</span>
                            {
                                type === 'cloud-pay' &&
                                <span className='feature-item-body-title-ex'>
                                    包含免费版所有功能
                                </span>
                            }
                        </div>
                        <div>
                            {
                                item?.modelList?.map(model => (
                                    <div key={model.id} className='feature-model-item'>
                                        <div className='feature-item-body-icon'></div>
                                        <div className='feature-model-item-name'>{model.name}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className='feature-item-body-resources'>
                        <div className='feature-item-body-title'>资源</div>
                        <div>
                            {
                                item?.resourcesList?.map(resources => {
                                    return (
                                        <div key={resources.id} className='feature-resources-item'>
                                            <div className='feature-item-body-icon'></div>
                                            <div className='feature-resources-item-key'>{resources?.key}：</div>
                                            <div className='feature-resources-item-values'>{resources?.values}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='feature-item-body-customer'>
                        <div className='feature-item-body-title'>服务</div>
                        <div>
                            {
                                item?.customerList?.map(customer => {
                                    return (
                                        <div key={customer.id} className='feature-customer-item'>
                                            <div className='feature-item-body-icon'></div>
                                            <div className='feature-customer-item-value'>{customer?.values}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )

    }
    const showVersion = () => {
        let name = "社区版"
        if(version !== 'cloud'){
            name =  versionInfo.expired === true ? "社区版" : "企业版"
        }else {
            name =  versionInfo.expired === true ? "免费版" : "专业版"
        }
        return name;
    }
    return (
        <>
            <div className="project-feature-icon" data-title-bottom={showVersion()}>
                {
                    versionInfo.expired === true ?
                        <svg className="img-25" aria-hidden="true" onClick={() => setVisible(true)}>
                            <use xlinkHref="#icon-vip"></use>
                        </svg>
                        :
                        <svg className="img-25" aria-hidden="true" onClick={() => setVisible(true)}>
                            <use xlinkHref="#icon-svip"></use>
                        </svg>

                }
            </div>

            <Modal
                width={700}
                title={"版本功能"}
                okText={'订阅'}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                wrapClassName = 'version-comparison'
            >
                <div className='application-feature-modal'>
                    {featureHtml(version !== 'cloud' ? 'ce' : 'cloud-free')}
                    {featureHtml(version !== 'cloud' ? 'ee' : 'cloud-pay')}
                </div>
            </Modal>
        </>

    )
}

export default ProjectFeature;
