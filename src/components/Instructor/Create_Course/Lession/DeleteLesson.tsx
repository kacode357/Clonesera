import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { deleteLesson } from '../../../../utils/commonImports';
const { confirm } = Modal;

interface DeleteLessonProps {
  lesson_id: string;
  onLessonDeleted: () => void; // Add this prop to notify parent component
}

const DeleteLesson: React.FC<DeleteLessonProps> = ({ lesson_id, onLessonDeleted }) => {
  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this lesson?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        return handleDeleteLesson(lesson_id);
      },
    });
  };

  const handleDeleteLesson = async (id: string) => {
    await deleteLesson(id);
    onLessonDeleted(); // Call this function to refresh the lesson list
  };

  return (
    <Button
      icon={<DeleteOutlined />}
      onClick={showDeleteConfirm}
      danger
    >
    </Button>
  );
};

export default DeleteLesson;
