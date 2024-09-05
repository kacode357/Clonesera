import React from 'react';
import { Table, Pagination, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import UpdateLesson from './EditLesson';
import DeleteLesson from './DeleteLesson';
import type { ColumnsType } from 'antd/es/table';

interface Lesson {
  _id: string;
  name: string;
  course_name: string;
  lesson_type: string;
  full_time: number;
  created_at: string;
  video_url?: string;
  image_url?: string;
}

interface DisplayLessonProps {
  lessons: Lesson[];
  totalLessons: number;
  pageNum: number;
  pageSize: number;
  setPageNum: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchKeyword: (keyword: string) => void;
  fetchLessons: (page: number, size: number, keyword: string) => void;
}

const { Search } = Input;

const DisplayLesson: React.FC<DisplayLessonProps> = ({
  lessons,
  totalLessons,
  pageNum,
  pageSize,
  setPageNum,
  setPageSize,
  setSearchKeyword,
  fetchLessons,
}) => {

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
          <video width="200" controls className='rounded-md'>
            <source src={record.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (record.image_url) {
      return (
        <div className="flex justify-center items-center">
          <img src={record.image_url} alt="lesson media" width="200" className='rounded-md' />
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Lesson) => (
        <div className="flex space-x-2">
          <UpdateLesson lesson_id={record._id} onLessonUpdated={() => fetchLessons(pageNum, pageSize, '')} />
          <DeleteLesson lesson_id={record._id} onLessonDeleted={() => fetchLessons(pageNum, pageSize, '')} />
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
          placeholder="Search by lesson name"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table
        dataSource={lessons}
        columns={columns}
        rowKey="_id"
        style={{ textAlign: 'center' }}
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
