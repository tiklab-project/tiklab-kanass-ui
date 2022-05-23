import React, { useEffect, useState } from "react";
import { NavBar,Card } from "antd-mobile";
import { inject,observer } from "mobx-react";
import { withRouter } from "react-router";
import { DocumentEditor } from "doublekit-slate-h5-ui";
import "./workItemDetail.scss";
const WorkItemDetail = (props) => {
    const { workItemStore } = props;
    const { findWorkItem, upload, createWorkAttach, findWorkAttachList } = workItemStore;
    const workItemId = props.match.params.id;
    const [workItemInfo, setWorkItemInfo] = useState();
    const [workAttachList, setWorkAttachList] = useState();
    const [slateValue, setSlateValue] = useState([
		{
			type: "paragraph",
			children: [{ text: "" }],
		},
	])
    useEffect(()=> {
        console.log(props.match.params.id)
        const workItemId = props.match.params.id;
        
        findWorkItem({id: workItemId}).then(res => {
            console.log(res)
            setWorkItemInfo(res.data)
            if(res.data.desc){
                setSlateValue(JSON.parse(res.data.desc))
            }
        })
        findWorkAttachList(workItemId).then(res => {
            console.log(workAttachList, res)
            setWorkAttachList(res)
        })
    },[])

    // const back = () =>
    // Toast.show({
    //   content: '点击了返回区域',
    //   duration: 1000,
    // })
    const [fileList, setFileList] = useState([])
    const handleUpload = (e) => {
        e.preventDefault();

        let file = e.target.files[0];
        // const formdata = new FormData();
        // formdata.append('file', file);

        // let list = []
        // for (var value of formdata.values()) {
        //     console.log(value);
        //     fileList.push(value)
        // }
        // // fileList.push(list)
        // setFileList([...fileList])
        // console.log(fileList[0].name)
        upload(file).then(res => {
            console.log(res)
            if(res.code === 0){
                
				const fileName = res.data.fileName;
                const params = {workId: workItemId, fileName: fileName}
                createWorkAttach(params).then(res => {
                    if(res.code === 0)
                    console.log(res)
                    findWorkAttachList(workItemId).then(res=> {
                        if(res.code === 0){
                            console.log(res)
                        }
                    })
                })
				// if (select) {
				// 	if(type === "txt") {
				// 		wrapAttachment(editor, `${base_url}/file/${res.data.data.fileName}`, res.data.data.fileMeta.originFileName)
				// 	}else if(type === "png" || type === "jpeg" || type === "jpg"){
				// 		wrapImage(editor, `${base_url}/file/${res.data.data.fileName}`)
				// 	}
					
				// }
			}
        })
    };

    return (
        <div>
            <NavBar
                style={{
                    '--height': '36px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={true}
                onBack={()=> props.history.goBack()}
            >
                <div className="title-top">
                    事项详情
                </div>
            </NavBar>
            <Card
                headerStyle={{
                    color: '#1677ff',
                }}
                title={workItemInfo && workItemInfo.title }
                style={{ backgroundColor: "#fff" }}
            >
                <div className="workItem-info-item">
                    <span>
                        事项名称：
                    </span>
                    <span>
                        {workItemInfo && workItemInfo.title }
                    </span>

                </div>
                <div className="workItem-info-item">
                    <span>
                        事件类型：
                    </span>
                    <span>
                        {workItemInfo && workItemInfo.workType.name }
                    </span>

                </div>
                <div className="workItem-info-item">
                    <span>
                        负责人：
                    </span>
                    <span>
                    { workItemInfo && workItemInfo.builder ? workItemInfo.builder.name : "admin" }
                    </span>
                </div>
                <div className="workItem-info-item">
                    <span>
                        创建时间
                    </span>
                    <span>
                    {/* {workItem && workItem.quantityNumber} */}
                    { workItemInfo && workItemInfo.buildTime }
                    </span>
                </div>
                <div className='form-upload'>
                    <div className="uplpad-list">
                        <div>上传文件</div>
                        <div className="upload-icon">
                            <input type="file" onChange={handleUpload} className= "upload-file"/>
                            <span>
                                <svg aria-hidden="true">
                                    <use xlinkHref="#icon-shangchuanwenjian"></use>
                                </svg>
                            </span>
                        </div>
                    </div>
                    {
                        workAttachList && workAttachList.map(item => {
                            return <div className="workAttach-list-item">
                                <div>
                                    {item.attachment.fileName}
                                </div>
                                <div>
                                    <a href={`${base_url}file/${item.attachment.fileName}`}>
                                        下载
                                    </a>
                                </div>
                                
                                
                            </div>
                        })
                    }
                    {/* {
                        fileList && fileList.length > 0 && fileList.map(item => {
                            return <div className="show-file">
                                <span>
                                    <svg aria-hidden="true">
                                        <use xlinkHref="#icon-a-wenjianjiawenjian"></use>
                                    </svg>
                                </span>
                                <span>
                                    {item.name}
                                </span>
                            </div>
                        })
                    } */}
                </div>
                <div>
                    <span>
                        描述
                    </span>
                    <span>
                        <DocumentEditor value = {slateValue}/>
                    </span>
                </div>
            </Card>
        </div>
    )
}
export default withRouter(inject("workItemStore")(observer(WorkItemDetail)));