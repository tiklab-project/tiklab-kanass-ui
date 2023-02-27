import React, { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import "./inputSearch.scss";

const InputSearch = (props) => {
    const {onChange, placeholder} = props;
    const handleChange = (value) => {
        onChange(value.target.value)
    }
    return (
        <div className="search-input">
            <svg className="svg-icon" aria-hidden="true">
                <use xlinkHref="#icon-search"></use>
            </svg>
            <Input bordered={false} allowClear key={"search"} placeholder = {placeholder} onChange={(value) => handleChange(value)} />
        </div>
    )
}
export default InputSearch;