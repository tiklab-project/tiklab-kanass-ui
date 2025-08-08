import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { renderRoutes } from "react-router-config";
import { useLocation, useHistory } from "react-router";
import { inject, observer } from "mobx-react";
import CaseCategoryTree from "../../category/components/CaseCategoryTree";
import "./TestCaseTabs.scss";
import { CASE_TYPE, caseTypeToRouter } from "../../../common/dictionary/dictionary";
import { showCaseTypeView } from "../../../common/caseCommon/CaseCommonFn";
import {toDiffCaseFn} from "../../common/caseCommonFn";

const { TabPane } = Tabs;

// tab生成工具函数
const buildTab = ({ key, label, path, closable = true, caseType, caseId, caseName = "", iconType }) => ({
    key,
    label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '120px', overflow: 'hidden' }}>
            {iconType && <div style={{ flexShrink: 0, marginTop: '5px' }}>{showCaseTypeView(iconType, "icon-s")}</div>}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{label}</span>
        </span>
    ),
    path,
    closable,
    caseName,
    caseType,
    caseId
});

// tab类型映射
const tabTypeMap = {
    [caseTypeToRouter[CASE_TYPE.FUNCTION]]: { icon: CASE_TYPE.FUNCTION, label: '功能用例' },
    [caseTypeToRouter[CASE_TYPE.API_UNIT]]: { icon: CASE_TYPE.API_UNIT, label: '接口单元' },
    [caseTypeToRouter[CASE_TYPE.API_SCENE]]: { icon: CASE_TYPE.API_SCENE, label: '接口场景' },
    [caseTypeToRouter[CASE_TYPE.API_PERFORM]]: { icon: CASE_TYPE.API_PERFORM, label: '接口性能' },
    [caseTypeToRouter[CASE_TYPE.WEB_SCENE]]: { icon: CASE_TYPE.WEB_SCENE, label: 'Web场景' },
    [caseTypeToRouter[CASE_TYPE.APP_SCENE]]: { icon: CASE_TYPE.APP_SCENE, label: 'App场景' },
};

// 默认tab
const getDefaultTabs = () => [
    buildTab({
        key: "cases",
        label: "用例列表",
        path: `/project/${localStorage.getItem("projectId")}/testcase/cases`,
        closable: false,
        iconType: null
    })
];

// sessionStorage操作
const saveTabsToSession = (tabs) => {
    const tabsToStore = tabs.map(tab => ({
        key: tab.key,
        path: tab.path,
        closable: tab.closable,
        caseName: tab.caseName || '',
        label: typeof tab.label === 'string' ? tab.label : '',
        caseType: tab.caseType,
        caseId: tab.caseId
    }));
    sessionStorage.setItem('testcaseTabs', JSON.stringify(tabsToStore));
};

const getInitTabs = () => {
    const projectId = localStorage.getItem("projectId");
    const lastRepositoryId = sessionStorage.getItem("lastRepositoryId");
    const tabsStr = sessionStorage.getItem('testcaseTabs');
    if (!tabsStr || projectId !== lastRepositoryId) {
        sessionStorage.setItem("lastRepositoryId", projectId);
        return getDefaultTabs();
    }
    try {
        const tabsArr = JSON.parse(tabsStr);
        return tabsArr.map(tab => {
            if (tab.key === 'cases') return getDefaultTabs()[0];
            const pathParts = tab.path.split("/");
            const caseId = pathParts[pathParts.length - 1];
            const caseTypeRouter = pathParts[pathParts.length - 2];
            const typeInfo = tabTypeMap[caseTypeRouter];
            return buildTab({
                key: tab.key,
                label: tab.caseName || (typeInfo ? typeInfo.label : ''),
                path: tab.path,
                closable: tab.closable,
                caseType: typeInfo ? typeInfo.icon : '',
                caseId,
                caseName: tab.caseName,
                iconType: typeInfo ? typeInfo.icon : ''
            });
        });
    } catch {
        return getDefaultTabs();
    }
};

