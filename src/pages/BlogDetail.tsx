import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Skeleton } from 'antd';
import parse from 'html-react-parser';
import { getBlogByIdPublic } from '../utils/commonImports';

const { Title, Paragraph } = Typography;

interface BlogDetail {
  name: string;
  description: string;
  content: string;
  image_url: string;
  updated_at: string;
  user_name: string;
  category_name: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the blog ID from the URL
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (id) {
          const response = await getBlogByIdPublic(id);
          setBlog(response);
        }
      } catch (error) {
        console.error('Error fetching blog detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return (
    <div className="relative">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        {loading ? (
          <>
            <Skeleton active title paragraph={{ rows: 1 }} />
            <Skeleton.Image className="mb-4" />
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 5 }} />
          </>
        ) : blog ? (
          <>
            <Title level={2}>{blog.name}</Title>
            <img src={blog.image_url} alt={blog.name} style={{ width: '100%', height: 'auto', marginBottom: '16px' }} />
            <Paragraph><strong>Author:</strong> {blog.user_name}</Paragraph>
            <Paragraph><strong>Category:</strong> {blog.category_name}</Paragraph>
            <Paragraph><strong>Updated at:</strong> {new Date(blog.updated_at).toLocaleDateString()}</Paragraph>
            <Paragraph><strong>Description:</strong> {blog.description}</Paragraph>
            <h1 className='text-lg font-bold text-center'>Content</h1>
            <div
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                overflow: 'hidden',
                paddingBottom: '20px',
                paddingLeft: '10px',
                paddingRight: '10px',
                border: 'none'
              }}
            >
              {parse(blog.content || '')}
            </div>
          </>
        ) : (
          <p>Blog not found</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
