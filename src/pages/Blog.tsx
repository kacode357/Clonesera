import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getBlogsPublic } from '../utils/commonImports';

interface Blog {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  user_name: string;
  category_name: string;
  updated_at: string;
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const blogsPerPage = window.innerWidth < 768 ? 1 : 4; // Number of blogs to display per page

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = {
          searchCondition: {
            category_id: '', // Add appropriate category_id if needed
            is_deleted: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 100, // Fetch a large number to handle pagination client-side
          },
        };
        const response = await getBlogsPublic(data);
        setBlogs(response.pageData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex + blogsPerPage < blogs.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleClick = (id: string) => {
    navigate(`/blog-detail/${id}`);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description;
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevClick}
          className={`bg-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-300 transition duration-300 ${currentIndex === 0 ? 'invisible' : 'visible'}`}
        >
          <LeftOutlined className="text-lg" />
        </button>
        <h2 className="text-3xl font-bold text-left">Latest Blog Posts</h2>
        <button
          onClick={handleNextClick}
          className={`bg-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-300 transition duration-300 ${currentIndex + blogsPerPage >= blogs.length ? 'invisible' : 'visible'}`}
        >
          <RightOutlined className="text-lg" />
        </button>
      </div>
      <div className="relative overflow-hidden">
        <div className="blog-slider" style={{ transform: `translateX(-${currentIndex * (100 / blogsPerPage)}%)` }}>
          {loading ? (
            Array.from({ length: blogsPerPage }).map((_, index) => (
              <div key={index} className="blog-slide">
                <Skeleton active paragraph={{ rows: 5 }} />
              </div>
            ))
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-slide">
                <div
                  onClick={() => handleClick(blog._id)}
                  className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer p-4"
                  style={{ height: '380px' }}
                >
                  <img
                    width={272}
                    alt="blog"
                    src={blog.image_url}
                    className="rounded-lg mb-4"
                  />
                  <div className="text-xl font-semibold mb-2">{blog.title}</div>
                  <div className="text-gray-500">
                    <div><strong>Author:</strong> {blog.user_name}</div>
                    <div><strong>Category:</strong> {blog.category_name}</div>
                    <div><strong>Update:</strong> {new Date(blog.updated_at).toLocaleDateString()}</div>
                    <div><strong>Description:</strong> {truncateDescription(blog.description, 200)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
