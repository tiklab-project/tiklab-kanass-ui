import {applyJump} from "tiklab-core-ui";
import WorkTestStore from "../../../../work/store/WorkTestStore";

const {createWorkTestCase, deleteWorkTestCaseRele} = WorkTestStore
/**
 * 跳转到Kanass
 * @param record
 */
export const toWorkItem = (record)=>{
    try{
        if(IS_DEV){
            applyJump(`http://192.168.10.5:3100/#/project/${record.workItem?.project?.id}/work/${record.workItem.id}`,'_blank')
        }else {
            applyJump(`${record.projectUrl}/#/project/${record.workItem?.project?.id}/work/${record.workItem.id}`,'_blank')
        }
    }catch {
        applyJump(`${record.projectUrl}/#/project/${record.workItem?.project?.id}/work/${record.workItem.id}`,'_blank')
    }
}

export const createWorkItemTest = (testCaseId, workItemId) => {

}