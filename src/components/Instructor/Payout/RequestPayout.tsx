import { React, useEffect, useState, useCallback, SearchOutlined, Table, Button, Pagination, Input, Modal } from '../../../utils/commonImports';
// import { Link } from 'react-router-dom';
import { getPayouts, updatePayout } from '../../../services/Api';
import { toast } from 'react-toastify';
import { getStatusTag } from '../../../utils/statusTagUtils';
import TransactionDetail from '../../../pages/TransactionDetail';

interface Transaction {
    _id: string; // Transaction ID
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

const RequestPayout: React.FC = () => {
    const [data, setData] = useState<PayoutData[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPayouts, setTotalPayouts] = useState<number>(0);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);

    const fetchData = useCallback(async (page: number, size: number, keyword: string) => {
        const result: ApiResponse = await getPayouts({
            searchCondition: {
                payout_no: keyword,
                instructor_id: '',
                status: '',
                is_instructor: false,
                is_delete: false
            },
            pageInfo: {
                pageNum: page,
                pageSize: size
            }
        });
        const filteredData = result.pageData.filter(payout =>
            payout.status === 'new' || payout.status === 'rejected' || payout.status === 'request_payout'
        );
        setData(filteredData);
        setTotalPayouts(result.pageInfo.totalItems);
    }, []);

    useEffect(() => {
        fetchData(pageNum, pageSize, searchKeyword);
    }, [pageNum, pageSize, searchKeyword, fetchData]);

    const handleSelectChange = (selectedKeys: React.Key[]) => {
        setSelectedRowKeys(selectedKeys);
    };

    const handleRequestPayout = async () => {
        const selectedPayouts = selectedRowKeys.map(key => key.toString());
        for (const payoutId of selectedPayouts) {
            await updatePayout(payoutId, {
                status: 'request_payout',
                comment: ''
            });
        }
        toast.success('Payout request successfully. Please wait admin for approval!');
        fetchData(pageNum, pageSize, searchKeyword);
        setSelectedRowKeys([]);
    };

    const handleViewClick = (id: string) => {
        setSelectedPayoutId(id);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'Payout No',
            dataIndex: 'payout_no',
            key: 'payout_no',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => getStatusTag(status),
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at: string) => new Date(created_at).toLocaleDateString(),
        },
        {
            title: 'Transaction ID',
            key: 'transaction_id',
            render: (record: PayoutData) => (
                <Button type="link" onClick={() => handleViewClick(record._id)}>
                    View
                </Button>
            ),
        },
        {
            title: 'Balance Origin',
            dataIndex: 'balance_origin',
            key: 'balance_origin',
            className: 'text-right',
            render: (balance_origin: number) => balance_origin.toLocaleString(),
        },
        {
            title: 'Balance Instructor Paid',
            dataIndex: 'balance_instructor_paid',
            key: 'balance_instructor_paid',
            className: 'text-right',
            render: (balance_instructor_paid: number) => balance_instructor_paid.toLocaleString(),
        },
        {
            title: 'Balance Instructor Received',
            dataIndex: 'balance_instructor_received',
            key: 'balance_instructor_received',
            className: 'text-right',
            render: (balance_instructor_received: number) => balance_instructor_received.toLocaleString(),
        },
    ];

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setPageNum(1);
    };

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
                <Button
                    type="primary"
                    onClick={handleRequestPayout}
                    disabled={selectedRowKeys.length === 0}
                >
                    Request Payout
                </Button>
            </div>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: handleSelectChange,
                }}
                columns={columns}
                dataSource={data}
                rowKey="_id"
                pagination={false}
            />
            <div className="flex justify-end mt-5">
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    total={totalPayouts}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={(page, pageSize) => {
                        setPageNum(page);
                        setPageSize(pageSize);
                    }}
                    showSizeChanger
                />
            </div>
            <Modal
                title="Transaction Details"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1000}
            >
                {selectedPayoutId && <TransactionDetail payoutId={selectedPayoutId} />}
            </Modal>
        </div>
    );
};

export default RequestPayout;
