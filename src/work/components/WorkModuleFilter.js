import {inject, observer} from "mobx-react";
import {withRouter} from "react-router";
import React,{useEffect, useState} from "react";
import ModuleStore from "../../project/setting/module/store/ModuleStore";
import "./WorkModuleFilter.scss"
import {searchWorkList, setWorkDeatilInList} from "./WorkSearch";
import {getUser} from "tiklab-core-ui";
import {
    DownOutlined, FolderOpenOutlined,
    FolderOutlined, PlusOutlined,
    ScheduleOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Button, Input, message, Modal, Tree} from "antd";
import WorkModuleAddModal from "./WorkModuleAddModal";
import DeleteModal from "../../common/deleteModal/deleteModal";
import WorkModuleFilterOperateSelectModal from "./WorkModuleFilterOperateSelectModal";
import ProductModuleStore from "../../product/module/store/ProductModuleStore";
import ProductStore from "../../product/product/store/ProductStore";
import ProjectSetStore from "../../projectSet/projectSet/store/ProjectSetStore";
const {TreeNode} = Tree;

const getModuleStore = (project, path) =>{
    if (project?.productId || path === "/product/:productId/workitem"){
        return ProductModuleStore
    }else {
        return ModuleStore
    }
}
const getStore = (productId) =>{
    if (productId){
        return ProductStore
    }else {
        return ProjectSetStore
    }
}
const WorkModuleFilter = (props) => {
    const { workStore, onIsOpenChange } = props;
    const { quickFilterValue, setQuickFilterValue,setSearchCondition, findStateNodeList, tabValue,
        getWorkConditionPageTree, getWorkConditionPage, setTableTitle, setModuleTitle, setTabValue,
        viewType, findUserCreateAndTodoWorkNum, workList, findWorkTypeDmList, setQuickFilterVisible,
        setWorkTypeVisible } = workStore;

    const project = JSON.parse(localStorage.getItem('project'));
    const path = props.match.path;
    const workTypeCode = props.match.params.workTypeCode ? props.match.params.workTypeCode : null;
    const {findModuleListTree, deleteModule} = getModuleStore(project, path)

    const productId = props.match.params.productId ? props.match.params.productId : null;
    const projectSetId = props.match.params.projectSetId ? props.match.params.projectSetId : null;
    const {findProjectList} = getStore(productId)

    const [isOpen, setIsOpen] = useState(true);
    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const userId = getUser().userId;

    const [treeList ,setTreeList] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [hoverNodeKey, setHoverNodeKey] = useState(null);
    const [hoverTitle, setHoverTitle] = useState(false);
    const [moduleVisible, setModuleVisible] = useState(false);
    const [moduleTreeVisible, setModuleTreeVisible] = useState(false);
    const [parentId, setParentId] = useState(null);
    const [moduleSelect, setModuleSelect] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [workNum, setWorkNum] = useState({
        pending:0,
        create:0
    });
    const [workSystem, setWorkSystem] = useState([]);
    const [workCustom, setWorkCustom] = useState([]);
    const [showCustomWorkType, setShowCustomWorkType] = useState(false);

    useEffect(() => {
        // 当 isOpen 变化时调用父组件的回调
        onIsOpenChange?.();
    }, [isOpen, onIsOpenChange]);

    // useEffect(() => {
    //     console.log("当前状态：  ", moduleTreeVisible)
    // },[moduleTreeVisible])

    const quickFilterList = [
        {
            value: "all",
            label: "所有事项",
            icon: "module"
        },
        {
            value: "pending",
            label: "我的待办",
            icon: "my-pending"
        },
        {
            value: "assigner",
            label: "我负责的",
            icon: "my-ending"
        },
        {
            value: "creat",
            label: "我创建的",
            icon: "my-creat"
        },
        // {
        //     value: "overdue",
        //     label: "已逾期",
        //     icon: "my-overdue"
        // }
    ]

    /**
     * 获取事项状态范围对应的查询参数
     * @param value   {{value:筛选条件}}
     * @param label   {{label:类型名称}}
     */
    const getWorkStatusRangeWorkItem = (value,label) => {
        setQuickFilterValue(value)
        setTableTitle(label)
        // setModuleTitle(null)
        setModuleSelect(null)
        setQuickFilterVisible(false)
        setWorkTypeVisible(true)
        setTabValue({
            id: "all",
            type: "system",
            value: null,
            label: null
        })
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
                case "assigner":
                    getAssignerWorkItem();
                    break;
                default:
                    break;
            }
        }
    }

    useEffect(() => {
        const param = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            builderId: userId, // 创建人，负责人后端会处理
        }
        findUserCreateAndTodoWorkNum(param).then(res =>{
            setWorkNum(res.data)
        })
    }, [workList]);

    useEffect(() => {
        //获取系统内置事项类型
        findWorkTypeDmList({ projectId: projectId, grouper: "system" }).then(res => {
            if (res.code === 0) {
                setWorkSystem(res.data)
            }
        })

        //获取自定义事项类型
        findWorkTypeDmList({ projectId: projectId, grouper: "custom" }).then(res => {
            if (res.code === 0) {
                setWorkCustom(res.data)
            }
        })
        return;
    }, [projectId])

    /**
     * 选择自定义事项类型
     * @param {事项类型} value
     */
    const selectCustomType = (value) => {
        search({
            workTypeId: value.id,
            overdue: false,
            builderId: null,
            assignerId: null,
            workStatusIds: []
        })
        setTabValue({
            id: value.id,
            type: "custom",
            value: value.id,
            label: value.name
        })
        setTableTitle(value.name)
        setQuickFilterValue("all")
        setModuleSelect(null)
        setQuickFilterVisible(true)
        setWorkTypeVisible(false)
    }

    /**
     * 选择事项类型
     * @param {事项类型} value
     */
    const selectType = (value) => {
        if (value === "all") {
            search({
                workTypeId: "",
                overdue: false,
                builderId: null,
                assignerId: null,
                workStatusIds: [], })
            setTabValue({
                id: "all",
                type: "system",
                value: null,
                label: null
            })
            setTableTitle(value.name)
            setQuickFilterValue("all")
            setModuleSelect(null)
            setQuickFilterVisible(true)
            setWorkTypeVisible(false)
        } else {
            setTabValue({
                id: value.id,
                type: "system",
                value: value.id,
                label: value.name,
                code: value.code
            })
            setTableTitle(value.name)
            setQuickFilterValue("all")
            setModuleSelect(null)
            setQuickFilterVisible(true)
            setWorkTypeVisible(false)
            search({
                workTypeId: value.id,
                overdue: false,
                builderId: null,
                assignerId: null,
                workStatusIds: [],
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            })
        }
    }

    /**
     * 搜索事项
     * @param {搜索条件} values
     */
    const search = values => {
        searchWorkList(workStore, values)
    };

    /**
     * 获取全部事项
     */
    const getAllWorkItem = () => {
        const initValues = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            workTypeId: "",
            overdue: false,
            builderId: null,
            assignerId: null,
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
            versionId: versionId,
            workTypeId: "",
            overdue: false,
            builderId: null,
            assignerId: userId,
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
            versionId: versionId,
            workTypeId: "",
            overdue: false,
            builderId: null,
            assignerId: userId,
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
            versionId: versionId,
            workTypeId: "",
            overdue: false,
            builderId: userId,
            assignerId: null,
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
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            workTypeId: "",
            overdue: true,
            builderId: null,
            assignerId: userId,
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
     * 获取我负责的事项
     */
    const getAssignerWorkItem = () => {
        let initValues = {
            projectId: projectId,
            sprintId: sprintId,
            versionId: versionId,
            workTypeId: "",
            overdue: false,
            builderId: null,
            assignerId: userId,
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



    useEffect(async () => {
        let param = {}
        if (path === "/product/:productId/workitem" ){
            param = {productId: productId, projectIds:[]}
        }else if(path === "/projectSet/:projectSetId/workitem"){
            const res = await findProjectList({projectSetId: projectSetId})
            const ids = res.data.map(item => item.id);
            param = {projectIds: ids, projectId: null}
        } else {
            param = {
                projectId: projectId, projectIds:[]
            }
        }
        selectTreeData(param)
    }, [moduleVisible]);

    const handleExpand = (expandedKeys, { node }) => {
        setExpandedKeys(expandedKeys);
    }

    // 新增事件
    const handleAddNodeClick = (id) => {
        setParentId(id);
        setModuleVisible(true);
    }

    const selectTreeData = (param) => {
        findModuleListTree(param).then(res => {
            console.log(res)
            setTreeList(res.data)
        });
    }

    const inputChange = (value) =>{
        setInputValue(value)
        const param = {
            projectId: projectId,
            moduleName: value
        }
        selectTreeData(param);
    }


    // 点击筛选事件
    const handleNodeClick = (id, moduleName) => {
        let param;
        if (id){
            param = {
                overdue: false,
                builderId: null,
                workStatusIds: [],
                workTypeId: "",
                moduleIds: [id]
            }
        }else {
            param = {
                overdue: false,
                builderId: null,
                workStatusIds: [],
                workTypeId: "",
                moduleIds: []
            }
            setQuickFilterVisible(true)
            setWorkTypeVisible(true)
        }

        if (viewType === "tree"){
            getWorkConditionPageTree(param).then(res => {
                setModuleSelect(id)
                // setModuleTitle(moduleName)
                setTableTitle(moduleName)
                setQuickFilterValue("all")
                setTabValue({
                    id: "all",
                    type: "system",
                    value: null,
                    label: null
                })
            })
        }else if (viewType === "tile"){
            getWorkConditionPage(param).then(res => {
                setModuleSelect(id)
                // setModuleTitle(moduleName)
                setTableTitle(moduleName)
                setQuickFilterValue("all")
                setTabValue({
                    id: "all",
                    type: "system",
                    value: null,
                    label: null
                })
            })
        }


    }


    // 构建模块树节点
    const buildTreeNode = (data, parentPath) => {
        return (
            data && data.map(item => {
                const isExpand = expandedKeys.includes(item.id);
                // 拼接当前节点的完整路径（如果是顶级节点就直接用自己名称，否则用父路径+自己名称）
                const currentPath = parentPath ? `${parentPath}\\${item.moduleName}` : item.moduleName;
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
                                        handleNodeClick(item.id, currentPath)
                                    }}
                                >
                                    <div className="module-tree-node-title">
                                        {
                                            isExpand ?
                                                <FolderOpenOutlined style={{ fontSize: '15px' }} />
                                                :
                                                <FolderOutlined style={{ fontSize: '15px' }} />
                                        }
                                        <span style={{marginLeft: "8px"}}>{item.moduleName}</span>
                                    </div>
                                    {
                                        (!project?.productId &&(hoverNodeKey === item.id || moduleSelect === item.id)) &&
                                            <div className="module-tree-node-action">
                                                <div
                                                    onClick={() => handleAddNodeClick(item.id)}
                                                >
                                                    <PlusOutlined style={{ fontSize: '15px' }}/>
                                                </div>
                                                <WorkModuleFilterOperateSelectModal
                                                    moduleInfo={item}
                                                    moduleStore={ModuleStore}
                                                    projectId={projectId}
                                                    selectTreeData={selectTreeData}
                                                    handleNodeClick={handleNodeClick}
                                                />
                                                {/*<DeleteModal deleteFunction = {handleDeleteNodeClick} id = {item.id} />*/}
                                            </div>
                                    }

                                </div>
                        </>
                        }
                    >
                        {
                            item.children && buildTreeNode(item.children, currentPath)
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
                        <div className="work-module-filter-sider-top" style={{ paddingTop: "10px" }}>
                            <div className="work-module-filter-sider-title">
                                快速筛选
                            </div>
                            {
                                quickFilterList.map((item, index) => {
                                    return (
                                        <div className={`work-module-filter-sider-top-item ${quickFilterValue === item.value ? "work-module-filter-sider-top-item-active" : ""}`} onClick={() => getWorkStatusRangeWorkItem(item.value, item.label)}>
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref={`#icon-${item.icon}`}></use>
                                            </svg>
                                            <div className="work-module-filter-sider-top-item-title">
                                                <span>{item.label}</span>
                                                {/*<span style={{marginRight: "7px", color: "#999"}}>{index === 0 && workNum.pending || index === 1 && workNum.create}</span>*/}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            !path.includes("/product") &&
                            <div className="work-module-filter-sider-middle">
                                <div className="work-module-filter-sider-title">
                                    事项类型

                                    {
                                        workCustom.length > 0 && <div className={"show-more-icon"}>
                                            <svg className="icon-18" aria-hidden="true" onClick={() => setShowCustomWorkType(!showCustomWorkType)}>
                                                {
                                                    showCustomWorkType ?
                                                        <use xlinkHref="#icon-normal2"></use>
                                                        :
                                                        <use xlinkHref="#icon-normal3"></use>
                                                }
                                            </svg>
                                        </div>
                                    }
                                </div>
                                {workSystem?.map(item => (
                                    <div
                                        key={item.id}
                                        className={`worktype-option ${tabValue?.id === item.workType.id ? "selected" : ""}`}
                                        onClick={() => {
                                            selectType(item.workType);
                                            // setShowDropdown(false);
                                        }}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.workType.code}`}></use>
                                        </svg>
                                        {item.workType.name}
                                        {/*<span className="select-number">*/}
                                        {/*{setWorkNum(eveWorkTypeNum[item.workType.code])}*/}
                                        {/*</span>*/}
                                    </div>
                                ))}
                                {showCustomWorkType && workCustom?.map(item => (
                                    <div
                                        key={item.id}
                                        className={`worktype-option ${tabValue?.id === item.workType.id ? "selected" : ""}`}
                                        onClick={() => {
                                            selectCustomType(item.workType);
                                            // setShowDropdown(false);
                                        }}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-normal`}></use>
                                        </svg>
                                        {item.workType.name}
                                    </div>
                                ))}
                            </div>
                        }
                        <div className="work-module-filter-sider-bottom">
                            <div className="work-module-filter-sider-title">
                                模块筛选

                                <div style={{color: "var(--tiklab-black)"}}>
                                    <svg className="icon-18" aria-hidden="true" onClick={() => setModuleTreeVisible(!moduleTreeVisible)}>
                                        {
                                            moduleTreeVisible ?
                                                <use xlinkHref="#icon-show"></use>
                                                :
                                                <use xlinkHref="#icon-hidden"></use>
                                        }
                                    </svg>
                                </div>
                            </div>
                            {
                                moduleTreeVisible &&
                                <div className="content-module-head"
                                     onClick={(e) => {
                                         e.stopPropagation()
                                         handleNodeClick(null, null)
                                     }}
                                     onMouseEnter={() => setHoverTitle(true)}
                                     onMouseLeave={() => setHoverTitle(false)}
                                >
                                    <svg className="icon-18" aria-hidden="true">
                                        <use xlinkHref="#icon-module"></use>
                                    </svg>
                                    <div className="content-module-title">
                                        所有模块
                                    </div>

                                    <div style={{marginLeft: "auto",display: "flex", alignItems: "center"}}>
                                        {
                                            !project?.productId && hoverTitle && <div
                                                style={{
                                                    marginRight: "7px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={addRootModule}>
                                                <PlusOutlined style={{ fontSize: '14px' }} />
                                            </div>
                                        }
                                    </div>

                                </div>
                            }
                            {
                                moduleTreeVisible &&
                                <div className="content-module-tree">
                                    <Tree
                                        onExpand={handleExpand}
                                        switcherIcon={<DownOutlined style={{ fontSize: '14px' }} />}
                                        showLine={false}
                                    >
                                        {
                                            buildTreeNode(treeList)
                                        }
                                    </Tree>
                                </div>
                            }
                        </div>
                        <div className="work-module-filter-sider-bottom-icon">
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