import React from "react";
import {Version} from 'tiklab-licence-ui';

const ProjectAuthConfig = (props) => {
    const dataSource = [
        {
            key: '1',
            title:"基本功能",
            feature: '项目管理',
            ce: false,
            ee: true,
            rowSpan: 4
        },
        {
            key: '2',
            title:"基本功能",
            feature: '迭代管理',
            ce: false,
            ee: true,
            rowSpan: 0
        },
        {
            key: '3',
            title:"基本功能",
            feature: '事项追踪',
            ce: false,
            ee: true,
            rowSpan: 0
        },
        {
            key: '4',
            title:"基本功能",
            feature: '项目集管理',
            ce: true,
            ee: true,
            rowSpan: 0
        },
        {
            key: '5',
            title:"升级功能",
            feature: '日历视图',
            ce: false,
            ee: true,
            rowSpan: 2
        },
        {
            key: '6',
            title:"升级功能",
            feature: '甘特图',
            ce: true,
            ee: true,
            rowSpan: 0
        },
        {
            key: '7',
            title:"",
            feature: '',
            colSpan:4,
            rowSpan: 1,
        }
    ]
    return (
        <Version bgroup = "teamwire" data = {dataSource}/>
    )
}
export default ProjectAuthConfig;