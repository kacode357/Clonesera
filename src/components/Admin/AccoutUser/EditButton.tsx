import { React, useState, EditOutlined, Button, Modal, Tooltip } from '../../../utils/commonImports';
import EditUserForm from './EditForm';

interface EditButtonProps {
  userId: string;
  onEdit: (_id: string) => void;
}

const EditButton: React.FC<EditButtonProps> = ({ userId, onEdit }) => {
  const [visible, setVisible] = useState(false);

  const handleEdit = () => {
    onEdit(userId);
    setVisible(true);
  };

  return (
    <>
      <Tooltip title="Edit">
        <Button type="link" icon={<EditOutlined />} onClick={handleEdit} />
      </Tooltip>
      <Modal
        title="Edit User"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <EditUserForm userId={userId} onClose={() => setVisible(false)} />
      </Modal>
    </>
  );
};

export default EditButton;
