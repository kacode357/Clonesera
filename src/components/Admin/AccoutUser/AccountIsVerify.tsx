import React, { useEffect, useState } from 'react';
import { Table, Avatar, Pagination, Tag, Input } from 'antd';
import { getUsers, SearchOutlined } from '../../../utils/commonImports';

const { Search } = Input;

interface User {
  _id: string;
  avatar: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  is_verified: boolean;
}

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
}

interface DisplayAccountProps {
  status?: boolean;
  isDeleted?: boolean;
}

const DisplayAccount: React.FC<DisplayAccountProps> = ({ status = true, isDeleted = false }) => {
  const [data, setData] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({ current: 1, pageSize: 10, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const fetchUsers = async (pageNum: number, pageSize: number, keyword: string) => {
      const response = await getUsers({
        keyword,
        role: 'all',
        status,
        is_deleted: isDeleted,
        is_verified: 'false'
      }, pageNum, pageSize);
      setData(response.pageData);
      setPagination({
        current: response.pageInfo.pageNum,
        pageSize: response.pageInfo.pageSize,
        total: response.pageInfo.totalItems,
      });
  };

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize, searchKeyword);
  }, [pagination.current, pagination.pageSize, status, isDeleted, searchKeyword]);

  const handleTableChange = (newPagination: PaginationProps) => {
    fetchUsers(newPagination.current, newPagination.pageSize, searchKeyword);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => <Avatar src={avatar} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Verified',
      dataIndex: 'is_verified',
      key: 'is_verified',
      render: (is_verified: boolean) => (
        <Tag color={is_verified ? 'blue' : 'gray'}>
          {is_verified ? 'Verified' : 'Not Verified'}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4">
        <Search
          placeholder="Search by name or email"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
          onSearch={handleSearch}
          className="mr-4 w-80"
        />
      </div>
      <Table
        columns={columns}
        rowKey={(record: User) => record._id}
        dataSource={data}
        pagination={false} // Disable pagination in Table component
        onChange={(pagination) => handleTableChange(pagination as PaginationProps)}
      />
      <div className="flex justify-end mt-5">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={(page, pageSize) => {
            setPagination({
              current: page,
              pageSize: pageSize!,
              total: pagination.total,
            });
            fetchUsers(page, pageSize!, searchKeyword);
          }}
          showSizeChanger
        />
      </div>
    </>
  );
};

export default DisplayAccount;
