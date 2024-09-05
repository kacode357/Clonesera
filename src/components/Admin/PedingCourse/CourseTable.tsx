import React, { useState, useEffect, useCallback } from "react";
import { Table, Pagination, message, Input } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { getCourses, getCourseDetail, SearchOutlined } from "../../../utils/commonImports";

const { Search } = Input;

interface Course {
  _id: string;
  name: string;
  category_name: string;
  status: string;
  price: number;
  discount: number;
  created_at: string;
  sessions?: Session[];
}

interface Session {
  _id: string;
  name: string;
}

interface CourseTableProps {
  selectedCourseIds: string[];
  onSelectionChange: (selectedCourseIds: string[]) => void;
}

const getStatusTag = (status: string) => {
  return status;
};

const CourseTable: React.FC<CourseTableProps> = ({
  selectedCourseIds,
  onSelectionChange,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const fetchCourses = useCallback(
    async (page: number, size: number, keyword: string) => {
      try {
        const data = await getCourses(
          { keyword, category: "", status: "waiting_approve", is_deleted: false },
          page,
          size
        );
        const coursesWithDetails = await Promise.all(
          data.pageData.map(async (course: Course) => {
            const courseDetail = await fetchCourseDetail(course._id);
            return { ...course, sessions: courseDetail.session_list };
          })
        );
        setCourses(coursesWithDetails);
        setTotalCourses(data.pageInfo.totalItems);
      } catch (error) {
        message.error("Error fetching courses");
        console.error("Error fetching courses:", error);
      }
    },
    []
  );

  useEffect(() => {
    fetchCourses(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword, fetchCourses]);

  const fetchCourseDetail = async (courseId: string) => {
    const data = await getCourseDetail(courseId);
    return data;
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1); // Reset to first page on search
  };

  const courseColumns: ColumnsType<Course> = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString(),
      className: 'text-right',
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      className: 'text-right',
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => moment(text).format("DD-MM-YYYY"),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      onSelectionChange(selectedRowKeys as string[]);
    },
    selectedRowKeys: selectedCourseIds,
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
      <Table
        columns={courseColumns}
        dataSource={courses}
        rowKey="_id"
        pagination={false}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
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

export default CourseTable;
