import React from 'react';
import { Button, Modal } from 'antd';
import { changeCourseStatus } from '../../../../utils/commonImports';

interface SendToAdminButtonProps {
  courseIds: number[];
  refreshCourses: () => void;
}

const SendToAdminButton: React.FC<SendToAdminButtonProps> = ({ courseIds, refreshCourses }) => {
  const handleClick = () => {
    Modal.confirm({
      title: 'Confirm Send',
      content: `Are you sure you want to send ${courseIds.length} course(s) to admin for approval?`,
      okText: 'Send',
      cancelText: 'Cancel',
      onOk: async () => {
        await Promise.all(
          courseIds.map(courseId =>
            changeCourseStatus({ course_id: courseId.toString(), new_status: 'waiting_approve' })
          )
        );
        refreshCourses();
      },
    });
  };

  return (
    <Button type="primary" className='custom-button' onClick={handleClick} disabled={courseIds.length === 0}>
      Send to Admin
    </Button>
  );
};

export default SendToAdminButton;
