import React, { useEffect, useState } from "react";
import {Tree, Button, Space, message, Spin} from "antd";
import {
    CalendarOutlined,
    DownOutlined,
    FolderOpenOutlined,
    FolderOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import { inject, observer } from "mobx-react";
import "./categoryTreeStyle.scss"
import {useHistory} from "react-router";
import {showCaseTypeView} from "../../../common/caseCommon/CaseCommonFn";
import { toDiffCaseFn } from "../../common/caseCommonFn";
import {CASE_TYPE} from "../../../common/dictionary/dictionary"
import { getUser } from 'tiklab-core-ui'
import {findTestCaseStatusCountFn, findTestCaseTableListFn} from "../../testcase/components/testCaseTableFn";

const transformData = (
    data = [],
    hoverKey,
    setHoverKey,
    findList,
    add,
    expandedKeys,
    deleteCategoryFn,
    history, // 新增参数
    setSelectedKeys // 新增参数
) => {
    if (!Array.isArray(data)) return [];

    // 递归处理每个节点
    const processNodes = (nodes) =>
        nodes.flatMap((item) => {
            // 目录节点
            const dirNode = {
                key: item.id,
                title: (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            height: "24px",
                        }}
                        onMouseEnter={() => setHoverKey(item.id)}
                        onMouseLeave={() => setHoverKey(null)}
                        className="category-tree-item"
                    >
                        <Space
                            style={{
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {expandedKeys.includes(item.id) ? (
                                <FolderOpenOutlined  />
                            ) : (
                                <FolderOutlined />
                            )}
                            <span
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {item.moduleName}
                            </span>
                        </Space>
                        {/*{*/}
                        {/*    add && hoverKey === item.id && (*/}
                        {/*        <span onClick={(e) => e.stopPropagation()}>*/}
                        {/*            <CategoryEdit*/}
                        {/*                type={"add"}*/}
                        {/*                icon={true}*/}
                        {/*                findList={findList}*/}
                        {/*                categoryId={item.id}*/}
                        {/*            />*/}
                        {/*            <HideDelete deleteFn={()=>deleteCategoryFn(item.id)}/>*/}
                        {/*        </span>)*/}
                        {/*}*/}
                    </div>
                ),
                children: undefined,
                data: item
            };
            // 递归children
            if (item.children && item.children.length) {
                dirNode.children = processNodes(item.children);
            }
            // 处理nodeList为叶子节点
            let nodeListNodes = [];
            if (Array.isArray(item.nodeList) && item.nodeList.length > 0) {
                nodeListNodes = item.nodeList.map(node => ({
                    key: node.id,
                    title: (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                height: "36px",
                                gap: "8px"
                            }}
                            className="category-tree-leaf-item"
                            onClick={e => {
                                e.stopPropagation();
                                setSelectedKeys && setSelectedKeys([node.id]); // 新增
                                toDiffCaseFn(node, history);
                            }}
                        >
                            <div style={{ flexShrink: 0, marginTop: '5px' }}>{showCaseTypeView(node.caseType, "icon-s")}</div>
                            <span
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "120px",
                                    display: "inline-block",
                                    verticalAlign: "middle"
                                }}
                            >
                                {node.name}
                            </span>
                        </div>
                    ),
                    isLeaf: true,
                    data: node
                }));
            }
            // 目录节点在上，nodeList节点在下
            if (nodeListNodes.length > 0) {
                if (!dirNode.children) dirNode.children = [];
                dirNode.children = [...(dirNode.children || []), ...nodeListNodes];
            }
            return [dirNode];
        });

    return processNodes(data);
};

