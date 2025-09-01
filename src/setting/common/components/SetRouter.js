/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 14:44:20
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 10:09:01
 */

const setDevRouter= [
    {
        title: "用户",
        icon: 'systemuser',
        // purviewCode: "user",
        id: '/setting/orga',
        code: "userPrivilege",
        children: [
            {
                title: '用户',
                id: '/setting/user',
                easId: '/user/user',
                purviewCode: "user",
                islink: true,
                code: "user",
            },
            {
                title: "部门",
                id: '/setting/orga',
                easId: '/user/orga',
                purviewCode: "orga",
                islink: true,
                code: "orga",
                
            },
            {
                title: '用户组',
                id: '/setting/userGroup',
                easId: '/user/userGroup',
                purviewCode: "user_group",
                islink: true,
                code: "userGroup",
            },
            {
        
                title: "用户目录",
                id: '/setting/dir',
                easId: '/user/dir',
                purviewCode: "user_dir",
                islink: true,
                code: "dir",
            }
        ]
    },
    {
        title: '权限',
        icon: 'systempermissions',
        id: "/setting/systemRole",
        purviewCode: "permission",
        code: "systemRole"
    },
    // {
    //     title: "消息",
    //     icon: 'systemmessage',
    //     id: '/setting/messageNotice',
    //     purviewCode: "SysMessage",
    //     code: "message",
    //     children: [
    //         {
    //             title: "消息通知方案",
    //             id: '/setting/messageNotice',
    //             purviewCode: "SysMessageNotice",
    //             code: "messageNotice"
    //         },
    //         {
    //             title: '消息发送方式',
    //             id: '/setting/messageSendType',
    //             purviewCode: "SysMessageSendType",
    //             code: "messageSendType",
    //         }
    //     ]
    // },
    {
        title: "消息",
        icon: 'systemmessage',
        id: '/setting/message',
        purviewCode: "message",
        code: "message",
    },
    {
        title: '事项类型',
        icon: 'systemmanage',
        id: "/setting/worktype",
        purviewCode: "work_type",
        code: "worktype",
    },
    {
        title: '表单',
        icon: 'systemform',
        id: "/setting/form",
        // purviewCode: "SysForm",
        code: "SysForm",
        children: [
            
            // {  隐藏字段类型
            //     title: '字段类型',
            //     id: '/setting/fieldType',
            //     purviewCode: "SysFieldType",
            //     code: "fieldType",
            // },
            {
                title: '字段',
                id: '/setting/preliminary',
                purviewCode: "field",
                code: "preliminary",
            },
            {
                title: '表单',
                id: '/setting/form',
                purviewCode: "form",
                code: "form",
            }
        ]
    },
    {
        title: "流程",
        icon: 'systemflow',
        id: '/setting/systemFlow',
        // purviewCode: "SysFlow",
        code: "flow",
        children: [
            {
                title: "流程",
                id: '/setting/systemFlow',
                purviewCode: "flow",
                code: "systemFlow",
            },
            {
                title: "状态",
                id: '/setting/nodestatus',
                purviewCode: "status",
                code: "nodestatus"
            }
        ]
    },
    {
        title: "集成开放",
        icon: 'systemIntergrtion',
        id: '/setting/loadData',
        code: "systemIntergrtion",
        // purviewCode: "SysIntergrtion",
        children: [
            {
                title: '服务集成',
                id: '/setting/urlData',
                code: "urlData",
                purviewCode: "url_data"
            },
            // {
            //     title: 'JIRA导入',
            //     id: '/setting/jiraLoadData',
            //     code: "jiraLoadData",
            //     purviewCode: "SysJira"
            // },
            // {
            //     title: 'Mantis导入',
            //     id: '/setting/mantisLoadData',
            //     code: "mantisLoadData",
            //     purviewCode: "SysMantis"
            // },
            {
                title: '导入外部数据',
                id: '/setting/loadData',
                code: "loadData",
                purviewCode: "import"
            },
            {
                title: 'OpenApi',
                id: '/setting/openapi',

            }
        ]
    },
    {
        title: "安全",
        icon: 'systemlog',
        id: '/setting/log',
        // purviewCode: "SysSecure",
        code: "log",
        children: [
            {
                title: '操作日志',
                id: '/setting/log',
                purviewCode: "log",
                code: "logList",
            }, 
            {
                title: "备份与恢复",
                id: '/setting/backups',
                code: "backups",
                purviewCode: "backups_and_recover"
            },
            {
                title: "IP黑白名单",
                id: '/setting/ipRoster',
                // code: "backups",
                // purviewCode: "SysBackups"
            },
        ]
    }, 
    {
        title: "系统",
        icon: 'systemversion',
        id: '/setting/version',
        // purviewCode: "SysApplication",
        code: "application",
        children: [
            {
                title: "版本与许可证",
                id: '/setting/version',
                purviewCode: "licence",
                code: "version",
            },
            {
                title: "应用访问权限",
                id: '/setting/productAuth',
                purviewCode: "apply_limits",
                code: "productAuth",
            },
            {
                title: "自定义Logo",
                id: '/setting/logo',
                // purviewCode: "SysProductAuth", //SysCustomProductLogo
                // code: "productAuth",
            },
        ]
    },
   
    {
        title: "基础数据",
        icon: 'systemcenter',
        id: '/setting/systemFeature',
        code: "data",
        children: [
            {
                title: '用户组',
                id: '/setting/usersystemgroup',
                code: "usersystemgroup",
            },
            {
                title: '虚拟角色',
                id: '/setting/virtual',
                code: "virtual",
            },
            {
                title: '项目类型',
                id: '/setting/projectType',
                code: "projectType",
            },
            {
                title: '事项类型',
                id: '/setting/worktypeSystem',
                code: "worktypeSystem",
            },
            {
                title: '事项功能',
                id: '/setting/workFunctionList',
                code: "workFunctionList",
            },
            {
                title: '事项权限',
                id: '/setting/workPrivilegeList',
                code: "workPrivilegeList",
            },
            // {
            //     title: '事项权限',
            //     id: '/setting/workPrivilege',
            //     code: "workPrivilege",
            // },
            {
                title: '系统功能',
                id: '/setting/systemFeature',
                code: "systemFeature",
            },
            {
                title: '系统角色',
                id: '/setting/systemRoleBuilt',
                code: "systemRoleBuilt",
            },
            {
                title: '项目功能',
                id: '/setting/projectFeature',
                code: "projectFeature",
            },
            {
                title: '项目角色',
                id: '/setting/projectRole',
                code: "projectRole"
            },
            {
                title: '消息通知方式',
                id: '/setting/messageNoticeSystem',
                code: "messageNoticeSystem",
            },
            {
                title: '项目消息通知方式',
                id: '/setting/projectMessageNotice',
                code: "projectMessageNotice",
            },
            {
                title: '消息类型',
                id: '/setting/messageType',
                code: "messageType",
            },
           
            {
                title: '日志模板',
                id: '/setting/myLogTemplateList',
                // purviewCode: "SysLogTemplate",
                code: "myLogTemplateList",
            },
            {
                title: '日志类型',
                id: '/setting/projectLogTypeList',
                // purviewCode: "SysLogType",
                code: "projectLogTypeList",
            },
            {
                title: '待办模板',
                id: '/setting/todoTempList',
                code: "todoTempList",
            },
            {
                title: '待办类型',
                id: '/setting/todoTypeTask',
                code: "todoTypeTask",
            },
            {
                title: '字段类型',
                id: '/setting/preliminaryTypeSys',
                code: "preliminaryTypeSys",
            },
            {
                title: '字段',
                id: '/setting/preliminarySystem',
                code: "preliminarySystem",
            },
            {
                title: "业务角色",
                id: '/setting/businessrole',
                code: "businessrole"
            },
            {
                title: '表单',
                id: '/setting/formsystem',
                code: "formsystem",
            },
            {
                title: "流程",
                id: '/setting/systemFlowsystem',
                code: "systemFlowsystem",
            }
        ]
    }
];

