import { CASE_TYPE} from "../../common/dictionary/dictionary";

/**
 * 跳转到用例详情
 * @param {*} record
 */
export const toDiffCaseFn = (record, history) => {
    const projectId = localStorage.getItem('projectId');
    switch (record.caseType) {
        case CASE_TYPE.FUNCTION:
            history.push({
                pathname: `/project/${projectId}/testcase/caseDetail/function/${record.id}`,
                state: { caseName: record.name }
            });
            sessionStorage.setItem('functionId',record.id);
            break
        default :
            break
    }
}

