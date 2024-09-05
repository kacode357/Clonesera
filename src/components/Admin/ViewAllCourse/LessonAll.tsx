import React, { useEffect, useState, useCallback } from 'react';
import { Table, Pagination, Input } from 'antd';
import moment from 'moment';
import { getLessons, SearchOutlined } from '../../../utils/commonImports';
import { ColumnsType } from 'antd/es/table';

const { Search } = Input;

interface Lesson {
  _id: string;
  name: string;
  course_id: string;
  course_name: string;
  lesson_type: string;
  full_time: number;
  created_at: string;
  video_url?: string;
  image_url?: string;
}

interface SearchCondition {
  keyword: string;
  course_id: string;
  session_id: string;
  lesson_type: string;
  is_position_order: boolean;
  is_deleted: boolean;
}

const DisplayLesson: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalLessons, setTotalLessons] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const fetchLessons = useCallback(
    async (page: number, size: number, keyword: string) => {
        const searchCondition: SearchCondition = {
          keyword,
          course_id: '',
          session_id: '',
          lesson_type: '',
          is_position_order: false,
          is_deleted: false,
        };

        const response = await getLessons(searchCondition, page, size);
        if (response) {
          setLessons(response.pageData);
          setTotalLessons(response.pageInfo.totalItems);
        }
    },
    []
  );

  useEffect(() => {
    fetchLessons(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword, fetchLessons]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1); // Reset to first page on search
  };

  const formatFullTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const renderMedia = (record: Lesson) => {
    if (record.video_url) {
      return (
        <div className="flex justify-center items-center">
          <video width="200" controls className="rounded-md">
            <source src={record.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (record.image_url) {
      return (
        <div className="flex justify-center items-center">
          <img src={record.image_url} alt="lesson media" width="200" className="rounded-md" />
        </div>
      );
    }
    return null;
  };

  const columns: ColumnsType<Lesson> = [
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
      title: 'Type',
      dataIndex: 'lesson_type',
      key: 'lesson_type',
    },
    {
      title: 'Full Time',
      dataIndex: 'full_time',
      key: 'full_time',
      render: (value: number) => formatFullTime(value),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Media',
      key: 'media',
      render: (_, record: Lesson) => renderMedia(record),
      align: 'center',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by lesson name"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={lessons}
        rowKey="_id"
        pagination={false}
      />
      <div className="flex justify-end mt-5">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalLessons}
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

export default DisplayLesson;
