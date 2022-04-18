/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-16 10:00:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-08 14:20:43
 */
import React,{ useState, useEffect } from "react";
import { Select } from "antd";
import { observer, inject } from "mobx-react";

const SelfSelect = (props) => {
    const { onChange,value,selectItemList,type} = props;
    
    const [radioValue,setSelectValue] = useState()
    const onChangeSelect = (values) => {
        setSelectValue(values)
        onChange(values)
    }

    const [fieldName, setFieldName] = useState(type)
    const changeStyle = (value) => {
        setFieldName(value)
    }
    return (
        <Select 
            onChange={onChangeSelect} 
            value={ value || radioValue}
            // bordered={false}
            bordered={fieldName === type ? false : true}
            showArrow={fieldName === type ? false : true}
            onFocus={() => changeStyle("edit")}
            onBlur={() => setFieldName(type)}
        >
        {
            
            selectItemList && selectItemList.map((item,index)=> {
                return (<Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
            })
        }
        </Select>
    )
    
}

export default SelfSelect;
