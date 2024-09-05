import React from 'react';
import { Select } from 'antd';
import { changeUserRole } from '../../../utils/commonImports';
const { Option } = Select;

interface RoleSelectProps {
  userId: string;
  role: string;
  onChange: (userId: string, role: string) => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ userId, role, onChange }) => {
  const handleRoleChange = async (newRole: string) => {
      await changeUserRole({ user_id: userId, role: newRole });
      onChange(userId, newRole);
  };

  return (
    <Select defaultValue={role} onChange={handleRoleChange} style={{ width: 120 }}>
      <Option value="admin">Admin</Option>
      <Option value="student">Student</Option>
      <Option value="instructor">Instructor</Option>
    </Select>
  );
};

export default RoleSelect;
