import React from "react";
import {Select} from "antd";
import IconCommon from "./IconCommon";
import {showCaseTypeInList} from "./CaseCommonFn";
import "./caseHeaderStyle.scss";

const {Option} = Select;

const priorityMap = [
    { label: "低", icon: "icon_level1", className: "case-priority-0" },
    { label: "中", icon: "icon_level2", className: "case-priority-1" },
    { label: "高", icon: "icon_level3", className: "case-priority-2" },
];

/**
 * 用例头部信息组件 - 通用组件
 * 包含用例类型、状态、优先级，可在所有用例中使用
 */
const CaseHeaderInfo = (props) => {
    const {
        caseInfo,
        onStatusChange,
        onPriorityChange,
        moreInfo,
        style = {}
    } = props;

    return (
        <div className="case-header-info" style={style}>
            <div className="case-header-item">
                <span style={{marginRight: '10px'}}>{showCaseTypeInList(caseInfo?.caseType)}</span>
            </div>
            <div className="case-header-item">
                <Select 
                    value={caseInfo?.status} 
                    onChange={onStatusChange}
                    className="case-header-select"
                    size="small"
                    suffixIcon={null}
                    bordered={false}
                    dropdownStyle={{minWidth: 0}}
                >
                    <Option value={0}>
                        <div className={"display-flex-gap"}>
                            <div className="case-status-0">未开始</div>
                        </div>
                    </Option>
                    <Option value={1}>
                        <div className={"display-flex-gap"}>
                            <div className="case-status-1">进行中</div>
                        </div>
                    </Option>
                    <Option value={2}>
                        <div className={"display-flex-gap"}>
                            <div className="case-status-2">已完成</div>
                        </div>
                    </Option>
                </Select>
            </div>
            <div className="case-header-item">
                <Select 
                    value={caseInfo?.priorityLevel} 
                    onChange={onPriorityChange}
                    className="case-header-select"
                    size="small"
                    suffixIcon={null}
                    bordered={false}
                    dropdownStyle={{minWidth: 0}}
                    dropdownMatchSelectWidth={false}
                >
                    {priorityMap.map((item, idx) => (
                        <Option value={idx} key={idx}>
                            <div className={item.className}>
                                <IconCommon
                                    className={"icon-s"}
                                    icon={item.icon}
                                    style={{cursor: "pointer"}}
                                />
                                <div>{item.label}</div>
                            </div>
                        </Option>
                    ))}
                </Select>
            </div>
            {moreInfo && (
                <div className="case-header-item">
                    {moreInfo}
                </div>
            )}
        </div>
    );
};

export default CaseHeaderInfo; 