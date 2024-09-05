import React from 'react';
import { Button, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteSession } from '../../../../utils/commonImports';

interface ButtonDeleteProps {
  _id: string;
  onSessionDeleted: () => void; 
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ _id, onSessionDeleted }) => {
  const handleDelete = async () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this session?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        await deleteSession(_id);
        onSessionDeleted(); // Call this function to refresh the session list
      },
      onCancel() {},
    });
  };

  return (
    <Button icon={<DeleteOutlined />} onClick={handleDelete} danger />
  );
};

export default ButtonDelete;
