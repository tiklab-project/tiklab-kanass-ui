import LazyComponent from "../../common/Lazy";

const CaseContentCommon  = LazyComponent(() => import( "./CaseContentCommon"));
const DetailCommon  = LazyComponent(() => import( "../../common/caseCommon/DetailCommon"));
const CaseDesc  = LazyComponent(() => import( "../../common/caseCommon/CaseDesc"));
const IconCommon  = LazyComponent(() => import( "../../common/IconCommon"));
const {showCaseTypeView,showCaseTypeInList,showStatus}  = LazyComponent(() => import( "../../common/caseCommon/CaseCommonFn"));
const {CASE_TYPE,testExecuteStatus,assertCompare}  = LazyComponent(() => import( "../../common/dictionary/dictionary"));
const UIResultCommon  = LazyComponent(() => import( "./UIResultCommon"));
const ScriptEdit  = LazyComponent(() => import( "./ScriptEdit"));
const stepCommonStore  = LazyComponent(() => import( "./stepcommon/store/StepCommonStore"));
const IfJudgmentEdit  = LazyComponent(() => import( "./ifJudgment/components/IfJudgmentEdit"));
const IconBtn  = LazyComponent(() => import( "../../common/iconBtn/IconBtn"));
const {IfStep}  = LazyComponent(() => import( "./caseCommonFn"));
const {messageFn}  = LazyComponent(() => import( "../../common/messageCommon/MessageCommon"));
const CaseBread  = LazyComponent(() => import( "../../common/CaseBread"));
const ToggleCase  = LazyComponent(() => import( "../testcase/components/ToggleCase"));
const StepAssertCommon  = LazyComponent(() => import( "./stepassert/StepAssertCommon"));
const InstanceListCommon  = LazyComponent(() => import( "../../testreport/common/InstanceListCommon"));
const categoryStore  = LazyComponent(() => import( "../../category/store/CategoryStore"));

export {
    CaseContentCommon,
    DetailCommon,
    CaseDesc,
    IconCommon,
    showCaseTypeView,showCaseTypeInList,showStatus,
    CASE_TYPE,testExecuteStatus,assertCompare,
    UIResultCommon,
    messageFn,
    IconBtn,
    IfStep,
    IfJudgmentEdit,
    ScriptEdit,
    stepCommonStore,
    CaseBread,
    ToggleCase,
    StepAssertCommon,
    InstanceListCommon,
    categoryStore
}