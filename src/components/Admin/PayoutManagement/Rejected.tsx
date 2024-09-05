import { React, useEffect, useState, useCallback, SearchOutlined, Table, Pagination, Input, Modal, Button } from '../../../utils/commonImports';
import { getPayouts } from '../../../services/Api';
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

const Rejected: React.FC = () => {
    const [data, setData] = useState<PayoutData[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);

    const fetchData = useCallback(async (pageInfo: { pageNum: number; pageSize: number }, keyword: string) => {
        const result: ApiResponse = await getPayouts({
            searchCondition: {
                payout_no: keyword,
                instructor_id: '',
                status: 'rejected',
                is_instructor: false,
                is_delete: false,
            },
            pageInfo
        });

        setData(result.pageData);
        setTotal(result.pageInfo.totalItems);
    }, []);

    useEffect(() => {
        fetchData({
            pageNum: current,
            pageSize
        }, searchKeyword);
    }, [current, pageSize, searchKeyword, fetchData]);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrent(page);
        if (pageSize) setPageSize(pageSize);
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setCurrent(1); // Reset to the first page on search
    };

    const handleViewTransaction = (payoutId: string) => {
        setSelectedPayoutId(payoutId);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedPayoutId(null);
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
                rowKey="_id"
            />
            <div className="flex justify-end mt-5">
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    showTotal={(total) => `Total ${total} items`}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    showSizeChanger
                />
            </div>
            <Modal
                title="Transaction Details"
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={1000} 
            >
                {selectedPayoutId && <TransactionDetail payoutId={selectedPayoutId} />}
            </Modal>
        </div>
    );
};

export default Rejected;
