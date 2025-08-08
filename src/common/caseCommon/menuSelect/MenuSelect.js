import React from "react";
import { Select } from "antd";
import "./menuSelectSytle.scss"

const MenuSelect = (props) =>{
    const {selected,selectFn,style,menuItems, type} = props;

    // 渲染下拉框
    if(type === "select" || type === true){
        return (
            <div className={"filter-case-select"}>
                <Select
                    style={style}
                    value={selected}
                    onChange={value => {
                        const item = menuItems.find(i => i.key === value);
                        selectFn && selectFn(item);
                    }}
                    options={menuItems && menuItems.map(item => ({
                        label: item.title,
                        value: item.key
                    }))}
                />
            </div>
        )
    }

    //渲染筛选项
    const showMenu = (data) =>{
        return data&&data.map(item=>{
            return(
                <div
                    key={item.key}
                    className={`select-menu-item  ${item.key === selected ? "select-menu-item-selected" : ""}`}
                    onClick={()=>selectFn(item)}
                >
                    <span> {item.title} </span>
                </div>
            )
        })
    }

    return(
        <div className={"select-menu-box"} style={style}>
            {showMenu(menuItems)}
        </div>
    )
}

export default MenuSelect