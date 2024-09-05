// StatusToggle.tsx
import React, { useState } from 'react';
import { Switch } from 'antd';
import { changeUserStatus } from '../../../utils/commonImports';

interface StatusToggleProps {
  userId: string;
  status: boolean;
  onStatusChange: () => void;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ userId, status, onStatusChange }) => {
  const [tempStatus, setTempStatus] = useState(status);

  const handleStatusChange = async (checked: boolean) => {
    setTempStatus(checked);
    try {
      await changeUserStatus({ user_id: userId, status: checked });
   
      onStatusChange();
    } catch (error) {
      console.error('Failed to update status');
      setTempStatus(status);
    }
  };

  return (
    <Switch checked={tempStatus} onChange={handleStatusChange} />
  );
};

export default StatusToggle;
