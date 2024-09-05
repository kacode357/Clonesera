import React from 'react';

interface CourseTabProps {
  // Define props here if needed
}

const CourseTab: React.FC<CourseTabProps> = () => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
      {/* Render courses here */}
    </div>
  );
};

export default CourseTab;
