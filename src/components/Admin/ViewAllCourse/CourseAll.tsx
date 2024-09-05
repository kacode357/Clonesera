import React, { useEffect, useState, useCallback } from "react";
import { Table, Pagination, Input } from "antd";
import { ColumnsType } from "antd/es/table";
import { getCourses, SearchOutlined } from "../../../utils/commonImports";
import moment from "moment";
import { getStatusTag } from "../../../utils/statusTagUtils";

const { Search } = Input;

interface Course {
  _id: string;
  name: string;
  category_name: string;
  status: string;
  price: number;
  discount: number;
  created_at: string;
}

const CourseTable: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const fetchCourses = useCallback(
    async (page: number, size: number, keyword: string) => {
        const searchCondition = {
          keyword,
          category: "",
          status: "",
          is_deleted: false,
        };
        const response = await getCourses(searchCondition, page, size);
        if (response) {
          setCourses(response.pageData);
          setTotalCourses(response.pageInfo.totalItems);
        }
    },
    []
  );

  useEffect(() => {
    fetchCourses(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword, fetchCourses]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1); 
  };

  const columns: ColumnsType<Course> = [
    {
      title: <div className="center-header">Name</div>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <div className="center-header">Category Name</div>,
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: <div className="center-header">Status</div>,
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
    },
    {
      title: <div className="center-header">Price</div>,
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString(),
      className: 'text-right',
    },
    {
      title: <div className="center-header">Discount</div>,
      dataIndex: "discount",
      key: "discount",
      className: 'text-right',
    },
    {
      title: <div className="center-header">Created At</div>,
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => moment(text).format("DD-MM-YYYY"),
    },
  ];

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
        columns={columns}
        dataSource={courses}
        rowKey="_id"
        pagination={false}
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
