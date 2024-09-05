import React, { useEffect, useState, useCallback } from 'react';
import { Table, Pagination, Input } from 'antd';
import moment from 'moment';
import { getSessions, SearchOutlined } from '../../../utils/commonImports';
import { ColumnsType } from 'antd/es/table';

const { Search } = Input;

interface Session {
  _id: string;
  name: string;
  course_name: string;
  created_at: string;
}

const DisplaySessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const fetchSessions = useCallback(
    async (page: number, size: number, keyword: string) => {
   
        const searchCondition = {
          keyword,
          course_id: '',
          is_position_order: false,
          is_deleted: false,
        };
        const response = await getSessions(searchCondition, page, size);
        if (response) {
          setSessions(response.pageData);
          setTotalSessions(response.pageInfo.totalItems);
        }
     
    },
    []
  );

  useEffect(() => {
    fetchSessions(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword, fetchSessions]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1); // Reset to first page on search
  };

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
  ];

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
        columns={columns}
        dataSource={sessions}
        rowKey="_id"
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
