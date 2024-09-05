import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getItemsByStudent } from '../../utils/commonImports';

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

const PurchasedCourses: React.FC = () => {
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);


  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      const data: FetchData = {
        searchCondition: {
          purchase_no: "",
          cart_no: "",
          course_id: "",
          status: "",
          is_delete: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      };
        const response = await getItemsByStudent(data);
        setPurchasedCourses(response.pageData);
    };

    fetchPurchasedCourses();
  }, []);

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
      render: (text: string, record: Course) => (
        <Link to={`/learn-course-detail/${record.course_id}`}>{text}</Link>
      ),
    },
    {
      title: 'Purchase Number',
      dataIndex: 'purchase_no',
      key: 'purchase_no',
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
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
  ];

 

  return (
    <div>
      <Table columns={columns} dataSource={purchasedCourses} rowKey="_id" />
    </div>
  );
};

export default PurchasedCourses;
