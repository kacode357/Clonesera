import { React, useState, useEffect, SearchOutlined, Table, Pagination, Input } from "../../../utils/commonImports";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";

const { Search } = Input;

interface Session {
  _id: string;
  name: string;
  course_name: string;
  created_at: string;
}

interface SessionTableProps {
  sessions: Session[];
}

const SessionTable: React.FC<SessionTableProps> = ({ sessions }) => {
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalSessions, setTotalSessions] = useState<number>(sessions.length);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    const fetchSessions = async () => {
        const filteredData = sessions.filter((session) =>
          session.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredSessions(filteredData);
        setTotalSessions(filteredData.length);
    };

    fetchSessions();
  }, [searchKeyword, sessions]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPageNum(1); // Reset to first page on search
  };

  const sessionColumns: ColumnsType<Session> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Course Name", dataIndex: "course_name", key: "course_name" },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => moment(text).format("DD-MM-YYYY"),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by session name"
          enterButton={<SearchOutlined />}
          allowClear
          size="large"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table
        columns={sessionColumns}
        dataSource={filteredSessions.slice((pageNum - 1) * pageSize, pageNum * pageSize)}
        rowKey="_id"
        pagination={false}
      />
      <div className="flex justify-end mt-5">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalSessions}
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

export default SessionTable;
