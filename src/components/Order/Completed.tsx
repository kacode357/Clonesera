import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Button, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getItemsByStudent } from '../../utils/commonImports';
import moment from 'moment';
import { Link } from 'react-router-dom';

interface Course {
  _id: string;
  purchase_no: string;
  status: string;
  price_paid: number;
  price: number;
  discount: number;
  cart_id: string;
  course_id: string;
  student_id: string;
  instructor_id: string;
  created_at: string;
  is_deleted: boolean;
  cart_no: string;
  course_name: string;
  student_name: string;
  instructor_name: string;
}

interface FetchData {
  searchCondition: {
    purchase_no: string;
    cart_no: string;
    course_id: string;
    status: string;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

const { Search } = Input;

const Completed: React.FC = () => {
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const fetchPurchasedCourses = useCallback(async (page: number, size: number, keyword: string) => {
    const data: FetchData = {
      searchCondition: {
        purchase_no: keyword,
        cart_no: '',
        course_id: '',
        status: '',
        is_delete: false,
      },
      pageInfo: {
        pageNum: page,
        pageSize: size,
      },
    };

    const response = await getItemsByStudent(data);
    setPurchasedCourses(response.pageData);
    setTotalItems(response.pageInfo.totalItems);
  }, []);

  useEffect(() => {
    fetchPurchasedCourses(pageNum, pageSize, searchKeyword).catch();
  }, [pageNum, pageSize, searchKeyword, fetchPurchasedCourses]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPageNum(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
      render: (text: string, record: Course) => (
        <Button type="link">
          <Link to={`/course-detail/${record.course_id}`}>{text}</Link>
        </Button>
      ),
    },
    {
      title: 'Purchase Number',
      dataIndex: 'purchase_no',
      key: 'purchase_no',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: 'Instructor Name',
      dataIndex: 'instructor_name',
      key: 'instructor_name',
    },
    {
      title: 'Price Paid',
      dataIndex: 'price_paid',
      key: 'price_paid',
      className: 'text-right',
      render: (price_paid: number) => price_paid.toLocaleString(),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      className: 'text-right',
    },
  ];



  return (
    <div>
      <div className="flex items-center mb-4">
        <Search
          placeholder="Search by purchase number"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
          onSearch={handleSearch}
          className="w-80"
        />
      </div>
      <Table
        columns={columns}
        dataSource={purchasedCourses}
        rowKey="_id"
        pagination={false}
      />
      <div className="flex justify-end mt-5">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={handlePageChange}
          showSizeChanger
        />
      </div>
    </div>
  );
};

export default Completed;
