/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-15 14:34:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-01 15:42:05
 */
import React,{useImperativeHandle,useState,useRef,useEffect} from "react";
import { Modal } from 'antd';
import "../../common/components/projectDetail.scss";
import WorkAddPage from "../components/workAddPage";
import { observer, inject } from "mobx-react";


const WorkAddModel=(props)=>{

    const {workAddModel,state,getWorkDetail} = props
    const workAddPageRef = useRef()
    const [showAddModel,setShowAddModel] = useState(false)


    // 关闭详情弹窗,提交数据
    const handleOk = () => {
        console.log(workAddPageRef)
        workAddPageRef.current.submit(setShowAddModel)
    };
    

    // 点击取消按钮
    const handleCancel = () => {
        workAddPageRef.current.onReset();
        setShowAddModel(false);
        
    };


    // 暴露方法给父组件
    useImperativeHandle(workAddModel,()=> ({
        setShowAddModel: setShowAddModel
    }))

    const [title,setTitie] = useState("查看")
    useEffect(() => {
        if(state !== undefined){
            setTitie(state.title)
        }
    }, [state])
    
    return(
        <Modal 
            title= {title} 
            visible={showAddModel}
            className="work-addmodel"
            width= {800}
            destroyOnClose={true}
            onOk={handleOk} 
            onCancel={handleCancel}
        >
            <WorkAddPage state={state} workAddPageRef={workAddPageRef} getWorkDetail={getWorkDetail} {...props}></WorkAddPage>
        </Modal>
    )
}
export default inject("workStore")(observer(WorkAddModel));