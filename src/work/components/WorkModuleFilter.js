import {inject, observer} from "mobx-react";
import {withRouter} from "react-router";
import React,{useEffect, useState} from "react";
import ModuleStore from "../../project/setting/module/store/ModuleStore";
import "./WorkModuleFilter.scss"
import {searchWorkList, setWorkDeatilInList} from "./WorkSearch";
import {getUser} from "tiklab-core-ui";
import {
    CheckCircleOutlined, DownOutlined,
    ExclamationCircleOutlined, FolderOpenOutlined,
    FolderOutlined, PlusOutlined, RightOutlined,
    ScheduleOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Button, message, Modal, Tree} from "antd";
import WorkModuleAddModal from "./WorkModuleAddModal";
import DeleteModal from "../../common/deleteModal/deleteModal";
const {TreeNode} = Tree;

const WorkModuleFilter = (props) => {
    const { workStore } = props;
    const { quickFilterValue, setQuickFilterValue,setSearchCondition, findStateNodeList, getWorkConditionPageTree, setTableTitle, setModuleTitle } = workStore;
    const {findModuleListTree, deleteModule} = ModuleStore
    const [isOpen, setIsOpen] = useState(true);
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const userId = getUser().userId;

    const [treeList ,setTreeList] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [hoverNodeKey, setHoverNodeKey] = useState(null);
    const [moduleVisible, setModuleVisible] = useState(false);
    const [parentId, setParentId] = useState(null);
    const [moduleSelect, setModuleSelect] = useState(null);

    const quickFilterList = [
        {
            value: "pending",
            label: "我的待办"
        },
        {
            value: "creat",
            label: "我创建的"
        }
    ]

    /**
     * 获取事项状态范围对应的查询参数
     * @param value   {{value:筛选条件}}
     * @param label   {{label:类型名称}}
     */
    const getWorkStatusRangeWorkItem = (value,label) => {
        setQuickFilterValue(value)
        setTableTitle(label)
        setModuleTitle(null)
        setModuleSelect(null)
        console.log("筛选条件++++++" + JSON.stringify(value))
        if (!value) {
            getAllWorkItem();
            return
        } else {
            let data = value;
            switch (data) {
                case "all":
                    getAllWorkItem();
                    break;
                case "pending":
                    getPendingWorkItem();
                    break;
                case "ending":
                    getEndingWorkItem();
                    break;
                case "creat":
                    getCreatWorkItem();
                    break;
                case "overdue":
                    getOverdueWorkItem();
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 获取全部事项
     */
    const getAllWorkItem = () => {
        const initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            moduleIds: [],

        }
        setSearchCondition(initValues)
        getWorkList(initValues);
    }

    /**
     * 获取待办事项
     */
    const getPendingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            moduleIds: [],
        }
        getStateNodeList({ quickName: "pending" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    /**
     * 获取已办事项
     */
    const getEndingWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            moduleIds: [],
        }
        getStateNodeList({ quickName: "done" }).then(data => {
            initValues = { workStatusIds: data, ...initValues }
            setSearchCondition(initValues);
            getWorkList(initValues);
        })
    }

    /**
     * 获取我创建的事项
     */
    const getCreatWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            overdue: false,
            builderId: userId,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            moduleIds: [],
        }
        setSearchCondition(initValues);
        getWorkList(initValues);
    }

    /**
     * 获取已逾期的事项
     */
    const getOverdueWorkItem = () => {
        let initValues = {
            sprintId: sprintId,
            overdue: true,
            builderId: null,
            workStatusIds: [],
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            moduleIds: [],
        }
        setSearchCondition(initValues)
        getWorkList(initValues);
    }

    /**
     * 获取事项列表
     */
    const getWorkList = (initValues) => {
        setWorkDeatilInList(workStore, initValues)
    }

    /**
     * 根据条件获取状态节点列表
     */
    const getStateNodeList = async (value) => {
        const stateNodeList = []
        await findStateNodeList(value).then(res => {
            if (res.code === 0) {
                if (res.data.length > 0) {
                    res.data.map(item => {
                        stateNodeList.push(item.id)
                    })
                }
            }
        })
        const newStateNodeList = stateNodeList.filter((item, index) => {
            return stateNodeList.indexOf(item) === index;  // 因为indexOf 只能查找到第一个
        });

        return newStateNodeList;
    }



    useEffect(() => {
        findModuleListTree({projectId: projectId}).then(res => {
            console.log(res)
            setTreeList(res.data)
        });
        // // 默认选中我创建的
        // setTableTitle("我创建的")
        // setQuickFilterValue("creat")
        // getCreatWorkItem()

    }, [moduleVisible]);

    const handleExpand = (expandedKeys, { node }) => {
        setExpandedKeys(expandedKeys);
    }

    // 新增事件
    const handleAddNodeClick = (id) => {
        setParentId(id);
        setModuleVisible(true);
        findModuleListTree({projectId: projectId}).then(res => {
            console.log(res)
            setTreeList(res.data)
        });
    }

    const handleDeleteNodeClick = (id) => {
        // 先检查是否存在关联的事项
        deleteModule(id).then(res => {
            if (res.data === false){
                message.error("该模块下存在事项无法删除")
            }
            findModuleListTree({projectId: projectId}).then(res => {
                console.log(res)
                setTreeList(res.data)
            });
        });
    }

    // 点击筛选事件
    const handleNodeClick = (id, moduleName) => {
        let param;
        if (id){
            param = {
                overdue: false,
                builderId: null,
                workStatusIds: [],
                moduleIds: [id]
            }
        }else {
            param = {
                overdue: false,
                builderId: null,
                workStatusIds: [],
                moduleIds: []
            }
        }

        getWorkConditionPageTree(param).then(res => {
            setModuleSelect(id)
            setModuleTitle(moduleName)
            setTableTitle(null)
            setQuickFilterValue("all")
        })

    }


    // 构建模块树节点
    const buildTreeNode = (data) => {
        return (
            data && data.map(item => {
                const isExpand = expandedKeys.includes(item.id);
                return (
                    <TreeNode
                        key={item.id}
                        title={
                            <>
                                <div
                                    className={`module-tree-node ${moduleSelect === item.id ? "module-tree-node-active" : ""} `}
                                    onMouseEnter={(e) => {
                                        e.stopPropagation();
                                        setHoverNodeKey(item.id)
                                    }}
                                    onMouseLeave={(e) => {
                                        e.stopPropagation();
                                        setHoverNodeKey(null)
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNodeClick(item.id, item.moduleName)
                                    }}
                                >
                                    <div className="module-tree-node-title">
                                        {
                                            isExpand ?
                                                <FolderOpenOutlined />
                                                :
                                                <FolderOutlined />
                                        }
                                        <span style={{marginLeft: "5px"}}>{item.moduleName}</span>
                                    </div>
                                    {
                                        hoverNodeKey === item.id &&
                                        <div className="module-tree-node-action">
                                            <div
                                                onClick={() => handleAddNodeClick(item.id)}
                                            >
                                                <PlusOutlined />
                                            </div>
                                            <DeleteModal deleteFunction = {handleDeleteNodeClick} id = {item.id} />
                                        </div>
                                    }

                                </div>
                        </>
                        }
                    >
                        {
                            item.children && buildTreeNode(item.children)
                        }
                    </TreeNode>
                )
            })
        )
    }

    // 添加根节点模块
    const addRootModule = () => {
        setParentId(null)
        setModuleVisible(true)
    }


    return(
        <div className={`work-module-filter ${!isOpen ? "work-module-filter-close" : ""}`}>
            {
                isOpen ?
                    <div className="work-module-filter-sider">
                        <div className="work-module-filter-sider-top">
                            <div className="work-module-filter-sider-top-title">
                                事项
                            </div>
                            {
                                quickFilterList.map((item, index) => {
                                    return (
                                        <div className={`work-module-filter-sider-top-item ${quickFilterValue === item.value ? "work-module-filter-sider-top-item-active" : ""}`} onClick={() => getWorkStatusRangeWorkItem(item.value, item.label)}>
                                            {
                                                index === 0 && <ScheduleOutlined />
                                                || index === 1 && <UserOutlined />
                                            }
                                            <div className="work-module-filter-sider-top-item-title">
                                                {item.label}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="work-module-filter-sider-content">
                            <div className="content-module-head" onClick={(e) => {
                                e.stopPropagation()
                                handleNodeClick(null, null)
                            }}>
                                <FolderOutlined />
                                <div className="content-module-title">
                                    模块
                                </div>
                                <div style={{marginLeft: "auto",cursor: "pointer"}} onClick={addRootModule}>
                                    <PlusOutlined />
                                </div>
                            </div>
                            <div className="content-module-tree">
                                <Tree
                                    onExpand={handleExpand}
                                    switcherIcon={<DownOutlined />}
                                    showLine={false}
                                >
                                    {
                                        buildTreeNode(treeList)
                                    }
                                </Tree>
                            </div>
                        </div>
                        <div className="work-module-filter-sider-bottom">
                            <div className="work-module-filter-close-icon" onClick={()=>{setIsOpen(false)}}>
                                <svg className="icon-20" aria-hidden="true">
                                    <use xlinkHref="#icon-indent-decrease"></use>
                                </svg>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={`work-module-filter-open-icon`} onClick={()=>{setIsOpen(true)}}>
                        <svg className="icon-20" aria-hidden="true">
                            <use xlinkHref="#icon-indent-increase"></use>
                        </svg>
                    </div>

            }
            <WorkModuleAddModal
                moduleStore={ModuleStore}
                moduleVisible={moduleVisible}
                setModuleVisible={setModuleVisible}
                parentId={parentId}
                projectId={projectId}
            />
        </div>
    )
}

export default withRouter(inject("workStore")(observer(WorkModuleFilter)));