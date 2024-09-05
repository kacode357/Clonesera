import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { deleteCourse } from '../../../../utils/commonImports';

interface DeleteButtonProps {
  courseId: number;
  refreshCourses: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ courseId, refreshCourses }) => {
  const handleClick = () => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this course?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: async () => {
          await deleteCourse(courseId.toString());
          refreshCourses();
      },
    });
  };

  return (
    <Button icon={<DeleteOutlined />} onClick={handleClick} danger />
  );
};

export default DeleteButton;
