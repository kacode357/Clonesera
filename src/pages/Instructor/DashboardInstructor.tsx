import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Pagination } from 'antd';
import { BookOutlined, UsergroupAddOutlined, AppstoreOutlined, DollarOutlined } from '@ant-design/icons';
import { getCourses, getSubscribers, getCurrentLogin } from '../../services/Api';
import { getUserData } from '../../services/Api'; // Adjust import as needed

const InstructorDashboard: React.FC = () => {
    const [totalCourses, setTotalCourses] = useState<number | null>(null);
    const [totalSubscribers, setTotalSubscribers] = useState<number | null>(null);
    const [balanceTotal, setBalanceTotal] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]); // Change `any` to a more specific type if needed
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalTransactions, setTotalTransactions] = useState<number>(0); // Total number of transactions

    useEffect(() => {
        const fetchData = async () => {
            const searchConditionCourses = {
                keyword: '',
                category: '',
                status: '',
                is_deleted: false,
            };
            const courseData = await getCourses(searchConditionCourses, 1, 10);
            setTotalCourses(courseData.pageInfo.totalItems);

            const searchConditionSubscribers = {
                keyword: '',
                is_delete: false,
            };
            const subscriberData = await getSubscribers(searchConditionSubscribers, 1, 10);
            setTotalSubscribers(subscriberData.pageInfo.totalItems);

            const currentUser = await getCurrentLogin();
            setBalanceTotal(currentUser.balance_total);

            // Fetch user data for transactions
            const userData = await getUserData(currentUser._id);
            setTotalTransactions(userData.transactions.length); // Update the total number of transactions
            setTransactions(userData.transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize));
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
            title: 'Total Courses',
            value: totalCourses,
            icon: <BookOutlined style={{ fontSize: '48px', color: '#ff85c0' }} />
        },
        {
            title: 'Total Subscribers',
            value: totalSubscribers,
            icon: <UsergroupAddOutlined style={{ fontSize: '48px', color: '#9254de' }} />
        },
        {
            title: 'Total Balance',
            value: formatNumber(balanceTotal),
            icon: <DollarOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
        }
    ];

    // Define columns for the table
    const columns = [
        {
            title: 'Payout No',
            dataIndex: 'payout_no',
            key: 'payout_no',
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Payout Amount',
            dataIndex: 'payout_amount',
            key: 'payout_amount',
            render: (amount: number) => formatNumber(amount),
            align: 'center' as 'center',
        },
    ];

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <AppstoreOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                <h2 className="text-xl font-semibold">Instructor Dashboard</h2>
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
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Latest Transactions</h3>
                <Table
                    columns={columns}
                    dataSource={transactions}
                    rowKey="_id"
                    pagination={false}
                />
                <div className="flex justify-end items-center mt-6">
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
        </div>
    );
};

export default InstructorDashboard;
