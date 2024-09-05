import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Input, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { TablePaginationConfig } from 'antd/es/table';
import { getItemsByInstructor, createPayout } from '../../utils/commonImports';
import { getStatusTag } from '../../utils/statusTagUtils';

interface PurchaseData {
  _id: string;
  purchase_no: string;
  cart_no: string;
  course_name: string;
  status: string;
  price_paid: number;
  student_name: string;
}

interface ApiResponse {
  pageData: PurchaseData[];
  pageInfo: {
    totalItems: number;
    pageNum: number;
    pageSize: number;
  };
}

const Purchase: React.FC = () => {
  const [data, setData] = useState<PurchaseData[]>([]);
  const [filteredData, setFilteredData] = useState<PurchaseData[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const fetchData = useCallback(async (pageInfo: { pageNum: number; pageSize: number }) => {
    const result: ApiResponse = await getItemsByInstructor({
      searchCondition: {
        purchase_no: '',
        cart_no: '',
        course_id: '',
        status: '',
        is_delete: false,
      },
      pageInfo,
    });
    setData(result.pageData);
    setPagination((prev) => ({
      ...prev,
      total: result.pageInfo.totalItems,
      current: result.pageInfo.pageNum,
      pageSize: result.pageInfo.pageSize,
    }));
  }, []);

  useEffect(() => {
    fetchData({
      pageNum: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });
  }, [pagination.current, pagination.pageSize, fetchData]);

  useEffect(() => {
    if (searchKeyword) {
      const keywordLower = searchKeyword.toLowerCase();
      const filtered = data.filter(item =>
        item.course_name.toLowerCase().includes(keywordLower)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchKeyword, data]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      total: pagination.total || 0,
    });
  };

  const handleSelectChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
  };

  const handleCreatePayout = async () => {
    const transactions = selectedRowKeys.map((id) => ({ purchase_id: id as string }));
    await createPayout(transactions);
    setSelectedRowKeys([]);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination({
      current: page,
      pageSize: pageSize || pagination.pageSize,
      total: pagination.total,
    });
  };

  const columns = [
    {
      title: 'Purchase No',
      dataIndex: 'purchase_no',
      key: 'purchase_no',
    },
    {
      title: 'Cart No',
      dataIndex: 'cart_no',
      key: 'cart_no',
    },
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Price Paid',
      dataIndex: 'price_paid',
      key: 'price_paid',
      className: 'text-right',
      render: (price_paid: number) => price_paid.toLocaleString(),
    },
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Search by course name"
        enterButton={<SearchOutlined />}
        allowClear
        onSearch={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button
        type="primary"
        onClick={handleCreatePayout}
        disabled={selectedRowKeys.length === 0}
        style={{ marginLeft: 10 }}
      >
        Create Payout
      </Button>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: handleSelectChange,
        }}
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        onChange={handleTableChange}
        rowKey="_id"
      />
      <div className="flex justify-end mt-5">
        <Pagination
          total={pagination.total}
          current={pagination.current}
          pageSize={pagination.pageSize}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={handlePaginationChange}
          style={{ marginTop: 16 }}
        />
      </div>
    </div>
  );
};

export default Purchase;
