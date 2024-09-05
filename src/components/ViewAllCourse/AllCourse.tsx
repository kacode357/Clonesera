import React, { useEffect, useState } from 'react';
import { Tag, Skeleton, Rate, Button, Input, Pagination, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getPublicCourses, NT_getCategoriesClient, formatCurrency } from '../../utils/commonImports';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

interface Course {
  _id: number;
  name: string;
  category_name: string;
  category_id: string;
  instructor_name: string;
  description: string;
  image_url: string;
  price_paid: number;
  lesson_count: number;
  session_count: number;
  full_time: number;
  average_rating: number;
  is_purchased: boolean;
}

interface Category {
  _id: string;
  name: string;
}

interface ApiResponse<T> {
  pageData: T[];
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

const AllCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchCategories = async () => {
    const data = {
      searchCondition: {
        keyword: '',
        is_delete: false,
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 1000,
      },
    };
    const response: ApiResponse<Category> = await NT_getCategoriesClient(data);
    setCategories(response.pageData);
  };

  const fetchCourses = async (keyword: string, categoryId: string | null, pageNum: number, pageSize: number) => {
    try {
      setLoading(true);  
      const data = {
        searchCondition: {
          keyword,
          category_id: categoryId || '',
          is_deleted: false,
        },
        pageInfo: {
          pageNum,
          pageSize,
        },
      };
      const response: ApiResponse<Course> = await getPublicCourses(data);
      setCourses(response.pageData);
      setTotalItems(response.pageInfo.totalItems);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const keyword = searchParams.get('search') || '';
    setSearchKeyword(keyword);
    fetchCourses(keyword, selectedCategory, currentPage, pageSize);
  }, [selectedCategory, searchParams, currentPage, pageSize]);

  const handleSearch = (value: string) => {
    navigate(`/homepage/view-all-course?search=${value}`);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchKeyword('');
    setCurrentPage(1);
    navigate(`/homepage/view-all-course`);
    fetchCourses('', null, 1, pageSize);
  };

  const handleButtonClick = (courseId: number, isPurchased: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPurchased) {
      console.log('Buy course', courseId);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-left mb-6">All Courses</h2>
      <div className="flex justify-start items-center mb-4 space-x-2">
        <Search
          placeholder="Search courses"
          enterButton
          onSearch={handleSearch}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
        <Button icon={<ReloadOutlined />} onClick={resetFilters} />
        <Select
          style={{ width: 200 }}
          placeholder="Select a category"
          onChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
          allowClear
          showSearch
          filterOption={(input, option) =>
            option?.children
              ? option.children.toString().toLowerCase().includes(input.toLowerCase())
              : false
          }
        >
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: pageSize }).map((_, index) => (
            <Skeleton key={index} active paragraph={{ rows: 5 }} />
          ))
        ) : courses.length === 0 ? (
          <div className="col-span-4 text-center text-gray-500 text-lg">No data with search keyword</div>
        ) : (
          courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              style={{ height: '360px', width: '340px' }}
              onClick={() => navigate(`/course-detail/${course._id}`)} 
            >
              <img
                src={course.image_url}
                alt={course.name}
                className="w-full h-40 object-cover"
              />
              <div className="flex items-center mt-2 space-x-2 ml-2">
                <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                  <span className="text-gray-500 text-sm">{course.session_count} Session</span>
                </div>
                <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                  <span className="text-gray-500 text-sm">{course.lesson_count} Lessons</span>
                </div>
                <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                  <span className="text-gray-500 text-sm">
                    {course.full_time > 0
                      ? `${Math.floor(course.full_time / 60)}h ${course.full_time % 60}m`
                      : '0h 0m'}
                  </span>
                </div>
              </div>
              <div className="p-2 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mt-1 h-10 overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {course.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  <Tag color="blue">
                    {course.category_name || 'Default Category'}
                  </Tag>
                </p>
                <div className="flex items-center mb-2">
                  <p className="text-sm text-gray-700">
                    <strong>{course.instructor_name}</strong>
                  </p>
                </div>
                <Rate disabled defaultValue={course.average_rating} allowHalf style={{ fontSize: 16 }} />
                <div className="flex items-center justify-between mt-auto mb-2">
                  <div className="text-lg font-semibold text-green-600">
                    <span className="text-xl">
                      {course.price_paid === 0 ? 'Free' : formatCurrency(course.price_paid)}
                    </span>
                    <span className="text-sm text-gray-500 ml-2"></span>
                  </div>
                  <button
                    onClick={(e) => handleButtonClick(course._id, course.is_purchased, e)}
                    className={`py-1 px-2 rounded-md transition duration-300 ${course.is_purchased ? 'bg-green-600 text-white hover:bg-green-800' : 'bg-red-500 text-white hover:bg-red-600'}`}
                  >
                    {course.is_purchased ? 'Purchased' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-end items-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
            fetchCourses(searchKeyword, selectedCategory, page, pageSize);
          }}
          showSizeChanger
          className="text-center"
        />
      </div>
    </div>
  );
};

export default AllCourse;
