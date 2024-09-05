import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Pagination, Input } from 'antd';
import { toast } from 'react-toastify';
import { getSubscribeds, updateSubscribed, getUserData } from '../../utils/commonImports';
import { SearchOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

interface Subscribed {
    _id: string;
    instructor_name: string;
    instructor_id: string;
    is_subscribed: boolean;
    avatar?: string;
    phone_number?: string;
    email?: string;
}

const { Search } = Input;

const Subscribed: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscribed[]>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [allSubscriptions, setAllSubscriptions] = useState<Subscribed[]>([]);
    const navigate = useNavigate();

    const fetchSubscriptions = useCallback(
        async (page: number, pageSize: number) => {
            const data = await getSubscribeds(
                { keyword: '', is_delete: false },
                page,
                pageSize
            );
            const filteredData = data.pageData.filter((sub: Subscribed) => sub.is_subscribed);

            const detailedSubscriptions = await Promise.all(filteredData.map(async (sub: Subscribed) => {
                const userData = await getUserData(sub.instructor_id);
                return {
                    ...sub,
                    avatar: userData.avatar,
                    phone_number: userData.phone_number,
                    email: userData.email,
                };
            }));

            setAllSubscriptions(detailedSubscriptions);
            const paginatedData = detailedSubscriptions.slice((page - 1) * pageSize, page * pageSize);
            setSubscriptions(paginatedData);
            setTotalItems(detailedSubscriptions.length);
        },
        []
    );

    useEffect(() => {
        fetchSubscriptions(pageNum, pageSize);
    }, [pageNum, pageSize, fetchSubscriptions]);

    useEffect(() => {
        const filtered = allSubscriptions.filter(sub =>
            sub.instructor_name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setSubscriptions(filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize));
        setTotalItems(filtered.length);
        setPageNum(1);
    }, [searchKeyword, allSubscriptions, pageNum, pageSize]);

    const handleSubscribeToggle = async (instructor_id: string, is_subscribed: boolean) => {
        await updateSubscribed(instructor_id);
        toast.success(is_subscribed ? 'Unsubscribed successfully' : 'Subscribed successfully');
        setAllSubscriptions(prev =>
            prev.map((sub: Subscribed) =>
                sub.instructor_id === instructor_id
                    ? { ...sub, is_subscribed: !is_subscribed }
                    : sub
            )
        );
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setPageNum(1); // Reset to the first page on search
    };

    const handleCardClick = (id: string) => {
        navigate(`/view-profile/${id}`); // Navigate to ViewProfile with instructor_id
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-4">
                <Search
                    placeholder="Search by instructor name"
                    enterButton={<SearchOutlined />}
                    allowClear
                    size="large"
                    onSearch={handleSearch}
                    style={{ width: '100%', maxWidth: 300 }}
                />
            </div>
            <div className="flex flex-wrap -mx-2">
                {subscriptions.map(sub => (
                    <div key={sub._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
                        <Card
                            hoverable
                            className="flex flex-col items-center justify-center p-6 h-full"
                            onClick={() => handleCardClick(sub.instructor_id)}
                        >
                            <div className="flex justify-center items-center mb-4">
                                <img
                                    alt="avatar"
                                    src={sub.avatar}
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-base sm:text-lg text-center font-semibold">{sub.instructor_name}</h3>
                                <div className="flex items-center mt-2 text-sm">
                                    <PhoneOutlined className="mr-2 text-blue-500" />
                                    <span>{sub.phone_number}</span>
                                </div>
                                <div className="flex items-center mt-1 text-sm">
                                    <MailOutlined className="mr-2 text-blue-500" />
                                    <span>{sub.email}</span>
                                </div>
                                <Button
                                    type="default"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubscribeToggle(sub.instructor_id, sub.is_subscribed);
                                    }}
                                    className={`mt-4 ${sub.is_subscribed ? 'text-red-500 hover:text-red-700' : 'text-blue-500 hover:text-blue-700'}`}
                                >
                                    {sub.is_subscribed ? 'Unsubscribe' : 'Subscribe'}
                                </Button>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-5">
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    total={totalItems}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={(page, pageSize) => {
                        setPageNum(page);
                        setPageSize(pageSize);
                        fetchSubscriptions(page, pageSize);
                    }}
                    showSizeChanger
                />
            </div>
        </div>
    );
};

export default Subscribed;
