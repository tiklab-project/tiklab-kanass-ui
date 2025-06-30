import {Alert, Form, Input, Modal} from "antd";
import React from "react";
import "./DeleteProjectModal.scss"

const DeleteProjectModal = (props) => {
    const {isModalVisible, handleOk, handleCancel, confirmForm, projectInfo } = props
  return(
      <div className="project-delete-confirm">
          <Modal
              title="确定删除"
              width={500}
              height={400}
              getContainer={false}
              visible={isModalVisible}
              closable={false}
              onOk={handleOk}
              onCancel={handleCancel}
              okText={"确定"}
              cancelText={"取消"}
              okType="danger"
              okButtonProps={{ type: "primary" }}
          >
              <Alert message=" 此项目及其事务、组件、附件和版本将在回收站中保留 60 天，之后将被永久删除" type="error" showIcon />

              <Form
                  form={confirmForm}
                  name="dependencies"
                  autoComplete="off"
                  style={{
                      maxWidth: 600,
                  }}
                  layout="vertical"
              >


                  <Form.Item
                      label="项目名称"
                      name="confirmProjectName"
                      className="delete-modal-form-item" // 添加自定义类名
                      rules={[
                          {
                              validator(rule, value) {
                                  if (!value) {
                                      return Promise.reject(`请输入项目名称`);
                                  }
                                  if (projectInfo?.projectName !== value) {
                                      return Promise.reject(`请输入正确的项目名称`);
                                  }
                                  return Promise.resolve();
                              }
                          }
                      ]}
                  >
                      <Input />
                  </Form.Item>
              </Form>
          </Modal>
      </div>
  )
};

export default DeleteProjectModal;