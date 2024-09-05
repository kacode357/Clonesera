// DisplayAccount.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Table, Avatar, Pagination, Input, message } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import { getUsers, SearchOutlined } from '../../../utils/commonImports';
import DeleteButton from './DeleteButton';
import StatusToggle from './StatusToggle';
import RoleSelect from './RoleSelect';
import EditButton from './EditButton';

interface User {
  _id: string;
  avatar: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  is_verified: boolean;
}

interface PaginationData {
  current: number;
  pageSize: number;
  total: number;
}

interface DisplayAccountProps {
  status?: boolean;
  isDeleted?: boolean;
}

const { Search } = Input;

const DisplayAccount: React.FC<DisplayAccountProps> = ({ status = false, isDeleted = false }) => {
  const [data, setData] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({ current: 1, pageSize: 10, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const fetchUsers = useCallback(async (pageNum: number, pageSize: number, keyword: string) => {
    try {
      const response = await getUsers({ keyword, role: 'all', status, is_deleted: isDeleted, is_verified: "true" }, pageNum, pageSize);
      setData(response.pageData);
      setPagination({
        current: response.pageInfo.pageNum,
        pageSize: response.pageInfo.pageSize,
        total: response.pageInfo.totalItems,
      });
    } catch (error) {
      message.error('Failed to fetch users');
    }
  }, [status, isDeleted]);

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize, searchKeyword);
  }, [pagination.current, pagination.pageSize, searchKeyword, fetchUsers]);

  const handleTableChange = (pagination: PaginationProps) => {
    setPagination({
      current: pagination.current!,
      pageSize: pagination.pageSize!,
      total: pagination.total!,
    });
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleRoleChange = () => {};

  const handleStatusChange = () => {
    fetchUsers(pagination.current, pagination.pageSize, searchKeyword);
  };

  const handleEdit = () => {};

  const handleDelete = () => {};

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
      render: (role: string, record: User) => (
        <RoleSelect userId={record._id} role={role} onChange={handleRoleChange} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: User) => (
        <StatusToggle userId={record._id} status={status} onStatusChange={handleStatusChange} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <>
          <EditButton userId={record._id} onEdit={handleEdit} />
          <DeleteButton userId={record._id} onDelete={handleDelete} />
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center mb-4">
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
        dataSource={data}
        pagination={false}
        onChange={handleTableChange}
        rowKey={(record: User) => record._id}
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
          }}
          showSizeChanger
        />
      </div>
    </div>
  );
};

export default DisplayAccount;
