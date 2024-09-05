import React, { useEffect, useState, useCallback } from 'react';
import { Table, Rate, Input, Pagination, Button } from 'antd';
import { getReviews, getCourseById, getCurrentLogin } from '../../../utils/commonImports';
import { SearchOutlined } from '@ant-design/icons';

interface ReviewData {
  _id: string;
  course_id: string;
  reviewer_name: string;
  course_name: string;
  comment: string;
  rating: number;
  updated_at: string;
}

interface ReviewResponse {
  pageData: ReviewData[];
  pageInfo: {
    totalItems: number;
  };
}

const { Search } = Input;

const Review: React.FC = () => {
  const [filteredReviews, setFilteredReviews] = useState<ReviewData[]>([]);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const fetchCurrentUserId = async () => {
    const currentUser = await getCurrentLogin();
    setCurrentUserId(currentUser._id);
  };

  const fetchReviews = useCallback(
    async (page: number, size: number) => {
      const reviewData: ReviewResponse = await getReviews({
        searchCondition: {
          course_id: "",
          rating: 0,
          is_instructor: false,
          is_rating_order: false,
          is_deleted: false,
        },
        pageInfo: { pageNum: page, pageSize: size },
      });

      const reviewsWithCourseData = await Promise.all(
        reviewData.pageData.map(async (review) => {
          const course = await getCourseById(review.course_id);
          return { ...review, course };
        })
      );

      const filtered = reviewsWithCourseData.filter(review =>
        review.course.user_id === currentUserId &&
        review.course.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      setFilteredReviews(filtered);
      setTotalReviews(reviewData.pageInfo.totalItems);
    },
    [searchKeyword, currentUserId]
  );

  useEffect(() => {
    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchReviews(pageNum, pageSize);
    }
  }, [pageNum, pageSize, fetchReviews, currentUserId]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1);
  };

  const toggleComment = (id: string) => {
    setExpandedComments(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const renderComment = (comment: string, record: ReviewData) => {
    const isExpanded = expandedComments[record._id];
    const truncatedComment = comment.length > 100 ? `${comment.substring(0, 100)}...` : comment;

    return (
      <div>
        {isExpanded ? comment : truncatedComment}
        {comment.length > 100 && (
          <Button type='link' onClick={() => toggleComment(record._id)}>
            {isExpanded ? " Show less" : " View more"}
          </Button>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: 'Reviewer Name',
      dataIndex: 'reviewer_name',
      key: 'reviewer_name',
    },
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: renderComment,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updated_at: string) => new Date(updated_at).toLocaleString(),
    },
  ];

  return (
    <div className="container mx-auto p-4">
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
        columns={columns}
        dataSource={filteredReviews}
        rowKey="_id"
        pagination={false}
      />
      <div className="flex justify-end mt-5">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalReviews}
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

export default Review;
