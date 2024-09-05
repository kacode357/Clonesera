import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, message, Select, Button, Input, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getCourses, changeCourseStatus } from '../../../../utils/commonImports';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import EditButton from './EditCourse';
import DeleteButton from './DeleteCourse';
import { getStatusTag } from '../../../../utils/statusTagUtils';

const { Option } = Select;
const { Search } = Input;

interface Course {
  _id: number;
  name: string;
  category_name: string;
  status: string;
  price: number;
  discount: number;
  created_at: string;
}

interface CourseTableProps {
  setSelectedCourseIds: React.Dispatch<React.SetStateAction<number[]>>;
  refreshFlag: boolean;
  refreshCourses: () => void;
}

const CourseTable: React.FC<CourseTableProps> = ({ setSelectedCourseIds, refreshFlag, refreshCourses }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchCourses = useCallback(
    async (keyword: string, page: number, pageSize: number) => {
      const searchCondition = {
        keyword: keyword,
        category: '',
        status: '',
        is_deleted: false,
      };
      const response = await getCourses(searchCondition, page, pageSize);
      setCourses(response.pageData);
      setTotalItems(response.pageInfo.totalItems);
    },
    []
  );

  useEffect(() => {
    fetchCourses(searchKeyword, pageNum, pageSize);
  }, [searchKeyword, pageNum, pageSize, fetchCourses, refreshFlag]);

  useEffect(() => {
    setSelectedCourseIds(selectedRowKeys);
  }, [selectedRowKeys, setSelectedCourseIds]);

  const handleChangeStatus = async (courseId: number, newStatus: string) => {
    await changeCourseStatus({ course_id: courseId.toString(), new_status: newStatus });
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course._id === courseId ? { ...course, status: newStatus } : course
      )
    );
  };

  const renderActions = (record: Course) => (
    <div className="flex space-x-2">
      <EditButton courseId={record._id} refreshCourses={refreshCourses} />
      <DeleteButton courseId={record._id} refreshCourses={refreshCourses} />
    </div>
  );

  const renderStatusChange = (record: Course) => {
    const isWaitingApprove = ['new', 'waiting_approve'].includes(record.status);

    return isWaitingApprove ? (
      <Button
        type="primary"
        onClick={() => message.info('Click here Send to admin to send to admin for approval')}
      >
        Waiting approval
      </Button>
    ) : (
      <Select
        defaultValue={record.status}
        style={{ width: 140 }}
        onChange={(value) => handleChangeStatus(record._id, value)}
      >
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
      </Select>
    );
  };

  const columns: ColumnsType<Course> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Category Name',
        dataIndex: 'category_name',
        key: 'category_name',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: getStatusTag,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => price.toLocaleString(),
      },
      {
        title: 'Discount',
        dataIndex: 'discount',
        key: 'discount',
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text: string) => moment(text).format('DD-MM-YYYY'),
      },
      {
        title: 'Change Status',
        key: 'change_status',
        render: (_, record) => renderStatusChange(record),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => renderActions(record),
      },
    ],
    [renderActions, renderStatusChange]
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys as number[]);
    },
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by course name"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={courses}
        rowKey="_id"
        pagination={false}
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
            fetchCourses(searchKeyword, page, pageSize);
          }}
          showSizeChanger
        />
      </div>
    </>
  );
};

export default CourseTable;
