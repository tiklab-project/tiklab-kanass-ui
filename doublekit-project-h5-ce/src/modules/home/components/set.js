/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-18 14:12:35
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-25 17:03:42
 */
import React, { useEffect, useState } from 'react';
import { NavBar, List } from 'antd-mobile';
import { loginOutAcc} from "doublekit-portal-h5";
import { getUser } from "doublekit-core-ui"
const Set = (props) => {
    const copId = getUser() ? getUser().corpid : null;
    return (
        <div className="home">
            <NavBar
                style={{
                    '--height': '36px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={false}
            >
                <div>设置</div>
            </NavBar>
            {/* <List>
            {
                !copId && <List.Item onClick={()=> loginOutAcc(authData.authUrl)}>退出</List.Item>
            }
            </List> */}
        </div>
    )
}
export default Set;