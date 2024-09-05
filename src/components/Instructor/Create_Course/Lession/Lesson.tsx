import React, { useState, useCallback, useEffect } from 'react';
import { getLessons } from '../../../../utils/commonImports';
import CreateLessonButton from './CreateLession';
import DisplayLesson from './DisplayLeesion';

interface Lesson {
  _id: string;
  name: string;
  course_name: string;
  lesson_type: string;
  full_time: number;
  created_at: string;
  video_url?: string;
  image_url?: string;
}

interface SearchCondition {
  keyword: string;
  course_id: string;
  session_id: string;
  lesson_type: string;
  is_position_order: boolean;
  is_deleted: boolean;
}

const LessonComponent: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [totalLessons, setTotalLessons] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const fetchLessons = useCallback(async (page: number, size: number, keyword: string) => {
    const searchCondition: SearchCondition = {
      keyword: keyword,
      course_id: '',
      session_id: '',
      lesson_type: '',
      is_position_order: false,
      is_deleted: false,
    };
    const data = await getLessons(searchCondition, page, size);
    setLessons(data.pageData); // Ensure `data.pageData` includes necessary fields
    setTotalLessons(data.pageInfo.totalItems); // Assuming `data.pageInfo` contains `totalItems`
  }, []);

  useEffect(() => {
    fetchLessons(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword, fetchLessons]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <CreateLessonButton onLessonCreated={() => fetchLessons(pageNum, pageSize, searchKeyword)} />
      </div>
      <DisplayLesson
        lessons={lessons}
        totalLessons={totalLessons}
        pageNum={pageNum}
        pageSize={pageSize}
        setPageNum={setPageNum}
        setPageSize={setPageSize}
        setSearchKeyword={setSearchKeyword}
        fetchLessons={fetchLessons}
      />
    </div>
  );
};

export default LessonComponent;
