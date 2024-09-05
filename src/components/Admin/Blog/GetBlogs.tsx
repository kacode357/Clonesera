import React, { useEffect, useState } from 'react';
import { Table, message, Button, Input, Pagination } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getBlogs } from '../../../utils/commonImports';
import EditBlog from './EditBlog';
import DeleteBlog from './DeleteBlog';

interface Blog {
  _id: string;
  name: string;
  category_id: string;
  category_name: string;
  description: string;
  image_url: string;
  content: string;
}

const { Search } = Input;

const GetBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [searchCategoryName, setSearchCategoryName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchBlogs = async (category_id = '', pageNum = 1, pageSize = 10) => {
    try {
      const data = {
        searchCondition: { category_id, is_deleted: false },
        pageInfo: { pageNum, pageSize },
      };
      const result = await getBlogs(data);
      setBlogs(result.pageData);
      setAllBlogs(result.pageData);
      setTotalItems(result.pageInfo.totalItems);
    } catch (err) {
      setError('Failed to fetch blogs');
      message.error('Failed to fetch blogs');
    }
  };

  useEffect(() => {
    fetchBlogs('', currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleEdit = (id: string) => {
    setEditingBlogId(id);
  };

  const handleSave = () => {
    setEditingBlogId(null);
  };

  const handleDelete = () => {
    setDeletingBlogId(null);
  };

  const handleSearch = (value: string) => {
    setSearchCategoryName(value);
    if (value === '') {
      fetchBlogs('', 1, pageSize);
      setCurrentPage(1);
    } else {
      const matchedBlog = allBlogs.find(blog => blog.category_name.toLowerCase() === value.toLowerCase());
      if (matchedBlog) {
        fetchBlogs(matchedBlog.category_id, 1, pageSize);
      } else {
        setBlogs([]);
      }
      setCurrentPage(1);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category Name',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Image',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (image_url: string) => <img src={image_url} alt="Blog" style={{ width: 100 }} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: undefined, record: Blog) => (
        <div className="flex space-x-2">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record._id)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => setDeletingBlogId(record._id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Search
        placeholder="Search by category name"
        enterButton={<SearchOutlined />}
        allowClear
        size="large"
        onSearch={handleSearch}
        value={searchCategoryName}
        onChange={e => setSearchCategoryName(e.target.value)}
        className="mr-4 w-80 mb-4"
      />

      {error ? (
        <div>{error}</div>
      ) : (
        <div>
          <Table dataSource={blogs} columns={columns} rowKey="_id" pagination={false} />
          <div className="flex justify-end items-center mt-6">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
                fetchBlogs(searchCategoryName, page, pageSize);
              }}
              showSizeChanger
              className="text-center"
            />
          </div>
        </div>
      )}

      <EditBlog
        visible={!!editingBlogId}
        id={editingBlogId}
        onClose={() => setEditingBlogId(null)}
        onSave={handleSave}
      />

      <DeleteBlog
        visible={!!deletingBlogId}
        id={deletingBlogId}
        onClose={() => setDeletingBlogId(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default GetBlogs;
