import React, {useState} from "react";
import {DatePicker, Form, Input, Modal} from "antd";
import {inject, observer} from "mobx-react";
import IconBtn from "../../../../common/iconBtn/IconBtn";
import ProjectSelect from "../../workItem/components/ProjectSelect";
import workItemBindStore from "../store/WorkItemBindStore";
const { RangePicker } = DatePicker;

const WorkItemAdd = (props) =>{
    const {workItemStore,caseId} = props;
    const {findWorkItemBindPage} = workItemBindStore;
    const {createWorkItem} = workItemStore;
    const repositoryId = sessionStorage.getItem("repositoryId")

    const [form] = Form.useForm();

    const [visible, setVisible] = React.useState(false);
    const [selectProjectId, setSelectProjectId] = useState();
    const [rangeTime, setRangeTime] = useState();

    // 弹框展示
    const showModal = () => {

        setVisible(true);
    };

    // 提交
    const onFinish = async () => {
        let values = await form.getFieldsValue();

        let param = {
            repositoryId:repositoryId,
            name:values.name,
            projectId:selectProjectId,
            planBeginTime:rangeTime[0],
            planEndTime:rangeTime[1],
            caseId:caseId   //绑定的caseid
        }
        //创建缺陷
        createWorkItem(param).then(()=>{
            findWorkItemBindPage({
                caseId:caseId,

            })
        })

        setVisible(false);
    };

    /**
     * 获取时间范围
     * @param data
     * @param dataString
     */
    const changeRangeTime = (data,dataString) =>{
        setRangeTime(dataString)
    }

    /**
     * 获取项目id
     */


    const onCancel = () => { setVisible(false) };

    return(
        <div className={"defect_add-box"}>
            <IconBtn
                className="pi-icon-btn-grey"
                name={"添加缺陷"}
                onClick={showModal}
            />
            <Modal
                destroyOnClose={true}
                title="添加缺陷"
                visible={visible}
                onCancel={onCancel}
                onOk={onFinish}
                okText="提交"
                cancelText="取消"
                centered
                width={400}
            >
                <Form
                    form={form}
                    preserve={false}
                    layout={"vertical"}
                >
                    <Form.Item
                        label="项目"
                        rules={[{ required: true, message:"请选择项目" }]}
                        name="project"
                    >
                        <ProjectSelect
                            clickProject={setSelectProjectId}
                            {...props}
                        />
                    </Form.Item>
                    <Form.Item
                        label="缺陷标题"
                        rules={[{ required: true,  message: '请输入名称!' }]}
                        name="name"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="日期范围"
                        name="rangeTime"
                        wrapperCol={{
                            offset: 0,
                            span: 24,
                        }}
                    >
                        <RangePicker
                            format={'YYYY-MM-DD'}
                            onChange={changeRangeTime}
                        />
                    </Form.Item>
                </Form>

            </Modal>
        </div>
    )
}

export default inject("workItemStore")(observer(WorkItemAdd));