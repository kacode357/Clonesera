import { React, useState, useEffect, useCallback, useMemo, SearchOutlined } from '../utils/commonImports';
import { Button, Table, Pagination, Modal, Input } from 'antd';
import { toast } from 'react-toastify';
import { getUsers, reviewProfileInstructor } from '../services/Api';
import { ColumnsType } from 'antd/es/table';

interface User {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    description: string;
    avatar: string;
    status: boolean;
    is_verified: boolean;
}

const { Search } = Input;

const RequestManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [comment, setComment] = useState<string>('');
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    const fetchUsers = useCallback(
        async (page: number, pageSize: number, keyword: string) => {

            const data = await getUsers(
                { keyword, role: 'instructor', status: true, is_deleted: false, is_verified: "false" },
                page,
                pageSize
            );
            const filteredData = data.pageData.filter((user: User) => !user.is_verified);
            setUsers(filteredData);
            setTotalItems(data.pageInfo.totalItems);

        },
        []
    );

    useEffect(() => {
        fetchUsers(pageNum, pageSize, searchKeyword);
    }, [pageNum, pageSize, searchKeyword, fetchUsers]);

    const handleApprove = async (userId: string) => {

        await reviewProfileInstructor({ user_id: userId, status: 'approve', comment: '' });
        fetchUsers(pageNum, pageSize, searchKeyword);

    };

    const handleReject = (userId: string) => {
        setCurrentUserId(userId);
        setIsModalOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!currentUserId) return;

        try {
            await reviewProfileInstructor({ user_id: currentUserId, status: 'reject', comment });
            setIsModalOpen(false);
            fetchUsers(pageNum, pageSize, searchKeyword);
        } catch (error) {
            toast.error('Failed to reject user');
        } finally {
            setCurrentUserId(null);
            setComment('');
        }
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setPageNum(1); // Reset to the first page on search
    };

    const columns: ColumnsType<User> = useMemo(
        () => [
            {
                title: 'Avatar',
                dataIndex: 'avatar',
                key: 'avatar',
                render: (avatar: string) => (
                    <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                ),
            },
            {
                title: 'User Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Phone',
                dataIndex: 'phone_number',
                key: 'phone_number',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Action',
                key: 'action',
                render: (record: User) => (
                    <div className="flex space-x-2">
                        <Button
                            type="default"
                            onClick={() => handleApprove(record._id)}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Approve
                        </Button>
                        <Button
                            type="default"
                            onClick={() => handleReject(record._id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Reject
                        </Button>
                    </div>
                ),
            },
        ],
        [handleApprove, handleReject]
    );

    return (
        <div className="p-6">
            <div className="flex items-center mb-4">
                <Search
                    placeholder="Search by user name or email"
                    enterButton={<SearchOutlined />}
                    allowClear
                    size="large"
                    onSearch={handleSearch}
                    className="mr-4 w-80"
                />
            </div>
            <Table
                columns={columns}
                dataSource={users.map(user => ({ ...user, key: user._id }))}
                pagination={false}
                className="mb-4"
            />
            <div className="flex justify-end mt-5">
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    total={totalItems}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={(page, pageSize) => {
                        setPageNum(page);
                        setPageSize(pageSize);
                        fetchUsers(page, pageSize, searchKeyword);
                    }}
                    showSizeChanger
                />
            </div>
            <Modal
                title="Reject Reason"
                open={isModalOpen}
                onOk={handleConfirmReject}
                onCancel={() => setIsModalOpen(false)}
            >
                <Input.TextArea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Enter reason for rejection"
                    rows={4}
                />
            </Modal>
        </div>
    );
};

export default RequestManagement;
