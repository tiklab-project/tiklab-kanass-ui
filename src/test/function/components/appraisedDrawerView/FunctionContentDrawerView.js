import {inject, observer, Provider} from "mobx-react";
import {Drawer} from "antd";
import PageCenter from "../../../../common/caseCommon/PageCenter";
import FunctionDetail from "../FunctionDetail";
import React, {useEffect, useRef} from "react";
import EditableTitle from "../../../../common/caseCommon/EditableTitle";
import FuncUnitStore from "../../store/funcUnitStore";
import TestcaseStore from "../../../testcase/store/testcaseStore";
import {CASE_TYPE} from "../../../../common/dictionary/dictionary";
import "./FunctionContentDrawerView.scss"
import CategoryStore from "../../../category/store/CategoryStore";

const FunctionContentDrawerView = (props) => {
    const {isModalVisible, setIsModalVisible, caseId, inTestCase, detailWidth} = props;
    const {deleteTestCase} = TestcaseStore
    const {testCaseInfo,funcUnitInfo,updateFuncUnit,findFuncUnit} = FuncUnitStore
    const functionId = caseId;
    const projectId = localStorage.getItem("projectId")

    const store = {
        testcaseStore: TestcaseStore,
        funcUnitStore: FuncUnitStore,
        categoryStore: CategoryStore
    }

    /**
     * 监听鼠标事件，关闭事项详情抽屉
     */
    useEffect(() => {
        console.log("出发了  父组件effect")
        const handleClickOutside = (event) => {
            const isChildDrawer = event.target.closest('.detail-drawer'); // 子抽屉的选择器
            if (detailRef.current && !detailRef.current.contains(event.target) && !isChildDrawer) {
                closeDrawer();
            }
        };

        document.addEventListener("mouseup", handleClickOutside, false);
        return () => {
            document.removeEventListener("mouseup", handleClickOutside, false);
        }

    }, [isModalVisible])

    /**
     * 手动关闭事项详情抽屉
     */
    const closeDrawer = () => {
        if (!inTestCase){
            let pathname = props.location.pathname;
            const index = pathname.lastIndexOf("\/");
            pathname = pathname.substring(0, index);
            props.history.replace(`${pathname}`)
        }
        setIsModalVisible(false);
    };
    // 处理标题保存
    const handleTitleSave = async (newTitle) => {
        const params = {
            id:funcUnitInfo.id,
            testCase: {
                ...funcUnitInfo.testCase,
                name:newTitle,
            }
        }
        updateFuncUnit(params).then(()=>{
            findFuncUnit(functionId)
        })
    };
    const deleteFn = async () => {
        await deleteTestCase(funcUnitInfo.id,CASE_TYPE.FUNCTION)
        window.dispatchEvent(new CustomEvent('testcase-close-tab', { detail: { tabKey: functionId } }));
    }

    const detailRef = useRef();

    return (
        <Provider {...store}>
            <Drawer
                placement="right"
                onClose={closeDrawer}
                visible={isModalVisible}
                className={`${isModalVisible ? "function-drawer-view" : ''} `}
                closable={false}
                destroyOnClose={true}
                width={detailWidth ? detailWidth : ""}
                mask={!inTestCase}
                style={{
                    transform: 'translateX(0)',//子抽屉打开后父抽屉不被推动
                    // position: 'absolute',
                    // height: 'calc(100% - 55px)', // 限制高度为父容器高度
                    // top: "55px", // 从顶部开始
                    // right: 0, // 从右侧开始
                }}
                bodyStyle={{
                    padding: "0",
                    height: '100%',
                }}
            >
                <div style={{padding: "0px"}} ref={detailRef}>
                    <div className={"testcase-detail-top"}>
                        <div className="testcase-detail-top-item" onClick={() => closeDrawer()}>
                            <svg className="svg-icon testcase-detail-top-icon" aria-hidden="true">
                                <use xlinkHref="#icon-pageLeft"></use>
                            </svg>
                        </div>

                        <div className="testcase-detail-top-item" onClick={() => closeDrawer()}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-close"></use>
                            </svg>
                        </div>
                    </div>
                    <PageCenter>
                        <EditableTitle
                            value={testCaseInfo?.name}
                            onSave={handleTitleSave}
                            level={5}
                            placeholder="请输入用例名称"
                        />
                        <FunctionDetail functionId={functionId} deleteFn={deleteFn}/>
                    </PageCenter>
                </div>
            </Drawer>
        </Provider>
    )
}

export default observer(FunctionContentDrawerView);