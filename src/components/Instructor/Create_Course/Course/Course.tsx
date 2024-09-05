import React, { useState, useCallback } from 'react';
import CreateCourseButton from './CreateCourse';
import DisplayCourse from './DisplayCourse';
import SendToAdminButton from './SendToAdminButton';

const Course: React.FC = () => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  const refreshCourses = useCallback(() => {
    setRefreshFlag(prev => !prev);
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <CreateCourseButton refreshCourses={refreshCourses} />
        <SendToAdminButton courseIds={selectedCourseIds} refreshCourses={refreshCourses} />
      </div>
      <DisplayCourse setSelectedCourseIds={setSelectedCourseIds} refreshFlag={refreshFlag} refreshCourses={refreshCourses} />
    </div>
  );
};

export default Course;
