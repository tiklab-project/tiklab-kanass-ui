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
        title: "用户与权限",
        icon: 'systemuser',
        id: '/setting/orga',
        purviewCode: "orga",
        code: 1,
        children: [
            {
                title: "部门",
                id: '/setting/orga',
                purviewCode: "orga",
                islink: true,
                code: 1-1,
                
            },
            {
                title: '用户',
                id: '/setting/user',
                purviewCode: "user",
                islink: true,
                code: 1-2,
            },
            {
                title: '用户组',
                id: '/setting/userGroup',
                purviewCode: "user_group",
                islink: true,
                code: 1-3,
            },
            {
        
                title: "用户目录",
                id: '/setting/dir',
                purviewCode: "user_dir",
                islink: true,
                code: 1-4,
            },
            {
                title: '权限',
                // icon: 'systempermissions',
                id: "/setting/systemRole",
                purviewCode: "SysPermission",
                code: 2
            },
        ]
    },
    
    {
        title: '事项配置',
        icon: 'systemmanage',
        id: "/setting/workstatus",
        purviewCode: "SysWork",
        code: 3,
        children: [
            {
                title: '事项类型',
                id: '/setting/worktype',
                purviewCode: "SysWorkType",
                code: 3-1,
            },
            {
                title: '事项优先级',
                id: '/setting/workpriority',
                purviewCode: "SysWorkPriority",
                code: 3-2,
            },
        ]
    },
    {
        title: "消息",
        icon: 'systemmessage',
        id: '/setting/messageNotice',
        purviewCode: "SysMessage",
        code: 4,
        children: [
            {
                title: "消息通知方案",
                id: '/setting/messageNotice',
                purviewCode: "SysMessageNotice",
                code: 4-1
            },
            {
                title: '消息发送方式',
                id: '/setting/messageSendType',
                purviewCode: "SysMessageSendType",
                code: 4-2,
            }
        ]
    },
    {
        title: '表单',
        icon: 'systemform',
        id: "/setting/preliminary",
        purviewCode: "SysForm",
        code: 6,
        children: [
            
            {
                title: '字段类型',
                id: '/setting/fieldType',
                purviewCode: "SysFieldType",
                code: 6-1,
            },
            {
                title: '字段',
                id: '/setting/preliminary',
                purviewCode: "SysFieldType",
                code: 6-2,
            },
            {
                title: '表单',
                id: '/setting/form',
                purviewCode: "SysFormList",
                code: 6-3,
            }
        ]
    },
    {
        title: "流程",
        icon: 'systemflow',
        id: '/setting/systemFlow',
        purviewCode: "SysFlow",
        code: 7,
        children: [
            {
                title: "流程",
                id: '/setting/systemFlow',
                purviewCode: "SysFlowList",
                code: 7-1,
            },
            {
                title: "状态",
                id: '/setting/nodestatus',
                purviewCode: "SysFlowNode",
                code: 7-2
            }
        ]
    },
    {
        title: "插件",
        icon: 'systemplugin',
        id: '/setting/plugin',
        purviewCode: "SysPlugin",
        code: 8,
    },
    {
        title: "系统集成",
        icon: 'systemIntergrtion',
        id: '/setting/loadData',
        code: 9,
        children: [
            {
                title: 'JIRA',
                id: '/setting/loadData',
                code: 9-1,
            },
            {
                title: '地址配置',
                id: '/setting/urlData',
                code: 9-2,
            }
        ]
    },
    {
        title: "安全",
        icon: 'systemlog',
        id: '/setting/log',
        // purviewCode: "SysLog",
        code: 10,
        children: [
            {
                title: '操作日志',
                id: '/setting/logList',
                // purviewCode: "SysLogList",
                code: 10-1,
            }, 
            {
                title: "备份与恢复",
                id: '/setting/backups',
                code: 10-2
            },
        ]
    }, 
    {
        title: "应用",
        icon: 'systemversion',
        id: '/setting/version',
        // purviewCode: "version",
        code: 11,
        children: [
            {
                title: "版本与许可证",
                id: '/setting/version',
                // purviewCode: "version",
                code: 11-1,
            },
            {
                title: "应用访问权限",
                id: '/setting/productAuth',
                // purviewCode: "version",
                code: 11-2,
            },
        ]
    },
   
    {
        title: "基础数据",
        icon: 'systemcenter',
        id: '/setting/systemFeature',
        code: 12,
        children: [
            {
                title: '用户组',
                id: '/setting/usersystemgroup',
                purviewCode: "user_group",
                code: 12-18,
            },
            {
                title: '项目类型',
                id: '/setting/projectType',
                purviewCode: "SysProjectType",
                code: 12-1,
            },
            {
                title: '事项类型',
                id: '/setting/worktypeSystem',
                purviewCode: "SysWorkType",
                code: 12-2,
            },
            {
                title: '系统功能',
                id: '/setting/systemFeature',
                purviewCode: "SysFeatrueSys",
                code: 12-3,
            },
            {
                title: '系统角色',
                id: '/setting/systemRoleBuilt',
                purviewCode: "SysRoleSys",
                code: 12-4,
            },
            {
                title: '项目功能',
                id: '/setting/projectFeature',
                purviewCode: "SysFeatrueProject",
                code: 12-5,
            },
            {
                title: '项目角色',
                id: '/setting/projectRole',
                purviewCode: "SysRoleProject",
                code: 12-6
            },
            {
                title: '消息通知方式',
                id: '/setting/messageNoticeSystem',
                purviewCode: "SysMessageNotice",
                code: 12-7,
            },
            {
                title: '项目消息通知方式',
                id: '/setting/projectMessageNotice',
                code: 12-19,
            },
            {
                title: '消息类型',
                id: '/setting/messageType',
                purviewCode: "SysMessageType",
                code: 12-8,
            },
           
            {
                title: '日志模板',
                id: '/setting/myLogTemplateList',
                // purviewCode: "SysLogTemplate",
                code: 12-10,
            },
            {
                title: '日志类型',
                id: '/setting/projectLogTypeList',
                // purviewCode: "SysLogType",
                code: 12-11,
            },
            {
                title: '待办模板',
                id: '/setting/todoTempList',
                purviewCode: "SysSetting",
                code: 12-12,
            },
            {
                title: '待办类型',
                id: '/setting/todoTypeTask',
                purviewCode: "SysSetting",
                code: 12-13,
            },
            {
                title: '字段类型',
                id: '/setting/preliminaryTypeSys',
                purviewCode: "SysFieldType",
                code: 12-14,
            },
            {
                title: '字段',
                id: '/setting/preliminarySystem',
                purviewCode: "SysField",
                code: 12-15,
            },
            {
                title: "业务角色",
                id: '/setting/businessrole',
                code: 7-3
            },
            {
                title: '表单',
                id: '/setting/formsystem',
                purviewCode: "SysFormList",
                code: 12-16,
            },
            {
                title: "流程",
                id: '/setting/systemFlowsystem',
                purviewCode: "SysFlow",
                code: 12-17,
            }
        ]
    }
];

