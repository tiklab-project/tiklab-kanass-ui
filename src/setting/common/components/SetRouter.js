/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 14:44:20
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 10:09:01
 */

const setDevEamRouter= [
    {
        title: "用户与部门",
        icon: 'orgamanage',
        key: '/index/setting/organ',
        encoded: "SysOrga",
        code: 1,
        children: [
            {
                title: "部门",
                icon: 'orgamanage',
                key: '/index/setting/organ',
                encoded: "SysOrga",
                code: 1-1,
                
            },
            {
                title: '用户',
                icon: 'usermanage',
                key: '/index/setting/user',
                encoded: "SysUser",
                code: 1-2,
            },
            {
                title: '用户组',
                icon: 'usermanage',
                key: '/index/setting/usergroup',
                encoded: "SysUser",
                code: 1-3,
            },
            {
        
                title: "用户目录",
                icon: 'category',
                key: '/index/setting/directory',
                encoded: "SysMessage",
                code: 1-4,
            },
        ]
    },
    {
        title: '权限',
        icon: 'systemcenter',
        key: "/index/setting/systemRole",
        encoded: "SysRoleSystem",
        code: 2
    },
    {
        title: '事项管理',
        icon: 'workitemtype',
        key: "/index/setting/workstatus",
        encoded: "SysWork",
        code: 3,
        children: [
            {
                title: '事项类型',
                icon: 'workitemtype',
                key: '/index/setting/worktype',
                encoded: "SysWorkType",
                code: 3-1,
            },
            {
                title: '事项优先级',
                icon: 'workitemtype',
                key: '/index/setting/workpriority',
                encoded: "SysWorkPriority",
                code: 3-2,
            },
        ]
    },
    {
        title: "消息",
        icon: 'messagecenter',
        key: '/index/setting/messageNotice',
        encoded: "SysMessage",
        code: 4,
        children: [
            {
                title: "消息通知方案",
                icon: 'messagecenter',
                key: '/index/setting/messageNotice',
                encoded: "SysMessage",
                code: 4-1
            },
            {
                title: '消息发送方式',
                icon: 'messagecenter',
                key: '/index/setting/messageSendType',
                encoded: "SysMessageType",
                code: 4-2,
            }
        ]
    },
    {
        title: '表单',
        icon: 'formcenter',
        key: "/index/setting/preliminary",
        encoded: "SysForm",
        code: 6,
        children: [
            
            {
                title: '字段类型',
                icon: 'formcenter',
                key: '/index/setting/preliminaryTypeView',
                encoded: "SysFieldType",
                code: 6-1,
            },
            {
                title: '字段',
                icon: 'formcenter',
                key: '/index/setting/preliminary',
                encoded: "SysFieldType",
                code: 6-2,
            },
            {
                title: '表单',
                icon: 'formcenter',
                key: '/index/setting/form',
                encoded: "SysFormSet",
                code: 6-3,
            }
        ]
    },
    {
        title: "流程",
        icon: 'flowcenter',
        key: '/index/setting/systemFlow',
        encoded: "SysFlow",
        code: 7,
        children: [
            {
                title: "流程",
                icon: 'flowcenter',
                key: '/index/setting/systemFlow',
                encoded: "SysFlow",
                code: 7-1,
            },
            {
                title: "状态",
                icon: 'flowcenter',
                key: '/index/setting/nodestatus',
                encoded: "SysFlow",
                code: 7-2
            }
        ]
    },
    {
        title: "插件",
        icon: 'plugin',
        key: '/index/setting/plugin',
        encoded: "SysPlugin",
        code: 8,
    },
    {
        title: "系统集成",
        icon: 'systemcenter',
        key: '/index/setting/loadData',
        encoded: "SysMessage",
        code: 9,
        children: [
            {
                title: 'JIRA',
                icon: 'systemcenter',
                key: '/index/setting/loadData',
                encoded: "SysMessageManagement",
                code: 9-1,
            },
        ]
    },
    {
        title: "安全",
        icon: 'systemcenter',
        key: '/index/setting/log',
        encoded: "SysMessage",
        code: 10,
        children: [
            {
                title: '操作日志',
                icon: 'systemcenter',
                key: '/index/setting/logList',
                encoded: "logList",
                code: 10-1,
            }
        ]
    }, 
    {
        title: "版本与许可证",
        icon: 'plugin',
        key: '/index/setting/version',
        encoded: "SysPlugin",
        code: 11,
    },
    {
        title: "产品授权",
        icon: 'plugin',
        key: '/index/setting/product',
        encoded: "SysPlugin",
        code: 13,
    },
    {
        title: "基础数据",
        icon: 'systemcenter',
        key: '/index/setting/systemFeature',
        encoded: "basicData",
        code: 12,
        children: [
            {
                title: '用户组',
                icon: 'projecttype',
                key: '/index/setting/usersystemgroup',
                encoded: "usersystemgroup",
                code: 12-18,
            },
            {
                title: '项目类型',
                icon: 'projecttype',
                key: '/index/setting/projectType',
                encoded: "ProjectType",
                code: 12-1,
            },
            {
                title: '事项类型',
                icon: 'workitemtype',
                key: '/index/setting/worktypeSystem',
                encoded: "SysWorkType",
                code: 12-2,
            },
            {
                title: '系统功能',
                icon: 'systemcenter',
                key: '/index/setting/systemFeature',
                encoded: "SysFeatruestem",
                code: 12-3,
            },
            {
                title: '系统角色',
                icon: 'systemcenter',
                key: '/index/setting/systemRoleBuilt',
                encoded: "SystemRoleBuilt",
                code: 12-4,
            },
            {
                title: '项目功能',
                icon: 'projectpriviliage',
                key: '/index/setting/projectFeature',
                encoded: "SysFeatrueProject",
                code: 12-5,
            },
            {
                title: '项目角色',
                icon: 'projectpriviliage',
                key: '/index/setting/projectRole',
                encoded: "SysRoleProject",
                code: 12-6
            },
            {
                title: '消息通知方式',
                icon: 'messagecenter',
                key: '/index/setting/messageNoticeSystem',
                encoded: "SysMessageTemplate",
                code: 12-7,
            },
            {
                title: '消息类型',
                icon: 'messagecenter',
                key: '/index/setting/messageType',
                encoded: "SysMessageType",
                code: 12-8,
            },
           
            {
                title: '日志模板',
                icon: 'systemcenter',
                key: '/index/setting/myLogTemplateList',
                encoded: "myLogTemplateList",
                code: 12-10,
            },
            {
                title: '日志类型',
                icon: 'systemcenter',
                key: '/index/setting/projectLogTypeList',
                encoded: "projectLogTypeList",
                code: 12-11,
            },
            {
                title: '待办模板',
                icon: 'systemcenter',
                key: '/index/setting/todoTempList',
                encoded: "todoTempList",
                code: 12-12,
            },
            {
                title: '待办类型',
                icon: 'systemcenter',
                key: '/index/setting/todoTypeTask',
                encoded: "todoTempList",
                code: 12-13,
            },
            {
                title: '字段类型',
                icon: 'formcenter',
                key: '/index/setting/preliminaryType',
                encoded: "SysField",
                code: 12-14,
            },
            {
                title: '字段',
                icon: 'formcenter',
                key: '/index/setting/preliminarySystem',
                encoded: "SysFieldType",
                code: 12-15,
            },
            {
                title: '表单',
                icon: 'formcenter',
                key: '/index/setting/formsystem',
                encoded: "SysFormSet",
                code: 12-16,
            },
            {
                title: "流程",
                icon: 'flowcenter',
                key: '/index/setting/systemFlowsystem',
                encoded: "SysFlow",
                code: 12-17,
            }
        ]
    }
];

