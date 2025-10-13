import {withRouter} from "react-router";
import {observer, Provider} from "mobx-react";
import EpicStore from "../../../project/lineMap/store/EpicStore";
import React, {useEffect, useRef, useState} from "react";
import {setSessionStorage} from "../../../common/utils/setSessionStorage";
import {Col, Empty, List, Row, Spin, Tag} from "antd";
import InputSearch from "../../../common/input/InputSearch";
import WorkCreatDropdown from "../../../work/components/workCreatDropdown";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import ProductLineMapStore from "../store/ProductLineMapStore";
import WorkStore from "../../../work/store/WorkStore";
import "./ProductWorkItemTimePage.scss"
import UserIcon from "../../../common/UserIcon/UserIcon";

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
        props.history.replace(`/product/${productId}/linemap/${workItem.id}`)

        setIsModalVisible(true)
    }

    const setStatusStyle = (id) => {
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
                <span>（{group.count}）</span>
            </div>
        );
    };

    const reSearchTable = (param) => {
        findWorkItemList(param).then(result => {
            setDataList(result);

            const newGroupedData = groupDataByMonth(result);
            setGroupData(newGroupedData);

            var expandedGroups = newGroupedData.reduce((acc, group) => {
                acc[group.month] = true;
                return acc;
            }, {});
            setExpandedGroups(expandedGroups)

            setLoading(false)
        })
    }

    const onSearch = (value) => {
        const param = {
            projectIds: projectIds,
            workTypeSysId: workTypeList[0].workType.id,
            title: value,
            projectId: null
        }
        reSearchTable(param)
    }

    useEffect(() => {
        findProjectList({productId: productId}).then(res => {
            const ids = res.data.map(item => item.id);
            setProjectIds(ids)
            findWorkTypeDmList({ projectIds: ids, codes: ["demand"] }).then(res => {
                if (res.code === 0) {
                    setWorkTypeList(res.data)

                    // 未关联项目
                    if (ids.length === 0){
                        setDataList([])
                        setGroupData([]);
                        setLoading(false)
                        return;
                    }

                    const param = {
                        projectIds: ids,
                        workTypeSysId: res.data[0].workType.id,
                        projectId:null
                    }
                    findWorkItemList(param).then(result => {
                        setDataList(result);

                        const newGroupedData = groupDataByMonth(result);
                        setGroupData(newGroupedData);

                        var expandedGroups = newGroupedData.reduce((acc, group) => {
                            acc[group.month] = true;
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
        <Row style={{ height: "100vh", overflowY:"auto" }}>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "20", offset: "2" }} xxl={{ span: "18", offset: "4" }}>
                <div className="product-linemap">
                    <div className="product-linemap-head">
                        <div className="product-linemap-title">路线图</div>
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
                                            groupedData.length > 0 ? groupedData.map((group) => (
                                                <div key={group.month}>
                                                    {renderGroupTitle(group)}
                                                    {expandedGroups[group.month] && (
                                                        <List
                                                            dataSource={group.items}
                                                            renderItem={(item, index) => (
                                                                <List.Item
                                                                    className="work-item-row"
                                                                    actions={[
                                                                        <div className="workItem-operate">
                                                                            <DeleteModal deleteFunction={deleteWork} id={item.id} />
                                                                        </div>
                                                                    ]}
                                                                >
                                                                    <div className="work-item-columns">
                                                                        {/* Column 1: Icon + Title */}
                                                                        <div className="column-icon-title" onClick={() => goWorkItemDetail(item, index)}>
                                                                            <div className="item-avatar">
                                                                                <ImgComponent
                                                                                    src={item.workTypeSys?.iconUrl}
                                                                                    alt=""
                                                                                    className="icon-18"
                                                                                />
                                                                            </div>
                                                                            <div className="item-title">
                                                                                {item.title}
                                                                            </div>
                                                                        </div>

                                                                        {/* Column 3: Status */}
                                                                        <div className={'column-status'}>
                                                                            <div className={`work-status ${setStatusStyle(item.workStatusNode.id)}`}>
                                                                                {item.workStatusNode?.name}
                                                                            </div>
                                                                        </div>

                                                                        {/* Column 4: Priority */}
                                                                        <div className={`column-priority`}>
                                                                            <div className="work-info-img">
                                                                                <ImgComponent
                                                                                    src={item.workPriority?.iconUrl}
                                                                                    alt=""
                                                                                    // isRemote={true}
                                                                                    className="img-icon-right icon-10"
                                                                                />
                                                                            </div>
                                                                            <div className="work-info-text">{item.workPriority?.name || '-'}</div>
                                                                        </div>

                                                                        {/* Column 5: Creator */}
                                                                        <div className="column-creator">
                                                                            <UserIcon name={item.builder?.nickname} />
                                                                            {item.builder?.nickname || '-'}
                                                                        </div>

                                                                        {/* Column 6: Create Time */}
                                                                        <div className="column-time">
                                                                            {item.buildTime.substring(0, 10)}
                                                                        </div>
                                                                    </div>
                                                                </List.Item>
                                                            )}
                                                        />
                                                    )}
                                                </div>
                                            ))
                                                :<Empty
                                                    imageStyle={{height: 100}}
                                                    description={<span>暂无数据</span>}
                                                />
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
            delectCurrentWorkItem={deleteWork}
            {...props}
        />
    </Provider>
};

export default withRouter(observer(ProductWorkItemTimePage));