import React, { useEffect, useState } from 'react';
import { Table, Spin, message } from 'antd';
import { getPayouts } from '../services/Api';

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

interface TransactionDetailProps {
  payoutId: string | null;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ payoutId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (payoutId) {
      const fetchData = async () => {
        const result: ApiResponse = await getPayouts({
          searchCondition: {
            payout_no: '',
            instructor_id: '',
            status: '',
            is_instructor: false,
            is_delete: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10,
          }
        });

        const payout = result.pageData.find(payout => payout._id === payoutId);

        if (payout) {
          setTransactions(payout.transactions);
        } else {
          message.error('Payout not found');
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [payoutId]);

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      className: 'text-right',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      className: 'text-right',
      render: (value: number) => `${value}%`,
    },
    {
      title: 'Price Paid',
      dataIndex: 'price_paid',
      key: 'price_paid',
      className: 'text-right',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Purchase ID',
      dataIndex: 'purchase_id',
      key: 'purchase_id',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="_id"
          pagination={false}
        />
      )}
    </div>
  );
};

export default TransactionDetail;
