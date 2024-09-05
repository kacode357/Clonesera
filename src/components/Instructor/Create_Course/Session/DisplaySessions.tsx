import React from 'react';
import { Table, Pagination, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import ButtonEdit from './EditSession';
import ButtonDelete from './DeleteSession';
import type { ColumnsType } from 'antd/es/table';

interface Session {
  _id: string;
  name: string;
  course_name: string;
  created_at: string;
}

interface DisplaySessionsProps {
  sessions: Session[];
  totalSessions: number;
  pageNum: number;
  pageSize: number;
  setPageNum: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchKeyword: (keyword: string) => void;
  fetchSessions: (page: number, size: number, keyword: string) => void;
}

const { Search } = Input;

const DisplaySessions: React.FC<DisplaySessionsProps> = ({
  sessions,
  totalSessions,
  pageNum,
  pageSize,
  setPageNum,
  setPageSize,
  setSearchKeyword,
    fetchSessions,
}) => {

  const columns: ColumnsType<Session> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Session) => (
        <div className="flex justify-center space-x-2">
          <ButtonEdit _id={record._id} onSessionUpdated={() => fetchSessions(pageNum, pageSize, '')} />
          <ButtonDelete _id={record._id} onSessionDeleted={() => fetchSessions(pageNum, pageSize, '')} />
        </div>
      ),
      align: 'center',
    },
  ];

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1); // Reset to first page on search
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by session name"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table
        dataSource={sessions}
        columns={columns}
        rowKey="_id"
        style={{ textAlign: 'center' }}
        pagination={false}
      />
      <div className="flex justify-end mt-5">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalSessions}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={(page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
        />
      </div>
    </div>
  );
};

export default DisplaySessions;
