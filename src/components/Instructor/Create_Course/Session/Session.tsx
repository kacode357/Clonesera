import React, { useState, useEffect, useCallback } from 'react';
import { getSessions } from '../../../../utils/commonImports';
import AddSession from './CreateSession';
import DisplaySessions from './DisplaySessions';

interface Session {
  _id: string;
  name: string;
  course_name: string;
  created_at: string;
}

const SessionComponent: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const fetchSessions = useCallback(async (page: number, size: number, keyword: string) => {
    const response = await getSessions({
      keyword: keyword,
      course_id: '',
      is_position_order: false,
      is_deleted: false,
    }, page, size);
    setSessions(response.pageData);
    setTotalSessions(response.pageInfo.totalItems);
  }, []);

  useEffect(() => {
    fetchSessions(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword, fetchSessions]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddSession onSessionCreated={() => fetchSessions(pageNum, pageSize, searchKeyword)} />
      </div>
      <DisplaySessions
        sessions={sessions}
        totalSessions={totalSessions}
        pageNum={pageNum}
        pageSize={pageSize}
        setPageNum={setPageNum}
        setPageSize={setPageSize}
        setSearchKeyword={setSearchKeyword}
        fetchSessions={fetchSessions}
      />
    </div>
  );
};

export default SessionComponent;
