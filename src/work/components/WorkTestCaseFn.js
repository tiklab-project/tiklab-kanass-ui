import WorkItemBindStore from "../../test/defectBind/defect/store/WorkItemBindStore";

const {deleteWorkItemBindByCondition, createWorkItemBind} = WorkItemBindStore

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