const setPrdRouter= [
    {
        title: "用户",
        icon: 'systemuser',
        // purviewCode: "user",
        id: '/setting/orga',
        code: "userPrivilege",
        children: [
            {
                title: '用户',
                id: '/setting/user',
                easId: '/user/user',
                purviewCode: "user",
                islink: true,
                code: "user",
            },
            {
                title: "部门",
                id: '/setting/orga',
                easId: '/user/orga',
                purviewCode: "orga",
                islink: true,
                code: "orga",
                
            },
            {
                title: '用户组',
                id: '/setting/userGroup',
                easId: '/user/userGroup',
                purviewCode: "user_group",
                islink: true,
                code: "userGroup",
            },
            {
        
                title: "用户目录",
                id: '/setting/dir',
                easId: '/user/dir',
                purviewCode: "user_dir",
                islink: true,
                code: "dir",
            }

        ]
    },
    {
        title: '权限',
        icon: 'systempermissions',
        id: "/setting/systemRole",
        purviewCode: "permission",
        code: "systemRole"
    },
    // {
    //     title: "消息",
    //     icon: 'systemmessage',
    //     id: '/setting/messageNotice',
    //     purviewCode: "SysMessage",
    //     code: "message",
    //     children: [
    //         {
    //             title: "消息通知方案",
    //             id: '/setting/messageNotice',
    //             purviewCode: "SysMessageNotice",
    //             code: "messageNotice"
    //         },
    //         {
    //             title: '消息发送方式',
    //             id: '/setting/messageSendType',
    //             purviewCode: "SysMessageSendType",
    //             code: "messageSendType",
    //         }
    //     ]
    // },
    {
        title: "消息",
        icon: 'systemmessage',
        id: '/setting/message',
        purviewCode: "message",
        code: "message",
    },
    {
        title: '事项类型',
        icon: 'systemmanage',
        id: "/setting/worktype",
        purviewCode: "work_type",
        code: "worktype",
    },
    {
        title: '表单',
        icon: 'systemform',
        id: "/setting/form",
        // purviewCode: "SysForm",
        code: "SysForm",
        children: [

            //     title: '字段类型',
            //     id: '/setting/fieldType',
            //     purviewCode: "SysFieldType",
            //     code: "fieldType",
            // },
            // {
            {
                title: '字段',
                id: '/setting/preliminary',
                purviewCode: "field",
                code: "preliminary",
            },
            {
                title: '表单',
                id: '/setting/form',
                purviewCode: "form",
                code: "form",
            }
        ]
    },
    {
        title: "流程",
        icon: 'systemflow',
        id: '/setting/systemFlow',
        // purviewCode: "SysFlow",
        code: "flow",
        children: [
            {
                title: "流程",
                id: '/setting/systemFlow',
                purviewCode: "flow",
                code: "systemFlow",
            },
            {
                title: "状态",
                id: '/setting/nodestatus',
                purviewCode: "status",
                code: "nodestatus"
            }
        ]
    },
    {
        title: "集成开放",
        icon: 'systemIntergrtion',
        id: '/setting/loadData',
        code: "systemIntergrtion",
        // purviewCode: "SysIntergrtion",
        children: [
            {
                title: '服务集成',
                id: '/setting/urlData',
                code: "urlData",
                purviewCode: "url_data"
            },
            // {
            //     title: 'JIRA导入',
            //     id: '/setting/jiraLoadData',
            //     code: "jiraLoadData",
            //     purviewCode: "SysJira"
            // },
            // {
            //     title: 'Mantis导入',
            //     id: '/setting/mantisLoadData',
            //     code: "mantisLoadData",
            //     purviewCode: "SysMantis"
            // },
            {
                title: '导入外部数据',
                id: '/setting/loadData',
                code: "loadData",
                purviewCode: "import"
            },
            {
                title: 'OpenApi',
                id: '/setting/openApi',
                code: "openApi",
                purviewCode: "openapi"
            }
        ]
    },
    {
        title: "安全",
        icon: 'systemlog',
        id: '/setting/log',
        // purviewCode: "SysSecure",
        code: "log",
        children: [
            {
                title: '操作日志',
                id: '/setting/log',
                purviewCode: "log",
                code: "logList",
            }, 
            {
                title: "备份与恢复",
                id: '/setting/backups',
                code: "backups",
                purviewCode: "backups_and_recover"
            },
            {
                title: "IP黑白名单",
                id: '/setting/ipRoster',
                code: "ip_whitelist",
                purviewCode: "ip_whitelist"
            },
        ]
    }, 
    {
        title: "系统",
        icon: 'systemversion',
        id: '/setting/version',
        // purviewCode: "SysApplication",
        code: "application",
        children: [
            {
                title: "版本与许可证",
                id: '/setting/version',
                purviewCode: "licence",
                code: "version",
            },
            {
                title: "应用访问权限",
                id: '/setting/productAuth',
                purviewCode: "apply_limits",
                code: "productAuth",
            },
            {
                title: "自定义Logo",
                id: '/setting/logo',
                purviewCode: "custom_logo",
                code: "productLogo",
            },
        ]
    }
];
export  { setDevRouter, setPrdRouter};