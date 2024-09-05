import React, { useEffect, useState } from 'react';
import { Tag, Skeleton, Rate, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getPublicCourses, formatCurrency } from '../utils/commonImports';
import { useNavigate, Link } from 'react-router-dom';

interface Course {
  _id: number;
  name: string;
  category_name: string;
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

interface ApiResponse {
  pageData: Course[];
}

const PopularCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const coursesPerPage = window.innerWidth < 768 ? 1 : 4; // Number of courses to display per page

  useEffect(() => {
    const fetchCourses = async () => {
      const data = {
        searchCondition: {
          keyword: '',
          category_id: '',
          is_deleted: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 20,
        },
      };
      const response: ApiResponse = await getPublicCourses(data);
      setCourses(response.pageData);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex + coursesPerPage < courses.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleButtonClick = (courseId: number, isPurchased: boolean, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isPurchased) {
      navigate(`/course-detail/${courseId}`);
    }
  };

  const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return `${words.slice(0, wordLimit).join(' ')}...`;
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevClick}
          className={`bg-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-300 transition duration-300 ${currentIndex === 0 ? 'invisible' : 'visible'}`}
        >
          <LeftOutlined className="text-lg" />
        </button>
        <h2 className="text-3xl font-bold text-left">Popular Courses</h2>
        <button
          onClick={handleNextClick}
          className={`bg-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-300 transition duration-300 ${currentIndex + coursesPerPage >= courses.length ? 'invisible' : 'visible'}`}
        >
          <RightOutlined className="text-lg" />
        </button>
      </div>
      <div className="relative overflow-hidden">
        <div className="course-slider" style={{ transform: `translateX(-${currentIndex * (106 / coursesPerPage)}%)` }}>
          {loading ? (
            Array.from({ length: coursesPerPage }).map((_, index) => (
              <div key={index} className="course-slide">
                <Skeleton active paragraph={{ rows: 5 }} />
              </div>
            ))
          ) : (
            courses.map((course) => (
              <div key={course._id} className="course-slide">
                <Link
                  to={`/course-detail/${course._id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-2xl p-4 cursor-pointer"
                  style={{ height: '395px' }}
                >
                  <img
                    src={course.image_url}
                    alt={course.name}
                    className="w-full h-36 object-cover mb-4"
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
                    <Tooltip title={course.name}>
                      <h2 className="text-lg font-semibold mt-1 h-10 overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {truncateText(course.name, 4)}
                      </h2>
                    </Tooltip>
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
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex justify-end items-center mt-2">
        {!loading && (
          <Link
            to="/homepage/view-all-course?search="
            className="text-green-600 font-semibold"
          >
            View All
          </Link>
        )}
      </div>
    </div>
  );
};

export default PopularCourses;
