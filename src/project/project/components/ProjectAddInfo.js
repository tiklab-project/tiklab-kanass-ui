/*
 * @Descripttion: 项目添加详情界面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 16:54:28
 */
import React, { Fragment,useEffect } from "react";
import {  Form, Input, DatePicker, message, Upload } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./ProjectAddInfo.scss";
import Button from "../../../common/button/Button"
import { useState } from "react";
import { getUser } from "tiklab-core-ui";
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import ProjectStore from "../store/ProjectStore";
import { useDebounce } from "../../../common/utils/debounce";
import ImgComponent from "../../../common/imgComponent/ImgComponent";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const layout = {
    labelCol: {
        span: 6,
    }
};


const ProjectAddInfo = (props) => {
    const { createProject, workType, setCurrentStep, setLoading } = props;
    const {findIconList, creatIcon, creatProjectKey} = ProjectStore;
    const [form] = Form.useForm();
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: '选择时间',
            }
        ]
    };
    const [limtValue, setLimitValue] = useState("0");
    const [iconUrl, setIconUrl] = useState("project1.png")

    const [iconList, setIconList] = useState();
    const [key, setKey] = useState();
   
    useEffect(() => {
        getIconList()
        return;
    },[])

    const getIconList = () => {
        findIconList({ iconType: "project" }).then((res) => {
            setIconList(res.data)
            setIconUrl(res.data[0].iconUrl)
        })
    }

    const setProjectKey = useDebounce((value) => {
        creatProjectKey(value.replace(/\s+/g, '')).then(res => {
            if(res.code === 0){
                setKey(res.data)
                form.setFieldsValue({
                    projectKey: res.data
                })
            }
        })
    }, [500])
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const upload_url = env === "local" ? base_url : "";
    const upLoadIcon = {
        name: 'uploadFile',
        action: `${upload_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            if (info.file.status === 'done') {
                const res = info.file.response.data;
                const params = {
                    iconName: info.file.name,
                    iconUrl: "/image/" + res,
                    iconType: "project"
                }
                creatIcon(params).then((res) => {
                    if (res.code === 0) {
                        getIconList()
                    }
                })
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    };

    const onFinish = () => {

        form.validateFields().then((values) => {
            setLoading(true)
            const time = values["startTime"]
            const data = {
                projectName: values.projectName,
                projectKey: values.projectKey,
                projectType: {
                    id: workType.id,
                    type: workType.type
                },
                master: {
                    id: getUser().userId
                },
                desc: values.desc,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                projectState: values.projectState,
                projectLimits: values.projectLimits,
                iconUrl: iconUrl
            }
            createProject(data).then(res => {
                setLoading(false)
                if (res.code === 0) {
                    message.success('添加成功');
                    props.history.goBack()
                    setCurrentStep("0")
                } else if(res.code === 40000){
                    message.error(res.msg)
                } else {
                    message.error("添加失败")
                }

            })
        })
    }


    const checkLimit = (_, value) => {
        if (value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Price must be greater than zero!'));
    };

    const LimitComponents = ({ value = {}, onChange }) => {

        const changeLimit = (id) => {
            setLimitValue(id)
            onChange(id)
        }

        return (
            <div className="project-limit" onChange={onChange} value={value}>
                <div key="0" className={`project-limits ${limtValue === "0" ? "limit-select" : ""}`} onClick={() => changeLimit("0")}>
                    <div className="limits-title">
                        公共
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-publish"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        公共项目，全部成员可见
                    </div>
                </div>
                <div key="1" className={`project-limits ${limtValue === "1" ? "limit-select" : ""}`} onClick={() => changeLimit("1")}>
                    <div className="limits-title">
                        私密
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-private"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        私密项目，只有项目成员可见
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Fragment>
            <div className="project-select-type">
                <div className="project-type-head">项目类型</div>
                <div className="project-type-content">
                    <div className="project-type-box">
                        <div>
                            <ImgComponent src={`${workType.iconUrl}`} alt="" className="type-icon" />
                        </div>
                        <div className="type-info">
                            <div className="type-name">{workType.name}</div>
                            <div className="type-desc">{workType.desc}</div>
                        </div>
                    </div>
                    <Button onClick={() => setCurrentStep(0)}>更改类型</Button>
                </div>

            </div>
            <div className="project-addinfo">
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                        projectLimits: "0"
                    }}
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="项目名称"
                        name="projectName"
                        rules={[
                            {
                                required: true,
                                message: '使用中英文、数字、空格组合',
                            },
                        ]}
                    >
                        <Input placeholder="使用中英文、数字、空格组合" onChange={(value)=> setProjectKey(value.target.value)}/>
                    </Form.Item>
                    <Form.Item
                        label="项目Key"
                        name="projectKey"

                        rules={[
                            {
                                required: true,
                                message: '请输入项目键值',
                            },
                            {
                                pattern: /^[A-Za-z]+$/,
                                message: '只能包含英文!'
                            },
                            {
                                pattern: /^[\S]{2,10}$/,
                                message: '请输入2-8位英文字符'
                            }
                        ]}
                    >
                        <Input placeholder="只能包含字母，添加成功后不可修改" maxLength={9} showCount />
                        {/* <div>请输入字母</div> */}
                    </Form.Item>
                    <Form.Item
                        label="可见范围"
                        name="projectLimits"
                        rules={[
                            {
                                validator: checkLimit,
                            }
                        ]}
                    >
                        <LimitComponents />
                    </Form.Item>
                    <Form.Item name="startTime" label="计划日期" {...rangeConfig}>
                        <RangePicker locale={locale} />
                    </Form.Item>
                    <Form.Item
                        label="项目描述"
                        name="desc"
                        rules={[
                            {
                                required: false,
                                message: '请输入项目描述',
                            },
                        ]}
                    >
                        <TextArea rows={3} placeholder = "项目描述" />
                    </Form.Item>
                    <Form.Item
                        label="图标"
                        name="icon"
                    >
                        <div className="project-icon-box">
                            {
                                iconList && iconList.map((item) => {
                                    return <div key={item.id} className={`project-icon  ${item.iconUrl === iconUrl ? "icon-select" : null}`} onClick={() => { setIconUrl(item.iconUrl) }}>

                                        <ImgComponent 
                                            alt="" 
                                            className="img-icon" 
                                            src={(`${item.iconUrl}`)}
                                        />
                                    </div>
                                })
                            }
                            {/* <Upload {...upLoadIcon}>
                                <div className="project-icon">
                                    <img src={UploadIcon1} alt="" className="list-img"/>
                                </div>
                            </Upload> */}
                        </div>
                    </Form.Item>
                    <div className="project-add-submit">
                        <Button htmlType="button" onClick={() => setCurrentStep(0)}>
                            上一步
                        </Button>
                        <Button htmlType="button" onClick={() => props.history.goBack()}>
                            取消
                        </Button>

                        <Button type="primary" htmlType="submit" onClick={onFinish}>
                            提交
                        </Button>

                    </div>
                </Form>
            </div>
        </Fragment>

    )
}

export default withRouter(observer(ProjectAddInfo));