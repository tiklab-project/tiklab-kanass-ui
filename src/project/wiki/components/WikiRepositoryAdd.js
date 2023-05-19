import React, { Fragment,useEffect,useState } from "react";
import { Modal, Form,Input,Radio,Select } from 'antd';
import { observer, inject } from "mobx-react";
const layout = {
    labelCol: {
    span: 6,
    },
    wrapperCol: {
    span: 16,
    },
};

const WikiRepositoryAdd = (props) => {
    const [form] = Form.useForm();
    const { wikiAddvisible, setWikiAddvisible, wikiRepositoryStore, projectId} = props;
    const { createProjectWikiRepository, findAllRepository, findUnProjectWikiRepository } = wikiRepositoryStore;

    useEffect(() => {
        findUnProjectWikiRepository({projectId: projectId})
    },[])
    const onFinish = () => {
        form.validateFields().then((values) => {
            if(props.actionType ==="add"){
                createProjectWikiRepository(values).then(res => {
                    if(res.code === 0){
                        findAllRepository().then(data => {
                            // if(data.code === 0){
                            //     setUrlDataList(data.data)
                            // }
                        })
                    }
                })
                
            }else {
                // data.id= props.id
                // editWorkPriorityList(data)
            }
            setWikiAddvisible(false);
        })
        
    };
    


    const onCancel = () => {
        form.resetFields();
        setWikiAddvisible(false);
    };

    return (
        <>
        <Fragment>
            <Modal
                title={"添加知识库"}
                visible={wikiAddvisible}
                onCancel={onCancel}
                onOk={onFinish}
                closable = {false}
            >
                <div>ddddd</div>
            </Modal>
        </Fragment>
        
        </>
    );
};

export default inject("wikiRepositoryStore")(observer(WikiRepositoryAdd));