import React from "react";
import { Version } from 'thoughtware-licence-ui';
import { Table,Icon } from "antd";
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
const ProjectAuthConfig = (props) => {
    const columns = [
        {
            title: '功能',
            dataIndex: 'title',
            key: 'name',
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                if (index === 0) {
                    obj.props.rowSpan = 4;
                }
                if (index === 1) {
                    obj.props.rowSpan = 0;
                }
                if (index === 2) {
                    obj.props.rowSpan = 0;
                }
                if (index === 3) {
                    obj.props.rowSpan = 0;
                }
                if (index === 4) {
                    obj.props.rowSpan = 2;
                }
                if (index === 5) {
                    obj.props.rowSpan = 0;
                }
                return obj;
            },
        },

        {
            title: '功能点',
            dataIndex: 'feature',
            key: 'age',
        },
        {
            title: '免费',
            dataIndex: 'ce',
            key: 'ce',
            render: (text) => {
                return text ? <CheckOutlined /> : <CloseOutlined />
            }
        },
        {
            title: '付费',
            dataIndex: 'ee',
            key: 'ee',
            render: (text) => {
                return text ? <CheckOutlined /> : <CloseOutlined />
            }
        }
    ];
    const dataSource = [
        {
            key: '1',
            title: "基本功能",
            feature: '项目管理',
            ce: true,
            ee: true,
            rowSpan: 4,

        },
        {
            key: '2',
            title: "基本功能",
            feature: '迭代管理',
            ce: true,
            ee: true,
            rowSpan: 0
        },
        {
            key: '3',
            title: "基本功能",
            feature: '事项追踪',
            ce: true,
            ee: true,
            rowSpan: 0
        },
        {
            key: '4',
            title: "基本功能",
            feature: '项目集管理',
            ce: true,
            ee: true,
            rowSpan: 0
        },
        {
            key: '5',
            title: "升级功能",
            feature: '日历视图',
            ce: false,
            ee: true,
            rowSpan: 2
        },
        {
            key: '6',
            title: "升级功能",
            feature: '甘特图',
            ce: false,
            ee: true,
            rowSpan: 0
        }
    ]
    return (
        <Version bgroup="kanass">
            <Table
                bordered
                columns={columns}
                dataSource={dataSource}
                pagination={false}
            />
        </Version>
    )
}
export default ProjectAuthConfig;