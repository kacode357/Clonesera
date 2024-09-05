import React, { useEffect, useState, useCallback } from "react";
import { Table, Pagination, Input } from "antd";
import { getCourses, getCourseLogs, SearchOutlined } from "../../../utils/commonImports";
import { getStatusTag } from "../../../utils/statusTagUtils";

interface Course {
  _id: string;
  name: string;
  category: string;
  status: string;
  is_deleted: boolean;
}

interface Log {
  _id: string;
  course_id: string;
  old_status: string;
  new_status: string;
  comment: string;
}

const { Search } = Input;

const LogCourse: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const fetchCoursesAndLogs = useCallback(
    async (page: number, size: number, keyword: string) => {
      const coursesData = await getCourses(
        { keyword, category: "", status: "", is_deleted: false },
        page,
        size
      );
      if (coursesData && coursesData.pageData) {
        setCourses(coursesData.pageData);
        setTotalCourses(coursesData.pageInfo.totalItems);
        const courseIds: string[] = coursesData.pageData.map(
          (course: Course) => course._id
        );
        const logsDataPromises = courseIds.map((courseId: string) =>
          getCourseLogs({
            searchCondition: { course_id: courseId },
            pageInfo: { pageNum: 1, pageSize: size },
          })
        );
        const logsDataArray = await Promise.all(logsDataPromises);
        const allLogs = logsDataArray.flatMap((logData) => logData.pageData);
        setLogs(allLogs);
      }
    },
    []
  );

  useEffect(() => {
    fetchCoursesAndLogs(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword, fetchCoursesAndLogs]);

  const getCourseName = (courseId: string) => {
    const course = courses.find((course) => course._id === courseId);
    return course ? course.name : "Unknown";
  };

  const columns = [
    {
      title: "Course Name",
      dataIndex: "course_id",
      key: "course_id",
      render: (text: string) => getCourseName(text),
    },
    {
      title: "Old Status",
      dataIndex: "old_status",
      key: "old_status",
      render: (text: string) => getStatusTag(text),
    },
    {
      title: "New Status",
      dataIndex: "new_status",
      key: "new_status",
      render: (text: string) => getStatusTag(text),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
  ];

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1); 
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by course name"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table columns={columns} dataSource={logs} rowKey="_id" pagination={false} />
      <div className="flex justify-end mt-5">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalCourses}
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

export default LogCourse;
