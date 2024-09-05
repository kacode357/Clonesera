import { React, useEffect, useState, useCallback, SearchOutlined, Table, Button, Modal, Input, Pagination } from '../../../utils/commonImports';
import { TablePaginationConfig } from 'antd/lib/table';
import { getPayouts, updatePayout } from '../../../services/Api';
import { toast } from 'react-toastify';
import TransactionDetail from '../../../pages/TransactionDetail';

interface Transaction {
    _id: string;
    price: number;
    discount: number;
    price_paid: number;
    purchase_id: string;
    created_at: string;
}

interface PayoutData {
    _id: string;
    payout_no: string;
    status: string;
    transactions: Transaction[];
    instructor_id: string;
    balance_origin: number;
    balance_instructor_paid: number;
    balance_instructor_received: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    instructor_name: string;
    instructor_email: string;
}

interface ApiResponse {
    pageData: PayoutData[];
    pageInfo: {
        pageNum: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
}

const { Search } = Input;

const RequestPaid: React.FC = () => {
    const [data, setData] = useState<PayoutData[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectComment, setRejectComment] = useState('');
    const [currentPayoutId, setCurrentPayoutId] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [transactionModalVisible, setTransactionModalVisible] = useState(false); // State to control transaction modal visibility
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null); // State to store selected transaction ID

    const fetchData = useCallback(async (pageInfo: { pageNum: number; pageSize: number }, keyword: string) => {
        try {
            const result: ApiResponse = await getPayouts({
                searchCondition: {
                    payout_no: keyword,
                    instructor_id: '',
                    status: 'request_payout',
                    is_instructor: false,
                    is_delete: false,
                },
                pageInfo
            });

            setData(result.pageData);
            setPagination({
                ...pagination,
                total: result.pageInfo.totalItems,
                current: pageInfo.pageNum,
                pageSize: pageInfo.pageSize,
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData({
            pageNum: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
        }, searchKeyword);
    }, [pagination.current, pagination.pageSize, searchKeyword, fetchData]);

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setPagination(pagination);
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setPagination({
            ...pagination,
            current: 1,
        });
    };

    const handleApprove = async (payoutId: string) => {
        try {
            await updatePayout(payoutId, {
                status: 'completed',
                comment: ''
            });
            toast.success('Payout approved successfully');
            fetchData({
                pageNum: pagination.current || 1,
                pageSize: pagination.pageSize || 10,
            }, searchKeyword);
        } catch (error) {
            toast.error('Failed to approve payout');
            console.error('Failed to approve payout:', error);
        }
    };

    const handleRejectClick = (payoutId: string) => {
        setCurrentPayoutId(payoutId);
        setRejectModalVisible(true);
    };

    const handleReject = async () => {
        if (!currentPayoutId) return;

        try {
            await updatePayout(currentPayoutId, {
                status: 'rejected',
                comment: rejectComment
            });
            toast.success('Payout rejected successfully');
            fetchData({
                pageNum: pagination.current || 1,
                pageSize: pagination.pageSize || 10,
            }, searchKeyword);
            setRejectModalVisible(false);
            setRejectComment('');
        } catch (error) {
            toast.error('Failed to reject payout');
            console.error('Failed to reject payout:', error);
        }
    };

    const handleViewTransaction = (transactionId: string) => {
        setSelectedTransactionId(transactionId);
        setTransactionModalVisible(true);
    };

    const handleTransactionModalClose = () => {
        setTransactionModalVisible(false);
        setSelectedTransactionId(null);
    };

    const columns = [
        {
            title: 'Payout No',
            dataIndex: 'payout_no',
            key: 'payout_no',
        },
        {
            title: 'Instructor Name',
            dataIndex: 'instructor_name',
            key: 'instructor_name',
        },
        {
            title: 'Transaction',
            key: 'transaction_id',
            render: (record: PayoutData) => (
                <Button type='link' onClick={() => handleViewTransaction(record._id)}>
                    View
                </Button>
            ),
        },
        {
            title: 'Balance Origin',
            dataIndex: 'balance_origin',
            key: 'balance_origin',
            render: (balance_origin: number) => balance_origin.toLocaleString(),
            className: 'text-right',
        },
        {
            title: 'Balance Instructor Paid',
            dataIndex: 'balance_instructor_paid',
            key: 'balance_instructor_paid',
            render: (balance_instructor_paid: number) => balance_instructor_paid.toLocaleString(),
            className: 'text-right',
        },
        {
            title: 'Balance Instructor Received',
            dataIndex: 'balance_instructor_received',
            key: 'balance_instructor_received',
            render: (balance_instructor_received: number) => balance_instructor_received.toLocaleString(),
            className: 'text-right',
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: PayoutData) => (
                <div className="flex space-x-2">
                    <Button type="primary" onClick={() => handleApprove(record._id)}>
                        Approve
                    </Button>
                    <Button type="default" onClick={() => handleRejectClick(record._id)}>
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center mb-4">
                <Search
                    placeholder="Search by payout number"
                    enterButton={<SearchOutlined />}
                    allowClear
                    size="large"
                    onSearch={handleSearch}
                    className="mr-4 w-80"
                />
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                onChange={handleTableChange}
                rowKey="_id"
            />
            <div className="flex justify-end mt-5">
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={(page, pageSize) => {
                        setPagination({
                            ...pagination,
                            current: page,
                            pageSize: pageSize,
                        });
                    }}
                    showSizeChanger
                />
            </div>
            <Modal
                title="Reject Payout"
                visible={rejectModalVisible}
                onOk={handleReject}
                onCancel={() => setRejectModalVisible(false)}
            >
                <Input.TextArea
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="Enter the reason for rejection"
                    rows={4}
                />
            </Modal>
            <Modal
                title="Transaction Details"
                visible={transactionModalVisible}
                onCancel={handleTransactionModalClose}
                footer={null}
                width={1000} 
            >
                {selectedTransactionId && <TransactionDetail payoutId={selectedTransactionId} />}
            </Modal>
        </div>
    );
};

export default RequestPaid;
