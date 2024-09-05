import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import { deleteUser } from '../../../utils/commonImports';

interface DeleteButtonProps {
  userId: string;
  onDelete: (userId: string) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ userId, onDelete }) => {
  const handleDelete = async () => {
    await deleteUser(userId);
    onDelete(userId);
  };

  return (
    <Tooltip title="Delete">
      <Button type="link" icon={<DeleteOutlined />} onClick={handleDelete} danger />
    </Tooltip>
  );
};

export default DeleteButton;
