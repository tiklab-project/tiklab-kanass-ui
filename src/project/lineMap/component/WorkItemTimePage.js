import React, {useEffect, useRef, useState} from 'react';
import {Spin, Table} from 'antd';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import "./WorkItemTimePage.scss"
import InputSearch from "../../../common/input/InputSearch";
import WorkCreatDropdown from "../../../work/components/workCreatDropdown";
import {observer, Provider} from "mobx-react";
import EpicStore from "../store/EpicStore";
import WorkStore from "../../../work/store/WorkStore";
import {withRouter} from "react-router";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import {setSessionStorage} from "../../../common/utils/setSessionStorage";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import UserIcon from "../../../common/UserIcon/UserIcon";

const WorkItemTimePage = (props) => {

    const store = {
        epicStore: EpicStore,
        workStore: WorkStore
    }

    const { findWorkTypeDmList } = EpicStore;
    const { createRecent, setWorkId, setWorkIndex,
        findWorkItemList, deleteWorkItem} = WorkStore;
    // 项目id
    const projectId = props.match.params.id;
    const [workTypeList, setWorkTypeList] = useState();
    const [dataList, setDataList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelRef = useRef()

    // 按月份分组并排序
    const groupDataByMonth = (data) => {
        const groups = {};

        // console.log("看下计算分组的数据：    "+data)
        if (!data || !Array.isArray(data)){
            return [];
        }

        data.forEach(item => {
            const date = new Date(item.buildTime);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1) <= 9 ? "0"+(date.getMonth() + 1) : (date.getMonth() + 1);
            const monthKey = `${year}-${month}`;

            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }

            groups[monthKey].push(item);
        });

        // 按月份倒序排序
        const sortedMonths = Object.keys(groups).sort((a, b) => {
            return new Date(b) - new Date(a);
        });

        return sortedMonths.map(month => ({
            month,
            items: groups[month].sort((a, b) => new Date(b.buildTime) - new Date(a.buildTime)),
            count: groups[month].length
        }));
    };

    const goWorkItemDetail = (workItem, index) => {
        const params = {
            name: workItem.title,
            model: "workItem",
            modelId: workItem.id,
            project: { id: workItem.project.id },
            projectType: { id: workItem.project.projectType.id },
            iconUrl: workItem.workTypeSys.iconUrl
        }

        createRecent(params)

        setWorkIndex(index)
        setWorkId(workItem.id)
        setIsModalVisible(true)
        setSessionStorage("detailCrumbArray", [{ id: workItem.id, code: workItem.code, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])
        props.history.replace(`/project/${projectId}/linemap/${workItem.id}`)

        setIsModalVisible(true)

    }

    // 表格列配置
    const columns = [
        {
            title: '序号',
            dataIndex: 'code',
            key: 'code',
            width: "10%",
            render: (text, record, index) => <div className="work-id work-first-col" onClick={() => goWorkItemDetail(record, index)}>
                <div className="work-icon">
                    <ImgComponent
                        src={record.workTypeSys?.iconUrl}
                        alt=""
                        className="menu-icon"
                    />
                </div>
                <div className="work-key">{record.code}</div>
            </div>,
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: "30%",
            render: (text, record, index) => <div className="work-title" title = {text} onClick={() => goWorkItemDetail(record, index)}>
                {text}
            </div>,
        },
        {
            title: '创建人',
            dataIndex: ['builder','nickname'],
            key: 'builder',
            width: "15%",
            render: (text, record) => <div className="work-item-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text work-info-master-text" title = {text}>{text}</div>
            </div>,
        },
        {
            title: '创建时间',
            dataIndex: 'buildTime',
            key: 'buildTime',
            width: "15%",
            render: (text, record) => <div>
                {text.substring(0, 10)}
            </div>
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'status',
            width: "10%",
            render: (text, record) => {
                return <div className={`work-status ${setStatuStyle(record.workStatusNode.id)}`}>
                    {text}
                </div>
            },
        },
    ];

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
                break;
            case "done":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
    }


    const [groupedData, setGroupData] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState();
    const [loading, setLoading] = useState(true);

    const toggleGroup = (month) => {
        setExpandedGroups(prev => ({
            ...prev,
            [month]: !prev[month]
        }));
    };

    // 自定义渲染分组标题
    const renderGroupTitle = (group) => {
        const isExpanded = expandedGroups[group.month];

        return (
            <div
                onClick={() => toggleGroup(group.month)}
                className="group-title"
            >
                {isExpanded ? (
                    <svg className="icon-20" aria-hidden="true">
                        <use xlinkHref="#icon-down"></use>
                    </svg>
                ) : (
                    <svg className="icon-20" aria-hidden="true">
                        <use xlinkHref="#icon-right"></use>
                    </svg>
                )}
                <span>{group.month}</span>
                <span className="group-title-item-count">{group.count}个需求</span>
            </div>
        );
    };

    const reSearchTable = (param) => {
        console.log("查询的参数:    "+JSON.stringify(param))
        findWorkItemList(param).then(result => {
            setDataList(result);

            const newGroupedData = groupDataByMonth(result);
            setGroupData(newGroupedData);

            var expandedGroups = newGroupedData.reduce((acc, group) => {
                acc[group.month] = true; // 默认全部展开
                return acc;
            }, {});
            setExpandedGroups(expandedGroups)

            setLoading(false)
        })
    }

    const onSearch = (value) => {
        console.log(value);
        const param = {
            projectId: projectId,
            workTypeSysId: workTypeList[0].workType.id,
            title: value
        }
        reSearchTable(param)
    }

    useEffect(() => {
        // 先获取事项类型信息，然后再获取事项列表
        findWorkTypeDmList({ projectId: projectId, codes: ["demand"] }).then(res => {
            if (res.code === 0) {
                setWorkTypeList(res.data)
                const param = {
                    projectId: projectId,
                    workTypeSysId: res.data[0].workType.id
                }
                findWorkItemList(param).then(result => {
                    // console.log("数据：    "+JSON.stringify(result))
                    setDataList(result);

                    const newGroupedData = groupDataByMonth(result);
                    setGroupData(newGroupedData);

                    var expandedGroups = newGroupedData.reduce((acc, group) => {
                        acc[group.month] = true; // 默认全部展开
                        return acc;
                    }, {});
                    setExpandedGroups(expandedGroups)

                    setLoading(false)
                })
            }

        })
    }, []);

    const deleteWork = (id) => {
        deleteWorkItem({ id: id }).then(res => {
            if (res.code === 0) {
                const param = {
                    projectId: projectId,
                    workTypeSysId: workTypeList[0].workType.id
                }
                reSearchTable(param);
            }
        })
     }

    return <Provider {...store}>
        <div className="work-item-time-page">
            <div className="top-action">
                <InputSearch
                    placeholder="搜索需求"
                    allowClear
                    onChange={onSearch}
                />
                <div className="top-action-right">
                    <WorkCreatDropdown workTypeList={workTypeList}  {...props} modelStyle={{ right: 0 }} />
                </div>
            </div>
            {
                loading ? <Spin /> :
                    <div style={{
                        background: '#fff',
                        borderRadius: 8,
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                        overflow: 'hidden',
                        height: 1000, // 固定高度
                        display: 'flex',
                        flexDirection: 'column'
                    }}>

                        <div className="header-table">
                            <Table
                                columns={columns}
                                rowKey={'header'}
                                pagination={false}
                                showHeader={true}
                                style={{ border: 'none' }}
                                locale={{ Empty: {description:null} }} // 禁用空数据提示
                            />
                        </div>

                        <div className="content-table">
                            {
                                groupedData.map((group) => (
                                    <div key={group.month}>
                                        {renderGroupTitle(group)}
                                        {expandedGroups[group.month] && (
                                            <Table
                                                columns={columns}
                                                dataSource={group.items}
                                                rowKey="id"
                                                pagination={false}
                                                showHeader={false}
                                                style={{ border: 'none' }}
                                                // rowClassName={() => 'grouped-table-row'}
                                            />
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
            }
        </div>

        <WorkDetailDrawer
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            modelRef={modelRef}
            showPage={true}
            // deleteWork = {deleteWork}
            delectCurrentWorkItem={deleteWork}
            {...props}
        />
    </Provider>
};

export default withRouter(observer(WorkItemTimePage));