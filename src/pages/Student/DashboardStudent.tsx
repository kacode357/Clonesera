import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { BookOutlined, UsergroupAddOutlined, AppstoreOutlined } from '@ant-design/icons';
import { getItemsByStudent, getSubscribeds } from '../../services/Api';

const StudentDashboard: React.FC = () => {
    const [totalPurchasedCourses, setTotalPurchasedCourses] = useState<number | null>(null);
    const [totalSubscribed, setTotalSubscribed] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const searchConditionPurchasedCourses = {
                purchase_no: '',
                cart_no: '',
                course_id: '',
                status: '',
                is_delete: false,
            };
            const pageInfo = { pageNum: 1, pageSize: 10 };
            const purchasedCoursesData = await getItemsByStudent({ searchCondition: searchConditionPurchasedCourses, pageInfo });
            setTotalPurchasedCourses(purchasedCoursesData.pageInfo.totalItems);
            
            const searchConditionSubscriptions = {
                keyword: '',
                is_delete: false,
            };
            const subscriptionsData = await getSubscribeds(searchConditionSubscriptions, 1, 10);
            setTotalSubscribed(subscriptionsData.pageInfo.totalItems);
        };

        fetchData();
    }, []);

    const stats = [
        {
            title: 'Purchased Courses',
            value: totalPurchasedCourses,
            icon: <BookOutlined style={{ fontSize: '48px', color: '#ff85c0' }} />
        },
        {
            title: 'Subscribed',
            value: totalSubscribed,
            icon: <UsergroupAddOutlined style={{ fontSize: '48px', color: '#9254de' }} />
        }
    ];

    return (
        <div className="p-4">
            <div className="flex items-center mb-2">
                <AppstoreOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                <h2 className="text-xl font-semibold">Student Dashboard</h2>
            </div>
            <Row gutter={[16, 16]} className="mt-0">
                {stats.map((stat, index) => (
                    <Col key={index} xs={24} sm={12} lg={6}>
                        <Card className="hover:shadow-md">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="mb-4 md:mb-0">{stat.icon}</div>
                                <div className="text-center md:text-right">
                                    <div className="text-lg mb-2 md:mb-4">{stat.title}</div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default StudentDashboard;