const setPrdEamRouter= [
    {
        title: "用户与部门",
        icon: 'orgamanage',
        key: '/index/setting/organ',
        encoded: "SysOrga",
        code: 1,
        children: [
            {
                title: "部门",
                icon: 'orgamanage',
                key: '/index/setting/organ',
                encoded: "SysOrga",
                code: 1-1,
                
            },
            {
                title: '用户',
                icon: 'usermanage',
                key: '/index/setting/user',
                encoded: "SysUser",
                code: 1-2,
            },
            {
                title: '用户组',
                icon: 'usermanage',
                key: '/index/setting/usergroup',
                encoded: "SysUser",
                code: 1-3,
            },
            {
        
                title: "用户目录",
                icon: 'category',
                key: '/index/setting/directory',
                encoded: "SysMessage",
                code: 1-4,
            },
        ]
    },
    {
        title: '权限',
        icon: 'systemcenter',
        key: "/index/setting/systemRole",
        encoded: "SysRoleSystem",
        code: 2
    },
    {
        title: '事项管理',
        icon: 'workitemtype',
        key: "/index/setting/workstatus",
        encoded: "SysWork",
        code: 3,
        children: [
            {
                title: '事项类型',
                icon: 'workitemtype',
                key: '/index/setting/worktype',
                encoded: "SysWorkType",
                code: 3-1,
            },
            {
                title: '事项优先级',
                icon: 'workitemtype',
                key: '/index/setting/workpriority',
                encoded: "SysWorkPriority",
                code: 3-2,
            },
        ]
    },
    {
        title: "消息",
        icon: 'messagecenter',
        key: '/index/setting/messageNotice',
        encoded: "SysMessage",
        code: 4,
        children: [
            {
                title: "消息通知方案",
                icon: 'messagecenter',
                key: '/index/setting/messageNotice',
                encoded: "SysMessage",
                code: 4-1
            },
            {
                title: '消息发送方式',
                icon: 'messagecenter',
                key: '/index/setting/messageSendType',
                encoded: "SysMessageType",
                code: 4-2,
            }
        ]
    },
    {
        title: '表单',
        icon: 'formcenter',
        key: "/index/setting/preliminary",
        encoded: "SysForm",
        code: 6,
        children: [
            
            {
                title: '字段类型',
                icon: 'formcenter',
                key: '/index/setting/preliminaryTypeView',
                encoded: "SysFieldType",
                code: 6-1,
            },
            {
                title: '字段',
                icon: 'formcenter',
                key: '/index/setting/preliminary',
                encoded: "SysFieldType",
                code: 6-2,
            },
            {
                title: '表单',
                icon: 'formcenter',
                key: '/index/setting/form',
                encoded: "SysFormSet",
                code: 6-3,
            }
        ]
    },
    {
        title: "流程",
        icon: 'flowcenter',
        key: '/index/setting/systemFlow',
        encoded: "SysFlow",
        code: 7,
        children: [
            {
                title: "流程",
                icon: 'flowcenter',
                key: '/index/setting/systemFlow',
                encoded: "SysFlow",
                code: 7-1,
            },
            {
                title: "状态",
                icon: 'flowcenter',
                key: '/index/setting/nodestatus',
                encoded: "SysFlow",
                code: 7-2
            }
        ]
    },
    {
        title: "插件",
        icon: 'plugin',
        key: '/index/setting/plugin',
        encoded: "SysPlugin",
        code: 8,
    },
    {
        title: "系统集成",
        icon: 'systemcenter',
        key: '/index/setting/loadData',
        encoded: "SysMessage",
        code: 9,
        children: [
            {
                title: 'JIRA',
                icon: 'systemcenter',
                key: '/index/setting/loadData',
                encoded: "SysMessageManagement",
                code: 9-1,
            },
        ]
    },
    {
        title: "安全",
        icon: 'systemcenter',
        key: '/index/setting/log',
        encoded: "SysMessage",
        code: 10,
        children: [
            {
                title: '操作日志',
                icon: 'systemcenter',
                key: '/index/setting/logList',
                encoded: "logList",
                code: 10-1,
            }
        ]
    }, 
    {
        title: "版本与许可证",
        icon: 'plugin',
        key: '/index/setting/version',
        encoded: "SysPlugin",
        code: 11,
    },
    {
        title: "产品授权",
        icon: 'plugin',
        key: '/index/setting/product',
        encoded: "SysPlugin",
        code: 13,
    }
];

