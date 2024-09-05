import { React, useState, useEffect, SearchOutlined } from "../../../utils/commonImports";
import { Table, Pagination, Input } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";

const { Search } = Input;

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

interface LessonTableProps {
  lessons: Lesson[];
}

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
      <div className="flex justify-center items-center ">
        <video width="200" controls className='rounded-md'>
          <source src={record.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } else if (record.image_url) {
    return (
      <div className="flex justify-center items-center ">
        <img src={record.image_url} alt="lesson media" width="200" className='rounded-md' />
      </div>
    );
  }
  return null;
};

const LessonTable: React.FC<LessonTableProps> = ({ lessons }) => {
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalLessons, setTotalLessons] = useState<number>(lessons.length);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    const fetchLessons = async () => {
        const filteredData = lessons.filter((lesson) =>
          lesson.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredLessons(filteredData);
        setTotalLessons(filteredData.length);
    };

    fetchLessons();
  }, [searchKeyword, lessons]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1); // Reset to first page on search
  };

  const lessonColumns: ColumnsType<Lesson> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Course Name', dataIndex: 'course_name', key: 'course_name' },
    { title: 'Type', dataIndex: 'lesson_type', key: 'lesson_type' },
    { title: 'Full Time', dataIndex: 'full_time', key: 'full_time', render: (value: number) => formatFullTime(value) },
    { title: 'Created At', dataIndex: 'created_at', key: 'created_at', render: (text: string) => moment(text).format('DD-MM-YYYY') },
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
        columns={lessonColumns}
        dataSource={filteredLessons.slice((pageNum - 1) * pageSize, pageNum * pageSize)}
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

export default LessonTable;
