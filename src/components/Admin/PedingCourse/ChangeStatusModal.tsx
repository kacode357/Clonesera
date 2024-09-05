import React, { useEffect } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import { changeCourseStatus } from '../../../utils/commonImports';

const { Option } = Select;

interface ChangeStatusModalProps {
  isVisible: boolean;
  courseIds: string[];
  onClose: () => void;
  onStatusChange: () => void;
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({ isVisible, courseIds, onClose, onStatusChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [isVisible, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    await Promise.all(
      courseIds.map(courseId => 
        changeCourseStatus({ course_id: courseId, new_status: values.new_status, comment: values.comment })
      )
    );
    onClose();
    form.resetFields();
    onStatusChange(); 
  };

  return (
    <Modal
      title="Change Course Status"
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ new_status: 'approve' }}
      >
        <Form.Item
          name="new_status"
          label="New Status"
          rules={[{ required: true, message: 'Please select the new status!' }]}
        >
          <Select
            onChange={(value) => {
              if (value === 'reject') {
                form.setFields([
                  {
                    name: 'comment',
                    errors: ['Please input a comment!'],
                  },
                ]);
              } else {
                form.setFields([
                  {
                    name: 'comment',
                    errors: [],
                  },
                ]);
              }
            }}
          >
            <Option value="approve">Approve</Option>
            <Option value="reject">Reject</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="comment"
          label="Comment"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('new_status') === 'reject' && !value) {
                  return Promise.reject(new Error('Please input a comment!'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeStatusModal;
