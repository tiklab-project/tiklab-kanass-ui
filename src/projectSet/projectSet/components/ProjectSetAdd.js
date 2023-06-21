import React, { useState } from "react";
import { message, Row, Col } from 'antd';
import 'moment/locale/zh-cn';
import { getUser } from 'tiklab-core-ui';
import { Provider } from "mobx-react";
import "./ProjectSetAdd.scss";

import ProjectSetAddInfo from "./ProjectSetAddInfo";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import ProjectSetStore from "../store/ProjectSetStore";


const ProjectSetAdd = (props) => {
    const store = {
        projectSetStore: ProjectSetStore
    }
    const [visible, setVisible] = React.useState(false);
    const { setAllProjectSetList } = props;
    const { addProjectSetSet, getProjectSetlist, findAllProjectSet, creatIcon, findIconList } = ProjectSetStore;


    const [currentStep, setCurrentStep] = useState(1)


    const getIconList = () => {
        findIconList({ iconType: "projectSet" }).then((res) => {
            // setIconList(res.data)
        })
    }

    /**
    *上传图标 
    */
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const upLoadIcon = {
        name: 'uploadFile',
        action: `${upload_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                const params = {
                    iconName: info.file.name,
                    iconUrl: info.file.response.data.fileName,
                    iconType: "projectSet"
                }
                creatIcon(params).then((res) => {
                    if (res.code === 0) {
                        getIconList()
                    } else {

                    }
                })
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const Head = () => {
        return (
            <Breadcumb
                firstText="添加项目集"
            >
                <div onClick={() => props.history.goBack()} className="projectSetadd-close">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-close"></use>
                    </svg>
                </div>
            </Breadcumb>
        )
    }


    return (<Provider {...store}>
         <div className="projectSet-add">
            <Row>
                <Col
                    className="projectSet-type-col"
                    lg={{ span: "18", offset: "3" }}
                    xl={{ span: "14", offset: "5" }}
                    xxl={{ span: "10", offset: "7" }}
                    style={{ height: "100%" }}
                >
                    <Head />
                    <div>

                        <ProjectSetAddInfo findAllProjectSet={findAllProjectSet} addProjectSetSet={addProjectSetSet} setAllProjectSetList={setAllProjectSetList} getProjectSetlist={getProjectSetlist} setVisible={setVisible} setCurrentStep={setCurrentStep} />
                    </div>
                </Col>
            </Row>
        </div>
    </Provider>
       
    );
};

export default ProjectSetAdd;