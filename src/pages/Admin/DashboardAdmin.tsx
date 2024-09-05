import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Pagination } from 'antd';
import { DollarOutlined, TagsOutlined, BookOutlined, TeamOutlined, CommentOutlined, AppstoreOutlined } from '@ant-design/icons';
import { getSettingDefault, getUsers, getCategories, getCourses, getBlogs } from '../../services/Api';

interface Transaction {
  _id: string;
  payout_id: string;
  payout_no: string;
  payout_amount: number;
  created_at: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  balance_total: number;
  transactions: Transaction[];
}

const AdminDashboard: React.FC = () => {
  const [TotalMoney, setTotalMoney] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalCategories, setTotalCategories] = useState<number | null>(null);
  const [totalCourses, setTotalCourses] = useState<number | null>(null);
  const [totalBlogs, setTotalBlogs] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const settingData = await getSettingDefault();
      setTotalMoney(settingData.balance_total);

      const searchConditionUsers = {
        keyword: '',
        role: 'all',
        status: true,
        is_deleted: false,
        is_verified: '',
      };
      const userData = await getUsers(searchConditionUsers, currentPage, pageSize);
      setTotalUsers(userData.pageInfo.totalItems);

      const searchConditionCategories = {
        keyword: '',
        category: '',
        status: '',
        is_deleted: false,
      };
      const categoryData = await getCategories(searchConditionCategories, 1, 10);
      setTotalCategories(categoryData.pageInfo.totalItems);

      const searchConditionCourses = {
        keyword: '',
        category: '',
        status: '',
        is_deleted: false,
      };
      const courseData = await getCourses(searchConditionCourses, 1, 10);
      setTotalCourses(courseData.pageInfo.totalItems);

      const searchConditionBlogs = {
        category_id: '',
        is_deleted: false,
      };
      const blogData = await getBlogs({ searchCondition: searchConditionBlogs, pageInfo: { pageNum: 1, pageSize: 10 } });
      setTotalBlogs(blogData.pageInfo.totalItems);

      const transactionsData = userData.pageData.flatMap((user: User) => user.transactions);
      setTotalTransactions(transactionsData.length);
      setTransactions(transactionsData.slice((currentPage - 1) * pageSize, currentPage * pageSize));
    };

    fetchData();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const formatNumber = (value: number | null): string | null => {
    if (value === null) return null;
    return value.toLocaleString('en-US');
  };

  const stats = [
    {
      title: 'Total Balance',
      value: formatNumber(TotalMoney),
      icon: <DollarOutlined style={{ fontSize: '48px', color: '#faad14' }} />
    },
    {
      title: 'Total Categories',
      value: totalCategories,
      icon: <TagsOutlined style={{ fontSize: '48px', color: '#9254de' }} />
    },
    {
      title: 'Total Courses',
      value: totalCourses,
      icon: <BookOutlined style={{ fontSize: '48px', color: '#ff85c0' }} />
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: <TeamOutlined style={{ fontSize: '48px', color: '#9254de' }} />
    },
    {
      title: 'Total Blogs',
      value: totalBlogs,
      icon: <CommentOutlined style={{ fontSize: '48px', color: '#9254de' }} />
    }
  ];

  const columns = [
    {
      title: 'Payout Number',
      dataIndex: 'payout_no',
      key: 'payout_no',
    },
    {
      title: 'Amount',
      dataIndex: 'payout_amount',
      key: 'payout_amount',
      render: (amount: number) => `$${amount.toLocaleString('en-US')}`,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('en-US'),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <AppstoreOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      </div>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card className="hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>{stat.icon}</div>
                <div className="text-right">
                  <div className="text-xl mb-4">{stat.title}</div>
                  <div className="text-xl font-bold">{stat.value}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Latest Transactions</h2>
        <Table
          dataSource={transactions}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />
        <Pagination
          size="small"
          total={totalTransactions}
          current={currentPage}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger
          showTotal={(total) => `Total ${total} items`}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
