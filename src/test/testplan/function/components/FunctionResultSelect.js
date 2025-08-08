import React from "react";
import {Select} from "antd";

/**
 * 用于功能测试结果选择框
 * @param setResult
 * @param record
 * @returns {Element}
 * @constructor
 */
export const FunctionResultSelect = ({selectChange, record,placeholder,isFliter}) =>{

    const functionalTestResult =[
        {
            label:"失败",
            value: 0
        }, {
            label:"成功",
            value: 1
        },
        // {
        //     label:"待核查",
        //     value:"2"
        // },{
        //     label:"不可用",
        //     value:"3"
        // },{
        //     label:"阻塞",
        //     value:"4"
        // },
    ]


    return(
        <Select
            style={{ width: "120px" }}
            onChange={(value) => selectChange(value,record)}
            placeholder={placeholder?placeholder:"未设置"}
            defaultValue={record?.result}
            className={"filter-select-box-item"}
        >
            {
                isFliter&&<Select.Option
                    key={"all"}
                    value={null}
                >
                    <span>所有</span>
                </Select.Option>
            }
            {functionalTestResult.map(item => (
                <Select.Option
                    key={item.value}
                    value={item.value}
                >
                            <span style={{ color: item.label === '成功' ? 'green' : 'red' }}>
                                {item.label}
                            </span>
                </Select.Option>
            ))}
        </Select>
    )
}