const setPrdRouter= [
    {
        title: "用户与权限",
        icon: 'systemuser',
        id: '/setting/orga',
        purviewCode: "orga",
        code: 1,
        children: [
            {
                title: "部门",
                id: '/setting/orga',
                purviewCode: "orga",
                islink: true,
                code: 1-1,
                
            },
            {
                title: '用户',
                id: '/setting/user',
                purviewCode: "user",
                islink: true,
                code: 1-2,
            },
            {
                title: '用户组',
                id: '/setting/userGroup',
                purviewCode: "user_group",
                islink: true,
                code: 1-3,
            },
            {
        
                title: "用户目录",
                id: '/setting/dir',
                purviewCode: "user_dir",
                islink: true,
                code: 1-4,
            },
            {
                title: '权限',
                // icon: 'systempermissions',
                id: "/setting/systemRole",
                purviewCode: "SysPermission",
                code: 2
            },
        ]
    },
    {
        title: '事项配置',
        icon: 'systemmanage',
        id: "/setting/workstatus",
        purviewCode: "SysWork",
        code: 3,
        children: [
            {
                title: '事项类型',
                id: '/setting/worktype',
                purviewCode: "SysWorkType",
                code: 3-1,
            },
            {
                title: '事项优先级',
                id: '/setting/workpriority',
                purviewCode: "SysWorkPriority",
                code: 3-2,
            },
        ]
    },
    {
        title: "消息",
        icon: 'systemmessage',
        id: '/setting/messageNotice',
        purviewCode: "SysMessage",
        code: 4,
        children: [
            {
                title: "消息通知方案",
                id: '/setting/messageNotice',
                purviewCode: "SysMessageNotice",
                code: 4-1
            },
            {
                title: '消息发送方式',
                id: '/setting/messageSendType',
                purviewCode: "SysMessageSendType",
                code: 4-2,
            }
        ]
    },
    {
        title: '表单',
        icon: 'systemform',
        id: "/setting/preliminary",
        purviewCode: "SysForm",
        code: 6,
        children: [
            
            {
                title: '字段类型',
                id: '/setting/fieldType',
                purviewCode: "SysFieldType",
                code: 6-1,
            },
            {
                title: '字段',
                id: '/setting/preliminary',
                purviewCode: "SysFieldType",
                code: 6-2,
            },
            {
                title: '表单',
                id: '/setting/form',
                purviewCode: "SysFormList",
                code: 6-3,
            }
        ]
    },
    {
        title: "流程",
        icon: 'systemflow',
        id: '/setting/systemFlow',
        purviewCode: "SysFlow",
        code: 7,
        children: [
            {
                title: "流程",
                id: '/setting/systemFlow',
                purviewCode: "SysFlowList",
                code: 7-1,
            },
            {
                title: "状态",
                id: '/setting/nodestatus',
                purviewCode: "SysFlowNode",
                code: 7-2
            }
        ]
    },
    {
        title: "插件",
        icon: 'systemplugin',
        id: '/setting/plugin',
        purviewCode: "SysPlugin",
        code: 8,
    },
    {
        title: "系统集成",
        icon: 'systemIntergrtion',
        id: '/setting/loadData',
        code: 9,
        children: [
            {
                title: 'JIRA',
                id: '/setting/loadData',
                code: 9-1,
            },
            {
                title: '地址配置',
                id: '/setting/urlData',
                code: 9-2,
            }
        ]
    },
    {
        title: "安全",
        icon: 'systemlog',
        id: '/setting/log',
        // purviewCode: "SysLog",
        code: 10,
        children: [
            {
                title: '操作日志',
                id: '/setting/logList',
                // purviewCode: "SysLogList",
                code: 10-1,
            }, 
            {
                title: "备份与恢复",
                id: '/setting/backups',
                code: 10-2
            },
        ]
    }, 
   
    {
        title: "应用",
        icon: 'systemversion',
        id: '/setting/version',
        purviewCode: "version",
        code: 11,
        children: [
            {
                title: "版本与许可证",
                id: '/setting/version',
                purviewCode: "version",
                code: 11-1,
            },
            {
                title: "应用访问权限",
                id: '/setting/productAuth',
                purviewCode: "version",
                code: 11-2,
            },
        ]
    },
];
export  { setDevRouter, setPrdRouter};