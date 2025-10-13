import {withRouter} from "react-router";
import React, {Fragment, useState} from "react";
import {Form, Input, message, Modal, Spin} from "antd";
import "./WikiRepositoryAdd.scss"
import Button from "../../../../common/button/Button"
import {inject, observer} from "mobx-react";
const { TextArea } = Input;
const layout = {
    labelCol: {
        span: 6,
    }
};
const WikiRepositoryAdd = (props) => {

    const { addProjectSetSet, findProjectSet } = props;
    const { wikiAddvisible, setWikiAddvisible, wikiRepositoryStore, projectId, setProjectWikiList } = props;
    const { createWikiRepository, findProjectWikiRepositoryList} = wikiRepositoryStore;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = () => {
        form.validateFields().then((values) => {
            setLoading(true)
            const data = {
                wikiRepository: {
                    name: values.wikiRepositoryName,
                    desc: values.desc,
                    limits: values.wikiRepositoryLimits,
                    iconUrl: randomIconUrl(),
                },
                project: {id: projectId}
            }
            createWikiRepository(data).then(res => {
                setLoading(false)
                const wikiRepositoryId = res.data;

                if (res.code === 0) {
                    message.success('添加成功');
                }else {
                    if (res.code === 10000) {
                        message.error("创建知识库的用户不存在，请联系管理员");
                    }
                }
                findProjectWikiRepositoryList({ projectId: projectId }).then((res) => {
                    if (res.code === 0) {
                        setProjectWikiList(res.data)
                    }
                })

                form.resetFields();
                setWikiAddvisible(false);
            })
        })
    }

    const randomIconUrl = () => {
        const randomNum = Math.floor(Math.random() * 4) + 1;
        return `repository${randomNum}.png`;
    }

    const checkLimit = (_, value) => {
        if (value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Price must be greater than zero!'));
    };
    const [limtValue, setLimitValue] = useState("0");
    const LimitComponents = ({ value = {}, onChange }) => {

        const changeLimit = (id) => {
            setLimitValue(id)
            onChange(id)
        }

        return (
            <div className="wikiRepository-limit" onChange={onChange} value={value}>
                <div key="0" className={`wikiRepository-limits ${limtValue === "0" ? "limit-select" : ""}`} onClick={() => changeLimit("0")}>
                    <div className="limits-title">
                        公共
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-publish"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        公共知识库，全部成员可见
                    </div>
                </div>
                <div key="1" className={`wikiRepository-limits ${limtValue === "1" ? "limit-select" : ""}`} onClick={() => changeLimit("1")}>
                    <div className="limits-title">
                        私密
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-private"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        私密知识库，只有知识库成员可见
                    </div>
                </div>
            </div>
        )
    }

    const handleOnCancel = () => {
        form.resetFields();
        setWikiAddvisible(false)
    }
    
    return(
        <Fragment>
            <Modal
                title={"添加知识库"}
                visible={wikiAddvisible}
                footer={null}
                closable={false}
                width={800}
                destroyOnClose={true}
                className="wikiRepository-addinfo"
                bodyStyle={{paddingBottom: "15px"}}
            >
                {/* <div className="wikiRepository-type-head">填写信息</div> */}
                <Spin spinning={loading} tip="添加中...">
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            remember: true,
                            wikiRepositoryLimits: "0"
                        }}
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            label="知识库名称"
                            name="wikiRepositoryName"
                            rules={[
                                {
                                    required: true,
                                    message: '使用中英文、数字、空格组合',
                                },
                            ]}
                        >
                            <Input placeholder="使用中英文、数字、空格组合" />
                        </Form.Item>

                        <Form.Item
                            label="可见范围"
                            name="wikiRepositoryLimits"
                            rules={[
                                {
                                    validator: checkLimit,
                                }
                            ]}
                        >
                            <LimitComponents />
                        </Form.Item>
                        <Form.Item
                            label="知识库描述"
                            name="desc"
                            rules={[
                                {
                                    required: false,
                                    message: '请输入知识库描述',
                                },
                            ]}
                        >
                            <TextArea rows={3} />
                        </Form.Item>
                        <div className="wikiRepository-add-submit">
                            <Button style={{marginLeft: "auto"}} htmlType="button" onClick={handleOnCancel}>
                                取消
                            </Button>

                            <Button type="primary" htmlType="submit" onClick={onFinish}>
                                提交
                            </Button>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </Fragment>
    )
}

export default inject("wikiRepositoryStore")(observer(withRouter(WikiRepositoryAdd)));