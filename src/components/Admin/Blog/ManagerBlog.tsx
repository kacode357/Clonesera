import React from 'react';
import CreateBlog from './CreateBlog';
import GetBlogs from './GetBlogs';


const ManagerBlog: React.FC = () => {
  return (
    <div>
      <CreateBlog />
      <GetBlogs />

    </div>
  );
};

export default ManagerBlog;
