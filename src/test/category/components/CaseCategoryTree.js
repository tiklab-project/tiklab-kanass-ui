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
    }) => {


    const {
        findCategoryListTree,
        deleteCategory,
        categoryList,
        isCategoryHasCases

    } = categoryStore;

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

    useEffect(() => {
        findList(projectId);
    }, [projectId]);

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
    };

    const toggleCollapse = () => {
        setCollapsed(prev => {
            localStorage.setItem('CATEGORY_TREE_COLLAPSED', !prev);
            return !prev;
        });
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
                    width: collapsed ? 0 : 240,
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

                        <div className={"display-flex-between"} style={{padding: "10px 10px 0 16px"}}>
                            <div style={{fontSize: "16px", fontWeight: "600"}}>测试用例</div>
                        </div>

                        <div className={"category-param-search"}>
                            {/*<MenuSelect*/}
                            {/*    menuItems={items}*/}
                            {/*    selectFn={selectKeyFun}*/}
                            {/*    selected={testType}*/}
                            {/*    style={{width: `100%`}}*/}
                            {/*/>*/}
                        </div>

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

                        <div className={"collapse-bottom-box"} style={{display:"flex",justifyContent:"space-between"}}>
                            <div
                                onClick={() => {
                                    history.push(`/project/${projectId}/testplan`)
                                }}
                                style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap:10
                                }}
                            >
                                <CalendarOutlined />
                                测试计划
                            </div>
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
export default inject("categoryStore")(observer(CaseCategoryTree));
