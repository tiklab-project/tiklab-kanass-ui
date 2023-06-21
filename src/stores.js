/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-11 16:37:03
 */
import { createContext } from 'react';
import {EAM_STORE, EamStore} from 'tiklab-eam-ui/es/store';

function createStores() {
    return {

        [EAM_STORE]: new EamStore()
        
    };
}

const store = createStores();

const storeContext = createContext(store);

export {
    store,
    storeContext
}