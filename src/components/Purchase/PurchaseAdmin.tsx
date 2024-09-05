import { React, useState, useEffect, useCallback, Table, Pagination, Input, getItemsAdmin, SearchOutlined } from '../../utils/commonImports';
import moment from 'moment';
import { getStatusTag } from '../../utils/statusTagUtils';

const { Search } = Input;

interface Course {
  _id: string;
  purchase_no: string;
  status: string;
  price_paid: number;
  price: number;
  discount: number;
  cart_id: string;
  course_id: string;
  student_id: string;
  instructor_id: string;
  created_at: string;
  is_deleted: boolean;
  cart_no: string;
  course_name: string;
  student_name: string;
  instructor_name: string;
}

interface FetchData {
  searchCondition: {
    purchase_no?: string;
    cart_no?: string;
    course_id?: string;
    status?: string;
    is_delete?: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

const Purchase: React.FC = () => {
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");


  const fetchPurchasedCourses = useCallback(
    async (page: number, size: number, keyword: string) => {
      const data: FetchData = {
        searchCondition: {
          purchase_no: keyword,
          cart_no: "",
          course_id: "",
          status: "",
          is_delete: false
        },
        pageInfo: {
          pageNum: page,
          pageSize: size
        }
      };
      const response = await getItemsAdmin(data);
      setPurchasedCourses(response.pageData);
      setTotalCourses(response.pageInfo.totalItems);

    },
    []
  );

  useEffect(() => {
    fetchPurchasedCourses(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword, fetchPurchasedCourses]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1);
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Purchase Number',
      dataIndex: 'purchase_no',
      key: 'purchase_no',
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
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      className: 'text-right',
    },
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: 'Instructor Name',
      dataIndex: 'instructor_name',
      key: 'instructor_name',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
  ];



  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by purchase number"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
          onSearch={handleSearch}
          style={{ width: 500 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={purchasedCourses}
        rowKey="_id"
        pagination={false}
      />
      <div className="flex justify-end mt-5">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalCourses}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={(page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
        />
      </div>
    </div>
  );
};

export default Purchase;
