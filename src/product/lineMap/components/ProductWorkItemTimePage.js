import {withRouter} from "react-router";
import {observer, Provider} from "mobx-react";
import EpicStore from "../../../project/lineMap/store/EpicStore";
import React, {useEffect, useRef, useState} from "react";
import {setSessionStorage} from "../../../common/utils/setSessionStorage";
import {Col, List, Row, Spin} from "antd";
import InputSearch from "../../../common/input/InputSearch";
import WorkCreatDropdown from "../../../work/components/workCreatDropdown";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import ProductLineMapStore from "../store/ProductLineMapStore";
import WorkStore from "../../../work/store/WorkStore";
import "./ProductWorkItemTimePage.scss"

const ProductWorkItemTimePage = (props) => {
    const store = {
        workStore: WorkStore,
        lineMapStore: ProductLineMapStore
    }

    const { findWorkTypeDmList } = EpicStore;
    const { createRecent, setWorkId, setWorkIndex,
        findWorkItemList, deleteWorkItem} = WorkStore;
    const { lineMapView , setLineMapView, findProjectList} = ProductLineMapStore;
    // 产品id
    const productId = props.match.params.productId;
    const [workTypeList, setWorkTypeList] = useState();
    const [dataList, setDataList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelRef = useRef()

    const [projectIds, setProjectIds] = useState([]);

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
        props.history.replace(`/project/${workItem.project.id}/linemap/${workItem.id}`)

        setIsModalVisible(true)

    }

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
                {/*<span className="group-title-item-count">{group.count}个需求</span>*/}
                <span>（{group.count}）</span>
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
            projectIds: projectIds,
            workTypeSysId: workTypeList[0].workType.id,
            title: value
        }
        reSearchTable(param)
    }

    useEffect(() => {
        console.log("按时间视图--产品id：    "+productId)
        // 先获取事项类型信息，然后再获取事项列表
        findProjectList({productId: productId}).then(res => {
            const ids = res.data.map(item => item.id);
            setProjectIds(ids)
            findWorkTypeDmList({ projectIds: ids, codes: ["demand"] }).then(res => {
                if (res.code === 0) {
                    setWorkTypeList(res.data)
                    const param = {
                        projectIds: ids,
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
        })

    }, []);

    const deleteWork = (id) => {
        deleteWorkItem(id).then(res => {
            if (res.code === 0) {
                const param = {
                    projectIds: projectIds,
                    workTypeSysId: workTypeList[0].workType.id
                }
                reSearchTable(param);
            }
        })
    }

    const onChange = (view) => {
        setLineMapView(view);
    }

    return <Provider {...store}>
        <Row style={
            {
                height: "100vh",
                overflowY:"auto"
            }
        }>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "4" }}>
                <div className="project-linemap">
                    <div className="project-linemap-head">
                        <div className="project-linemap-title">路线图</div>
                        <div className="line-map-tab">
                            <div className={`tab-tabpane ${lineMapView === "workItemTime" ? "tab-tabpane-select" : ""}`} onClick={() => onChange("workItemTime")}>
                                按时间
                            </div>
                            <div className={`tab-tabpane ${lineMapView === "workItemStatus" ? "tab-tabpane-select" : ""}`} onClick={() => onChange("workItemStatus")}>
                                按状态
                            </div>
                        </div>
                    </div>
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
                                <div className="work-item-time-content">
                                    <div className="content-table">
                                        {
                                            groupedData.map((group) => (
                                                <div key={group.month}>
                                                    {renderGroupTitle(group)}
                                                    {expandedGroups[group.month] && (
                                                        <List
                                                            dataSource={group.items}
                                                            renderItem={(item, index) => (
                                                                <List.Item
                                                                    // className="work-item"
                                                                    // onClick={() => goWorkItemDetail(item, index)}
                                                                    actions={[
                                                                        // <Space size="small">
                                                                        <div className="workItem-operate">
                                                                            <div className={`work-status ${setStatuStyle(item.workStatusNode.id)}`}>
                                                                                {item.workStatusNode?.name}
                                                                            </div>
                                                                            <div className="delete-operate">
                                                                                <DeleteModal deleteFunction={deleteWork} id={item.id} />
                                                                            </div>
                                                                        </div>
                                                                        // </Space>
                                                                    ]}
                                                                >
                                                                    <div className="item-content-wrapper">
                                                                        <div className="item-avatar">
                                                                            <ImgComponent
                                                                                src={item.workTypeSys?.iconUrl}
                                                                                alt=""
                                                                                className="menu-icon"
                                                                            />
                                                                            {/*<span className="item-code">{item.code}</span>*/}
                                                                        </div>

                                                                        <div className="item-content" onClick={() => goWorkItemDetail(item, index)}>
                                                                            <div
                                                                                className="item-title"

                                                                            >
                                                                                {item.title}
                                                                            </div>
                                                                            <div className="item-description">
                                                                                <span className="item-creator">{item.builder?.nickname}</span>
                                                                                <span className="item-time">{item.buildTime.substring(0, 10)}</span>
                                                                            </div>
                                                                        </div>


                                                                    </div>
                                                                </List.Item>

                                                            )}
                                                        />
                                                    )}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                        }
                    </div>
                </div>

            </Col>
        </Row>


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

export default withRouter(observer(ProductWorkItemTimePage));