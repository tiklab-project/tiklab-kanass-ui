import WorkItemBindStore from "../../test/defectBind/defect/store/WorkItemBindStore";
import testcaseStore from "../../test/testcase/store/testcaseStore";

const {deleteWorkItemBindByCondition, createWorkItemBind} = WorkItemBindStore
const {findTestCase, updateTestCase} = testcaseStore

export const createWorkItemBindFn = (testCaseId, workItemId, projectId) => {
    const param = {
        testCase: {id: testCaseId},
        workItem: {id: workItemId},
        projectId: projectId
    }
    createWorkItemBind(param)
}

export const deleteWorkItemBindByConditionFn = (testCaseId, workItemId) => {
    const param = {
        caseId: testCaseId,
        workItemId: workItemId,
    }
    deleteWorkItemBindByCondition(param)
}

export const deleteTestCaseDemandByConditionFn = async (testCaseId, workItemId) => {
    const testCase = await findTestCase(testCaseId);
    if (testCase){
        const param = {
            ...testCase,
            demand:{id: "nullstring"}
        }
        updateTestCase(param)
    }

    // deleteWorkItemBindByCondition(param)
}