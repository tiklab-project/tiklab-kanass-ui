import React from "react";
import TestCaseTabs from "./TestCaseTabs";
import {Provider} from "mobx-react";

import TestCaseStore from "../store/testcaseStore";
import CategoryStore from "../../category/store/CategoryStore";
import FuncUnitStore from "../../function/store/funcUnitStore";
import "../../common/styles/base.scss"
import TestCaseMenu from "./TestCaseMenu";
const TestCaseTableMain = (props) => {
    let stores = {
        testcaseStore:TestCaseStore,
        categoryStore:CategoryStore,
        funcUnitStore:FuncUnitStore
    }
    return (
        <Provider {...stores}>
            <TestCaseMenu {...props} />
        </Provider>

    );
};

export default TestCaseTableMain;