const setDevRouter= [
    {
        title: "用户与部门",
        icon: 'orgamanage',
        key: '/index/setting/organ',
        encoded: "SysOrga",
        code: 1,
        children: [
            {
                title: "部门",
                icon: 'orgamanage',
                key: '/index/setting/organ',
                encoded: "SysOrga",
                code: 1-1,
                
            },
            {
                title: '用户',
                icon: 'usermanage',
                key: '/index/setting/user',
                encoded: "SysUser",
                code: 1-2,
            },
            {
        
                title: "用户目录",
                icon: 'category',
                key: '/index/setting/directory',
                encoded: "SysMessage",
                code: 1-3,
            },
        ]
    },
    {
        title: '权限',
        icon: 'systemcenter',
        key: "/index/setting/systemRole",
        encoded: "SysRoleSystem",
        code: 2
    },
    {
        title: '事项管理',
        icon: 'workitemtype',
        key: "/index/setting/workstatus",
        encoded: "SysWork",
        code: 3,
        children: [
            {
                title: '事项类型',
                icon: 'workitemtype',
                key: '/index/setting/worktype',
                encoded: "SysWorkType",
                code: 3-1,
            },
            {
                title: '事项优先级',
                icon: 'workitemtype',
                key: '/index/setting/workpriority',
                encoded: "SysWorkPriority",
                code: 3-2,
            },
        ]
    },
    {
        title: "消息",
        icon: 'messagecenter',
        key: '/index/setting/messageNotice',
        encoded: "SysMessage",
        code: 4,
        children: [
            {
                title: "消息通知方案",
                icon: 'messagecenter',
                key: '/index/setting/messageNotice',
                encoded: "SysMessage",
                code: 4-1
            },
            {
                title: '消息发送方式',
                icon: 'messagecenter',
                key: '/index/setting/messageSendType',
                encoded: "SysMessageType",
                code: 4-2,
            }
        ]
    },
    {
        title: '表单',
        icon: 'formcenter',
        key: "/index/setting/preliminary",
        encoded: "SysForm",
        code: 6,
        children: [
            
            {
                title: '字段类型',
                icon: 'formcenter',
                key: '/index/setting/preliminaryTypeView',
                encoded: "SysFieldType",
                code: 6-1,
            },
            {
                title: '字段',
                icon: 'formcenter',
                key: '/index/setting/preliminary',
                encoded: "SysFieldType",
                code: 6-2,
            },
            {
                title: '表单',
                icon: 'formcenter',
                key: '/index/setting/form',
                encoded: "SysFormSet",
                code: 6-3,
            }
        ]
    },
    {
        title: "流程",
        icon: 'flowcenter',
        key: '/index/setting/systemFlow',
        encoded: "SysFlow",
        code: 7,
    },
    {
        title: "插件",
        icon: 'plugin',
        key: '/index/setting/plugin',
        encoded: "SysPlugin",
        code: 8,
    },
    {
        title: "系统集成",
        icon: 'systemcenter',
        key: '/index/setting/loadData',
        encoded: "SysMessage",
        code: 9,
        children: [
            {
                title: 'JIRA',
                icon: 'systemcenter',
                key: '/index/setting/loadData',
                encoded: "SysMessageManagement",
                code: 9-1,
            },
        ]
    },
    
    {
        title: "安全",
        icon: 'systemcenter',
        key: '/index/setting/log',
        encoded: "SysMessage",
        code: 10,
        children: [
            {
                title: '操作日志',
                icon: 'systemcenter',
                key: '/index/setting/logList',
                encoded: "logList",
                code: 10-1,
            }
        ]
    }, 
    {
        title: "版本与许可证",
        icon: 'plugin',
        key: '/index/setting/version',
        encoded: "SysPlugin",
        code: 11,
    },
    {
        title: "产品授权",
        icon: 'plugin',
        key: '/index/setting/product',
        encoded: "SysPlugin",
        code: 13,
    },
    {
        title: "基础数据",
        icon: 'systemcenter',
        key: '/index/setting/systemFeature',
        encoded: "basicData",
        code: 12,
        children: [
            {
                title: '项目类型',
                icon: 'projecttype',
                key: '/index/setting/projectType',
                encoded: "ProjectType",
                code: 12-1,
            },
            {
                title: '事项类型',
                icon: 'workitemtype',
                key: '/index/setting/worktypeSystem',
                encoded: "SysWorkType",
                code: 12-2,
            },
            {
                title: '系统功能',
                icon: 'systemcenter',
                key: '/index/setting/systemFeature',
                encoded: "SysFeatruestem",
                code: 12-3,
            },
            {
                title: '系统角色',
                icon: 'systemcenter',
                key: '/index/setting/systemRoleBuilt',
                encoded: "SystemRoleBuilt",
                code: 12-4,
            },
            {
                title: '项目功能',
                icon: 'projectpriviliage',
                key: '/index/setting/projectFeature',
                encoded: "SysFeatrueProject",
                code: 12-5,
            },
            {
                title: '项目角色',
                icon: 'projectpriviliage',
                key: '/index/setting/projectRole',
                encoded: "SysRoleProject",
                code: 12-6
            },
            {
                title: '消息模板',
                icon: 'messagecenter',
                key: '/index/setting/messageTemplate',
                encoded: "SysMessageTemplate",
                code: 12-7,
            },
            {
                title: '消息类型',
                icon: 'messagecenter',
                key: '/index/setting/messageType',
                encoded: "SysMessageType",
                code: 12-8,
            },
            {
                title: '消息发送方式',
                icon: 'messagecenter',
                key: '/index/setting/messageSendType',
                encoded: "SysMessageType",
                code: 12-9,
            },
            {
                title: '日志模板',
                icon: 'systemcenter',
                key: '/index/setting/myLogTemplateList',
                encoded: "myLogTemplateList",
                code: 12-10,
            },
            {
                title: '日志类型',
                icon: 'systemcenter',
                key: '/index/setting/projectLogTypeList',
                encoded: "projectLogTypeList",
                code: 12-11,
            },
            {
                title: '待办模板',
                icon: 'systemcenter',
                key: '/index/setting/todoTempList',
                encoded: "todoTempList",
                code: 12-12,
            },
            {
                title: '待办类型',
                icon: 'systemcenter',
                key: '/index/setting/todoTypeTask',
                encoded: "todoTempList",
                code: 12-13,
            },
            {
                title: '字段类型',
                icon: 'formcenter',
                key: '/index/setting/preliminaryType',
                encoded: "SysField",
                code: 12-14,
            },
            {
                title: '字段',
                icon: 'formcenter',
                key: '/index/setting/preliminarySystem',
                encoded: "SysFieldType",
                code: 12-15,
            },
            {
                title: '表单',
                icon: 'formcenter',
                key: '/index/setting/formsystem',
                encoded: "SysFormSet",
                code: 12-16,
            },
            {
                title: "流程",
                icon: 'flowcenter',
                key: '/index/setting/systemFlowsystem',
                encoded: "SysFlow",
                code: 12-17,
            },
        ]
    },
   
];

