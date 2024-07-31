import React, { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import "./inputSearch.scss";

const InputSearch = (props) => {
    const {onChange, placeholder,style} = props;
    const handleChange = (value) => {
        const data = value.target.value
        if(data && data.length > 0){
            onChange(data)
        }else {
            onChange(null)
        }
        
    }
    return (
        <div className="search-input" style={style}>
            <svg className="svg-icon" aria-hidden="true">
                <use xlinkHref="#icon-search"></use>
            </svg>
            <Input bordered={false} allowClear key={"search"} placeholder = {placeholder} onChange={(value) => handleChange(value)} />
        </div>
    )
}
export default InputSearch;