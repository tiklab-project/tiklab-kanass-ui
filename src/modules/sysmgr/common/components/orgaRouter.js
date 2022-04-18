/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 14:44:20
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-28 16:32:06
 */
const orgaRouterLocal = [
    {
        title: '组织中心',
        icon: 'icon1_imac',
        key: "/index/organ/organ",
        encoded: "SysOrgaCon",
        code: 1,
        children: [
            {
                title: "组织管理",
                icon: 'icon1_color',
                key: '/index/organ/organ',
                encoded: "SysOrga",
                code: 1-1,
                
            },
            {
                title: '用户管理',
                icon: 'icon1_user2',
                key: '/index/organ/user',
                encoded: "SysUser",
                code: 1-2,
            },
            {
        
                title: "同步数据",
                icon: 'icon1_user',
                key: '/index/organ/directory',
                encoded: "SysMessage",
                code: 1-3,
            }
        ]
    },
    {
        title: '项目类型',
        icon: 'icon1_mug',
        key: '/index/organ/projectType',
        encoded: "ProjectType",
        code: 2,
    },
    {
        title: '事项管理',
        icon: 'icondaibanshixiang1',
        key: "/index/organ/workstatus",
        encoded: "SysWork",
        code: 3,
        children: [
            {
                title: '事项状态',
                icon: 'iconbaojingjilu',
                key: '/index/organ/workstatus',
                encoded: "SysWorkStatus",
                code: 3-1,
            },
            {
                title: '事项类型',
                icon: 'icon1_water-ice',
                key: '/index/organ/worktype',
                encoded: "SysWorkType",
                code: 3-2,
            },
            {
                title: '事项优先级',
                icon: 'icon1_laptop-graph',
                key: '/index/organ/workpriority',
                encoded: "SysWorkPriority",
                code: 3-3,
            },
        ]
    },
    {
        title: '系统权限中心',
        icon: 'icon1_megaphone-money',
        key: "/index/organ/systemFeature",
        encoded: "SysPrisystem",
        code: 4,
        children: [
            {
                title: '功能管理',
                icon: 'icon1_lcd-tv',
                key: '/index/organ/systemFeature',
                encoded: "SysFeatruestem",
                code: 4-1,
            },
            {
                title: '角色管理',
                icon: 'icon1_gameboy',
                key: '/index/organ/systemRole',
                encoded: "SysRoleSystem",
                code: 4-2,
            }
        ]
    },
    {
        title: '项目权限中心',
        icon: 'icon1_gold-bars',
        key: "/index/organ/projectFeature",
        encoded: "SysPriProject",
        code: 5,
        children: [
            {
                title: '功能管理',
                icon: 'icon1_gameboy',
                key: '/index/organ/projectFeature',
                encoded: "SysFeatrueProject",
                code: 5-1,
            },
            {
                title: '角色管理',
                icon: 'icon1_user5',
                key: '/index/organ/projectRole',
                encoded: "SysRoleProject",
                code: 5-2
            }   
        ]
    },
    {
        title: '表单中心',
        icon: 'iconbaojingjilu',
        key: "/index/organ/preliminary",
        encoded: "SysForm",
        code: 6,
        children: [
            {
                title: '字段类型',
                icon: 'icon1_set-square ',
                key: '/index/organ/preliminaryType',
                encoded: "SysField",
                code: 6-1,
            },
            {
                title: '字段',
                icon: 'icon1_football',
                key: '/index/organ/preliminary',
                encoded: "SysFieldType",
                code: 6-2,
            },
            {
                title: '表单',
                icon: 'icon1_sun-clouds',
                key: '/index/organ/form',
                encoded: "SysFormSet",
                code: 6-3,
            }
        ]
    },
    {
        title: "流程中心",
        icon: 'icon1_sea',
        key: '/index/organ/systemFlow',
        encoded: "SysFlow",
        code: 7,
    },
    {
        title: "消息中心",
        icon: 'icon1_user',
        key: '/index/organ/messageTemplate',
        encoded: "SysMessage",
        code: 8,
        children: [
            {
                title: '消息管理',
                icon: 'icon1_spider-eye',
                key: '/index/organ/messageManagement',
                encoded: "SysMessageManagement",
                code: 8-1,
            },
            {
                title: '消息模板管理',
                icon: 'icon1_gold-bars',
                key: '/index/organ/messageTemplate',
                encoded: "SysMessageTemplate",
                code: 8-2,
            },
            {
                title: '消息类型管理',
                icon: 'icon1_lcd-tv',
                key: '/index/organ/messageType',
                encoded: "SysMessageType",
                code: 8-3,
            },
            {
                title: '消息发送方式',
                icon: 'icon1_lcd-tv',
                key: '/index/organ/messageSendType',
                encoded: "SysMessageType",
                code: 8-4,
            },
            {
                title: '邮箱配置',
                icon: 'icon1_lcd-tv',
                key: '/index/organ/emailConfig',
                encoded: "SysMessageEmail",
                code: 8-5,
            }
        ]
    },
    {
        title: "导入数据",
        icon: 'icon1_user',
        key: '/index/organ/loadData',
        encoded: "SysMessage",
        code: 10,
    },
    {
        title: "licence管理",
        icon: 'icon1_user',
        key: '/index/organ/licence',
        encoded: "SysLicence",
        code: 12,
    },
    {
        title: "插件管理",
        icon: 'icon1_user',
        key: '/index/organ/plugin',
        encoded: "SysPlugin",
        code: 13,
    }
];
const orgaRouterAcc = [
    {
        title: '项目类型',
        icon: 'icon1_mug',
        key: '/index/organ/projectType',
        encoded: "ProjectType",
        code: 1,
    },
    {
        title: '事项管理',
        icon: 'icondaibanshixiang1',
        key: "/index/organ/workstatus",
        encoded: "SysWork",
        code: 2,
        children: [
            {
                title: '事项状态',
                icon: 'iconbaojingjilu',
                key: '/index/organ/workstatus',
                encoded: "SysWorkStatus",
                code: 2-1,
            },
            {
                title: '事项类型',
                icon: 'icon1_water-ice',
                key: '/index/organ/worktype',
                encoded: "SysWorkType",
                code: 2-2,
            },
            {
                title: '事项优先级',
                icon: 'icon1_laptop-graph',
                key: '/index/organ/workpriority',
                encoded: "SysWorkPriority",
                code: 2-3,
            },
        ]
    },
    {
        title: '系统权限中心',
        icon: 'icon1_megaphone-money',
        key: "/index/organ/systemFeature",
        encoded: "SysPrisystem",
        code: 3,
        children: [
            {
                title: '功能管理',
                icon: 'icon1_lcd-tv',
                key: '/index/organ/systemFeature',
                encoded: "SysFeatruestem",
                code: 3-1,
            },
            {
                title: '角色管理',
                icon: 'icon1_gameboy',
                key: '/index/organ/systemRole',
                encoded: "SysRoleSystem",
                code: 3-2,
            }
        ]
    },
    {
        title: '项目权限中心',
        icon: 'icon1_gold-bars',
        key: "/index/organ/projectFeature",
        encoded: "SysPriProject",
        code: 4,
        children: [
            {
                title: '功能管理',
                icon: 'icon1_gameboy',
                key: '/index/organ/projectFeature',
                encoded: "SysFeatrueProject",
                code: 4-1,
            },
            {
                title: '角色管理',
                icon: 'icon1_user5',
                key: '/index/organ/projectRole',
                encoded: "SysRoleProject",
                code: 4-2
            }   
        ]
    },
    {
        title: '表单中心',
        icon: 'iconbaojingjilu',
        key: "/index/organ/preliminary",
        encoded: "SysForm",
        code: 5,
        children: [
            {
                title: '字段类型',
                icon: 'icon1_set-square ',
                key: '/index/organ/preliminaryType',
                encoded: "SysField",
                code: 5-1,
            },
            {
                title: '字段',
                icon: 'icon1_football',
                key: '/index/organ/preliminary',
                encoded: "SysFieldType",
                code: 5-2,
            },
            {
                title: '表单',
                icon: 'icon1_sun-clouds',
                key: '/index/organ/form',
                encoded: "SysFormSet",
                code: 5-3,
            }
        ]
    },
    {
        title: "流程中心",
        icon: 'icon1_sea',
        key: '/index/organ/systemFlow',
        encoded: "SysFlow",
        code: 6,
    },
    {
        title: "消息中心",
        icon: 'icon1_user',
        key: '/index/organ/messageTemplate',
        encoded: "SysMessage",
        code: 7,
        children: [
            {
                title: '消息管理',
                icon: 'icon1_spider-eye',
                key: '/index/organ/messageManagement',
                encoded: "SysMessageManagement",
                code: 7-1,
            },
            {
                title: '消息模板管理',
                icon: 'icon1_gold-bars',
                key: '/index/organ/messageTemplate',
                encoded: "SysMessageTemplate",
                code: 7-2,
            },
            {
                title: '消息类型管理',
                icon: 'icon1_lcd-tv',
                key: '/index/organ/messageType',
                encoded: "SysMessageType",
                code: 7-3,
            },
            {
                title: '消息发送方式',
                icon: 'icon1_lcd-tv',
                key: '/index/organ/messageSendType',
                encoded: "SysMessageType",
                code: 7-4,
            },
            {
                title: '邮箱配置',
                icon: 'icon1_lcd-tv',
                key: '/index/organ/emailConfig',
                encoded: "SysMessageEmail",
                code: 7-5,
            }
        ]
    },
    {
        title: "导入数据",
        icon: 'icon1_user',
        key: '/index/organ/loadData',
        encoded: "SysMessage",
        code: 8,
    },
    {
        title: "licence管理",
        icon: 'icon1_user',
        key: '/index/organ/licence',
        encoded: "SysLicence",
        code: 9,
    },
    {
        title: "插件管理",
        icon: 'icon1_user',
        key: '/index/organ/plugin',
        encoded: "SysPlugin",
        code: 10,
    }
];
export {orgaRouterLocal,orgaRouterAcc};