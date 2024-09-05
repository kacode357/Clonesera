import React from 'react';
import { Modal, Button } from 'antd';
import { deleteBlog } from '../../../utils/commonImports'; 

interface DeleteBlogProps {
  visible: boolean;
  id: string | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const DeleteBlog: React.FC<DeleteBlogProps> = ({ visible, id, onClose, onDelete }) => {
  const handleDelete = async () => {
    if (id) {
        await deleteBlog(id);
        onDelete(id); 
        onClose(); 
    }
  };

  return (
    <Modal
      title="Delete Blog"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="delete" type="primary" danger onClick={handleDelete}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete the blog with ID: {id}?</p>
    </Modal>
  );
};

export default DeleteBlog;