const setPrdRouter= [
    {
        title: "用户与部门",
        icon: 'orgamanage',
        key: '/index/setting/organ',
        encoded: "SysOrga",
        code: 1,
        children: [
            {
                title: "部门",
                icon: 'orgamanage',
                key: '/index/setting/organ',
                encoded: "SysOrga",
                code: 1-1,
                
            },
            {
                title: '用户',
                icon: 'usermanage',
                key: '/index/setting/user',
                encoded: "SysUser",
                code: 1-2,
            },
            {
        
                title: "用户目录",
                icon: 'category',
                key: '/index/setting/directory',
                encoded: "SysMessage",
                code: 1-3,
            },
        ]
    },
    {
        title: '权限',
        icon: 'systemcenter',
        key: "/index/setting/systemRole",
        encoded: "SysRoleSystem",
        code: 2
    },
    {
        title: '事项管理',
        icon: 'workitemtype',
        key: "/index/setting/workstatus",
        encoded: "SysWork",
        code: 3,
        children: [
            {
                title: '事项类型',
                icon: 'workitemtype',
                key: '/index/setting/worktype',
                encoded: "SysWorkType",
                code: 3-1,
            },
            {
                title: '事项优先级',
                icon: 'workitemtype',
                key: '/index/setting/workpriority',
                encoded: "SysWorkPriority",
                code: 3-2,
            },
        ]
    },
    {
        title: "消息",
        icon: 'messagecenter',
        key: '/index/setting/messageNotice',
        encoded: "SysMessage",
        code: 4,
        children: [
            {
                title: "消息通知方案",
                icon: 'messagecenter',
                key: '/index/setting/messageNotice',
                encoded: "SysMessage",
                code: 4-1
            },
            {
                title: '消息发送方式',
                icon: 'messagecenter',
                key: '/index/setting/messageSendType',
                encoded: "SysMessageType",
                code: 4-2,
            }
        ]
    },
    {
        title: '表单',
        icon: 'formcenter',
        key: "/index/setting/preliminary",
        encoded: "SysForm",
        code: 6,
        children: [
            
            {
                title: '字段类型',
                icon: 'formcenter',
                key: '/index/setting/preliminaryTypeView',
                encoded: "SysFieldType",
                code: 6-1,
            },
            {
                title: '字段',
                icon: 'formcenter',
                key: '/index/setting/preliminary',
                encoded: "SysFieldType",
                code: 6-2,
            },
            {
                title: '表单',
                icon: 'formcenter',
                key: '/index/setting/form',
                encoded: "SysFormSet",
                code: 6-3,
            }
        ]
    },
    {
        title: "流程",
        icon: 'flowcenter',
        key: '/index/setting/systemFlow',
        encoded: "SysFlow",
        code: 7,
    },
    {
        title: "插件",
        icon: 'plugin',
        key: '/index/setting/plugin',
        encoded: "SysPlugin",
        code: 8,
    },
    {
        title: "系统集成",
        icon: 'systemcenter',
        key: '/index/setting/loadData',
        encoded: "SysMessage",
        code: 9,
        children: [
            {
                title: 'JIRA',
                icon: 'systemcenter',
                key: '/index/setting/loadData',
                encoded: "SysMessageManagement",
                code: 9-1,
            },
        ]
    },
    
    {
        title: "安全",
        icon: 'systemcenter',
        key: '/index/setting/log',
        encoded: "SysMessage",
        code: 10,
        children: [
            {
                title: '操作日志',
                icon: 'systemcenter',
                key: '/index/setting/logList',
                encoded: "logList",
                code: 10-1,
            }
        ]
    }, 
    {
        title: "版本与许可证",
        icon: 'plugin',
        key: '/index/setting/version',
        encoded: "SysPlugin",
        code: 11,
    },
    {
        title: "产品授权",
        icon: 'plugin',
        key: '/index/setting/product',
        encoded: "SysPlugin",
        code: 13,
    }
];
export  {setDevEamRouter, setDevRouter, setPrdEamRouter, setPrdRouter};