const TestCaseTabs = (props) => {
    const { testcaseStore, categoryStore } = props;
    const { findCreateUserAndDirectorNum ,setTestType,testType,caseTypeList,setCaseTypeList} = testcaseStore;
    const { setCategoryIds } = categoryStore;
    
    const location = useLocation();
    const history = useHistory();
    
    const [tabs, setTabs] = useState(getInitTabs());
    const [activeKey, setActiveKey] = useState(tabs[0].key);
    const [creatorAndDirectorNum, setCreatorAndDirectorNum] = useState();
    const projectId = localStorage.getItem("projectId");

    // 获取创建者和负责人数量
    // useEffect(async () => {
    //     let createUserAndDirectorNumInfo = await findCreateUserAndDirectorNum(projectId);
    //     setCreatorAndDirectorNum(createUserAndDirectorNumInfo);
    // }, []);

    // 路由变化，tab同步
    useEffect(() => {
        const currentPath = location.pathname;
        const currentTab = tabs.find(tab => tab.path === currentPath);
        if (currentTab) {
            setActiveKey(currentTab.key);
        } else if (!currentPath.includes("/testcase/cases")) {
            addTabFromPath(currentPath, location.state && location.state.caseName);
        }
    }, [location.pathname]);

    // repositoryId变化，重置tab
    useEffect(() => {
        const projectId = localStorage.getItem("projectId");
        const lastRepositoryId = sessionStorage.getItem("lastRepositoryId");
        if (projectId !== lastRepositoryId) {
            setTabs(getDefaultTabs());
            setActiveKey("cases");
            sessionStorage.setItem("lastRepositoryId", projectId);
        }
    }, [projectId]);

    // tabs变化，写入sessionStorage
    useEffect(() => {
        saveTabsToSession(tabs);
    }, [tabs]);

    // 在组件内添加window事件监听
    useEffect(() => {
      const handler = (e) => {
        if (e.detail && e.detail.tabKey) {
          removeTab(e.detail.tabKey, true); // true表示强制切换到cases
        }
      };
      window.addEventListener('testcase-close-tab', handler);
      return () => window.removeEventListener('testcase-close-tab', handler);
    }, [tabs, activeKey]);

    // 从路径添加新标签页
    const addTabFromPath = (path, caseName) => {
        const pathParts = path.split("/");
        const caseId = pathParts[pathParts.length - 1];
        const caseTypeRouter = pathParts[pathParts.length - 2];
        const typeInfo = tabTypeMap[caseTypeRouter];
        if (!typeInfo) return;
        const key = `${caseId}`;
        if (tabs.find(tab => tab.key === key)) {
            setActiveKey(key);
            return;
        }
        if (tabs.length >= 5) {
            const nonCasesTabs = tabs.filter(tab => tab.key !== "cases");
            if (nonCasesTabs.length > 0) removeTab(nonCasesTabs[nonCasesTabs.length - 1].key);
        }
        const newTab = buildTab({
            key,
            label: caseName || typeInfo.label,
            path,
            closable: true,
            caseType: typeInfo.icon,
            caseId,
            caseName: caseName || '',
            iconType: typeInfo.icon
        });
        setTabs(prev => [...prev, newTab]);
        setActiveKey(key);
    };

    // 切换标签页
    const handleTabChange = (key) => {
        const targetTab = tabs.find(tab => tab.key === key);
        if (!targetTab) return;
        setActiveKey(key);
        if (targetTab.key === 'cases') {
            history.push(targetTab.path);
        } else {
            toDiffCaseFn({ caseType: targetTab.caseType, id: targetTab.caseId }, history);
        }
    };

    // 修改removeTab，支持forceToCases
    const removeTab = (targetKey, forceToCases = false) => {
      const newTabs = tabs.filter(tab => tab.key !== targetKey);
      if (forceToCases) {
        setActiveKey('cases');
        const casesTab = newTabs.find(tab => tab.key === 'cases');
        if (casesTab) history.push(casesTab.path);
      } else if (newTabs.length && targetKey === activeKey) {
        const { key, path } = newTabs[newTabs.length - 1];
        setActiveKey(key);
        history.push(path);
      }
      setTabs(newTabs);
      saveTabsToSession(newTabs);
    };

    // 标签页编辑（关闭）
    const onEdit = (targetKey, action) => {
        if (action === "remove") removeTab(targetKey);
    };

    // 模块筛选
    const changeCategory = (category) => {
        setCategoryIds(category?.moduleIds);
        const targetPath = `/project/${projectId}/testcase/cases`;
        if (location.pathname !== targetPath) history.push(targetPath);
    };

    return (
        <div className="testcase-tabs-container testcase-tabs-wrapper">
            <div className="left-panel">
                <CaseCategoryTree
                    creatorAndDirectorNum={creatorAndDirectorNum}
                    onNodeClick={changeCategory}
                    setTestType={setTestType}
                    testType={testType}
                    caseTypeList={caseTypeList}
                    setCaseTypeList={setCaseTypeList}
                    add={true}
                />
            </div>
            <div className="right-panel">
                <Tabs
                    className="testcase-specific-tabs"
                    hideAdd
                    onChange={handleTabChange}
                    activeKey={activeKey}
                    type="editable-card"
                    onEdit={onEdit}
                    tabBarGutter={2}
                    tabPosition="top"
                    overflow="dropdown"
                >
                    {tabs.map(tab => (
                        <TabPane
                            tab={tab.label}
                            key={tab.key}
                            closable={tab.closable}
                        >
                            {renderRoutes(props.route.routes)}
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        </div>
    );
};

export default inject("testcaseStore", "categoryStore")(observer(TestCaseTabs)); 