const CaseCategoryTree = ({
    onNodeClick,
    // allCaseNum,
    categoryStore,
    add,
    testcaseStore,
    }) => {


    const {
        findCategoryListTree,
        deleteCategory,
        categoryList,
        isCategoryHasCases,
        setTableTitle,
        setTreeCollapsed
    } = categoryStore;

    const {setSearchCondition, searchCondition} = testcaseStore

    let projectId = localStorage.getItem("projectId");

    const [expandedKeys, setExpandedKeys] = useState(["null"]);
    const [hoverKey, setHoverKey] = useState(null);
    const [collapsed, setCollapsed] = useState(() => {
        const stored = localStorage.getItem('CATEGORY_TREE_COLLAPSED');
        return stored === null ? false : stored === 'true';
    });
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectedSearchKey, setSelectedSearchKey] = useState(null);
    const history = useHistory()
    const [loading, setLoading] = useState(false);
    const [moduleTreeVisible, setModuleTreeVisible] = useState(false);
    const [quickFilterValue, setQuickFilterValue] = useState("all");
    const userId = getUser().userId;

    useEffect(() => {
        findList(projectId);
    }, [projectId]);

    const quickFilterList = [
        {
            value: "all",
            label: "所有用例",
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
        }
    ]

    const getQuickFilterRangeTestCase = (value,label) => {
        setQuickFilterValue(value)
        setTableTitle(label)
        // setModuleTitle(null)

        console.log("筛选条件++++++" + JSON.stringify(value))
        if (!value) {
            getAllTestCase();
            return
        } else {
            let data = value;
            switch (data) {
                case "all":
                    getAllTestCase();
                    break;
                case "pending":
                    getPendingTestCase();
                    break;
                case "creat":
                    getCreatTestCase();
                    break;
                case "assigner":
                    getAssignerTestCase();
                    break;
                default:
                    break;
            }
        }
    }

    const getAllTestCase = () => {
        const initValues = {
            projectId: projectId,
            name: null,
            createUser: null,
            director: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            moduleIds: [],
            status: null,
        }
        setSearchCondition(initValues)
        setTableTitle("所有用例")
        const res = findTestCaseTableListFn(initValues)
        const countRes = findTestCaseStatusCountFn(initValues)
    }

    const getPendingTestCase = () => {
        const initValues = {
            projectId: projectId,
            name: null,
            createUser: null,
            director: userId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            moduleIds: [],
            status: 0,
        }
        setSearchCondition(initValues)
        setTableTitle("我的待办")
        const res = findTestCaseTableListFn(initValues)
        const countRes = findTestCaseStatusCountFn(initValues)
    }

    const getCreatTestCase = () => {
        const initValues = {
            projectId: projectId,
            name: null,
            createUser: userId,
            director: null,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            moduleIds: [],
            status: null,
        }
        setSearchCondition(initValues)
        setTableTitle("我创建的")
        const res = findTestCaseTableListFn(initValues)
        const countRes = findTestCaseStatusCountFn(initValues)
    }

    const getAssignerTestCase = () => {
        const initValues = {
            projectId: projectId,
            name: null,
            createUser: null,
            director: userId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            },
            moduleIds: [],
            status: null,
        }
        setSearchCondition(initValues)
        setTableTitle("我负责的")
        const res = findTestCaseTableListFn(initValues)
        const countRes = findTestCaseStatusCountFn(initValues)
    }

    const findList = async (projectId,name) => {
        setLoading(true);
        const params = {
            projectId: projectId,
            name:name,
            caseType: CASE_TYPE.FUNCTION
        };
        await findCategoryListTree(params);
        setLoading(false);
    };

    const deleteCategoryFn = async (id) => {
        let res = await isCategoryHasCases(id)
        if (res.code===0) {
            if(res.data){
                message.error("该模块下有用例，请先删除用例")
            }else {
                await deleteCategory(id);
                await findList(projectId);
            }
        }
    };

    const handleSelect = (selectedKeys, info) => {
        if (info.node) {
            setTableTitle(info.node.data.moduleName)
            onNodeClick(info.node.data, info.node.key);
            setSelectedKeys(selectedKeys);
            setSelectedSearchKey(null); // 清除搜索选项的选中状态
            if (!expandedKeys.includes(info.node.key)) {
                setExpandedKeys([...expandedKeys, info.node.key]);
            }
        }
    };


    const handleModuleClick = () => {
        setSelectedSearchKey(null); // 清除搜索选项的选中状态
        setSelectedKeys([]); // 清除树节点的选中状态
        onNodeClick(null, null); // 调用父组件的回调，传递null表示没有选中任何节点
        setTableTitle("所有用例")
    };

    const toggleCollapse = () => {
        setCollapsed(prev => {
            localStorage.setItem('CATEGORY_TREE_COLLAPSED', !prev);
            return !prev;
        });
        setTreeCollapsed();
    };

    const treeData = transformData(
        categoryList,
        // allCaseNum,
        hoverKey,
        setHoverKey,
        findList,
        add,
        expandedKeys,
        deleteCategoryFn,
        history, // 新增
        setSelectedKeys // 新增
    );

    return (
        <div className="sidebar-container" >
            <div
                style={{
                    display: "flex",
                    height: "100%",
                    transition: "width 0.3s ease",
                    width: collapsed ? 0 : "auto",
                    position: "relative",
                }}
            >
                {/* 折叠状态下的展开按钮 */}
                {collapsed && (
                    <Button
                        type="text"
                        onClick={toggleCollapse}
                        icon={<MenuUnfoldOutlined />}
                        className="expand-button-floating"
                        style={{
                            position: 'absolute',
                            left: 8,
                            bottom: 12,
                            top: 'auto',
                            transform: 'none',
                            zIndex: 10,
                            background: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    />
                )}

                {/* 目录树内容 */}
                {!collapsed && (
                    <div
                        className="case-category-tree-box"
                    >

                        <div className={"case-category-filter-sider-top"}>
                            <div className="case-category-filter-sider-title">
                                快速筛选
                            </div>
                            {
                                quickFilterList.map((item, index) => {
                                    return (
                                        <div className={`case-category-filter-sider-top-item ${quickFilterValue === item.value ? "case-category-filter-sider-top-item-active" : ""}`}
                                             onClick={() => getQuickFilterRangeTestCase(item.value, item.label)}>
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref={`#icon-${item.icon}`}></use>
                                            </svg>
                                            <div className="case-category-filter-sider-top-item-title">
                                                <span>{item.label}</span>
                                                {/*<span style={{marginRight: "7px", color: "#999"}}>{index === 0 && workNum.pending || index === 1 && workNum.create}</span>*/}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className={"case-category-filter-sider-bottom"}>
                            <div className="case-category-filter-sider-title">
                                模块筛选

                                <div className={"show-more-icon"}>
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
                        </div>
                        {
                            moduleTreeVisible && (
                                <>
                                    <div
                                        className={`module-header ${selectedSearchKey === null && selectedKeys.length === 0 ? "ant-tree-node-selected" : ""}`}
                                        onClick={handleModuleClick}
                                    >
                                        <div className="module-header-title">
                                            <Space>
                                                <UnorderedListOutlined style={{fontSize: "18px"}}/>
                                                <span>目录</span>
                                            </Space>
                                        </div>

                                    </div>

                                    <Spin spinning={loading}>
                                        <div className={"case-category-tree"}>
                                            <Tree
                                                treeData={treeData}
                                                expandedKeys={expandedKeys}
                                                onExpand={setExpandedKeys}
                                                blockNode
                                                onSelect={handleSelect}
                                                rootClassName="case-category-tree"
                                                switcherIcon={<DownOutlined/>}
                                                selectedKeys={selectedKeys}
                                            />
                                        </div>
                                    </Spin>
                                </>
                            )
                        }

                        <div className={"collapse-bottom-box"} style={{display:"flex",justifyContent:"flex-end", marginTop: "auto"}}>
                            <Button
                                type="text"
                                onClick={toggleCollapse}
                                icon={<MenuFoldOutlined/>}
                                className={"collapse-bottom-btn"}
                            >
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default inject("categoryStore","testcaseStore")(observer(CaseCategoryTree));
