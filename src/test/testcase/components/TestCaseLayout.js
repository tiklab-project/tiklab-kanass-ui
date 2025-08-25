import {withRouter} from "react-router";
import CaseCategoryTree from "../../category/components/CaseCategoryTree";
import React, {useEffect, useRef, useState} from "react";
import {Col, Layout, Row} from "antd";
import {renderRoutes} from "react-router-config";
import {inject, observer, Provider} from "mobx-react";
import "./TestCaseLayout.scss"
import TestCaseTable from "./TestCaseTable";

const TestCaseLayout = (props) => {
    const {testcaseStore,categoryStore} = props;

    const store = {
        testcaseStore: testcaseStore,
        categoryStore: categoryStore
    }

    const {
        findTestCaseList,
        testcaseList,
        deleteTestCase,
        isCaseExist,
        currentPage,
        setCurrentPage,
        setTestType,
        testType,
        caseTypeList,
        setCaseTypeList,
        setDetailWidth
    } = testcaseStore;
    const {categoryIds, setCategoryIds, treeCollapsed} = categoryStore;
    const [creatorAndDirectorNum, setCreatorAndDirectorNum] = useState();
    const { route } = props;
    let projectId = props.match.params.id;

    // 模块筛选
    const changeCategory = (category) => {
        setCategoryIds(category?.moduleIds);
        // const targetPath = `/project/${projectId}/testcase/caseDetail/info`;
        // if (location.pathname !== targetPath) props.history.push(targetPath);
    };

    const path = props.match.path;

    useEffect(() => {
        console.log("path:  ", path)
    }, []);

    const testCaseTableWidthRef = useRef();
    // const [detailWidth, setDetailWidth] = useState();

    useEffect(() => {
        console.log("tableTreeCollapsed:   ", treeCollapsed)
        console.log("testCaseTableWidthRef.current.offsetWidth:   ", testCaseTableWidthRef.current.offsetWidth)
        if (testCaseTableWidthRef.current){
            setDetailWidth(testCaseTableWidthRef.current.offsetWidth);
        }
    }, [treeCollapsed]);

    return (
        <Provider {...store}>
            <div style={{display: "flex", height:"100%", flex:"1 1 0%"}}>
                <CaseCategoryTree
                    creatorAndDirectorNum={creatorAndDirectorNum}
                    onNodeClick={changeCategory}
                    setTestType={setTestType}
                    testType={testType}
                    caseTypeList={caseTypeList}
                    setCaseTypeList={setCaseTypeList}
                    add={true}
                />
                <div style={{display: "flex", height:"100%", flex:"1 1 0%"}} ref={testCaseTableWidthRef}>
                    <Layout {...props} className={"testCase-content"}>
                        {renderRoutes(route.routes)}
                    </Layout>
                    {/*<TestCaseTable/>*/}
                </div>
            </div>
        </Provider>
    );
};

export default withRouter(inject("testcaseStore", "categoryStore")(observer(TestCaseLayout)));