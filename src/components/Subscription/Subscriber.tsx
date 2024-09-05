import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Pagination, Input, Row, Col } from 'antd';
import { getSubscribers, getUserData } from '../../utils/commonImports';
import { SearchOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

interface Subscriber {
    _id: string;
    subscriber_name: string;
    is_subscribed: boolean;
    subscriber_id: string;
    avatar?: string;
    phone_number?: string;
    email?: string;
}

const { Search } = Input;

const Subscriber: React.FC = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const navigate = useNavigate();

    const fetchSubscribers = useCallback(
        async (page: number, pageSize: number) => {
            const data = await getSubscribers(
                { keyword: '', is_delete: false },
                page,
                pageSize
            );
            const filteredData = data.pageData.filter((sub: Subscriber) => sub.is_subscribed);

            // Fetch user data for each subscriber using subscriber_id
            const enrichedSubscribers = await Promise.all(filteredData.map(async (sub: Subscriber) => {
                const userData = await getUserData(sub.subscriber_id);
                return {
                    ...sub,
                    avatar: userData.avatar,
                    phone_number: userData.phone_number,
                    email: userData.email
                };
            }));

            setAllSubscribers(enrichedSubscribers);
            const paginatedData = enrichedSubscribers.slice((page - 1) * pageSize, page * pageSize);
            setSubscribers(paginatedData);
            setTotalItems(enrichedSubscribers.length);
        },
        []
    );

    useEffect(() => {
        fetchSubscribers(pageNum, pageSize);
    }, [pageNum, pageSize, fetchSubscribers]);

    useEffect(() => {
        const filtered = allSubscribers.filter(sub =>
            sub.subscriber_name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        const paginatedFiltered = filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        setSubscribers(paginatedFiltered);
        setTotalItems(filtered.length);
    }, [searchKeyword, allSubscribers, pageNum, pageSize]);

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setPageNum(1); 
    };

    const handleCardClick = (id: string) => {
        navigate(`/view-profile/${id}`);
    };

    return (
        <div className="p-4">
            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search by subscriber name"
                    enterButton={<SearchOutlined />}
                    allowClear
                    size="large"
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
            </div>
            <Row gutter={16}>
                {subscribers.map(sub => (
                    <Col key={sub._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8">
                        <Card
                            hoverable
                            className="flex flex-col items-center justify-center p-6 h-full"
                            onClick={() => handleCardClick(sub.subscriber_id)}
                        >
                            <div className="flex flex-col items-center text-center">
                                <img
                                    alt="Avatar"
                                    src={sub.avatar || 'https://via.placeholder.com/150'}
                                    className="w-24 h-24 rounded-full mb-4"
                                />
                                <div className="text-xl text-center font-bold mb-2">{sub.subscriber_name}</div>
                                <div className="flex items-center text-gray-700 mb-2">
                                    <PhoneOutlined className="mr-2 text-blue-500" />
                                    <span>{sub.phone_number}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <MailOutlined className="mr-2 text-blue-500" />
                                    <span>{sub.email}</span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="flex justify-end mt-5">
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    total={totalItems}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={(page, pageSize) => {
                        setPageNum(page);
                        setPageSize(pageSize);
                        fetchSubscribers(page, pageSize);
                    }}
                    showSizeChanger
                    className="text-center"
                />
            </div>
        </div>
    );
};

export default Subscriber;
