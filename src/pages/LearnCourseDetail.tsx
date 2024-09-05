import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, Menu, Spin, Button } from "antd";
import { getCourseDetail, getLessonById } from "../utils/commonImports";
import {
    FileOutlined,
    VideoCameraOutlined,
    ReadOutlined,
    EyeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import parse from 'html-react-parser';
import "tailwindcss/tailwind.css";

const { Sider, Content, Header } = Layout;

interface Lesson {
    _id: string;
    name: string;
    lesson_type: string;
    full_time: number;
    position_order: number;
    video_url?: string;
    image_url?: string;
    description?: string;
}

interface Session {
    _id: string;
    name: string;
    position_order: number;
    full_time: number;
    lesson_list: Lesson[];
}

interface Course {
    _id: string;
    name: string;
    session_list: Session[];
}

const LearnCourseDetail: React.FC = () => {
    const { id, lessonId } = useParams<{ id: string, lessonId?: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetail = async () => {
            if (!id) {
                return;
            }
            const data = await getCourseDetail(id);
            setCourse(data);
            if (lessonId) {
                fetchLessonDetail(lessonId);
            } else if (data.session_list.length > 0 && data.session_list[0].lesson_list.length > 0) {
                const firstLessonId = data.session_list[0].lesson_list[0]._id;
                fetchLessonDetail(firstLessonId);
                navigate(`/learn-course-detail/${id}/lesson/${firstLessonId}`);
            }
        };

        fetchCourseDetail();
    }, [id, lessonId, navigate]);

    const fetchLessonDetail = async (lessonId: string) => {
        const lesson = await getLessonById(lessonId);
        setSelectedLesson(lesson);
    };

    const handleLessonClick = (lesson: Lesson) => {
        fetchLessonDetail(lesson._id);
        navigate(`/learn-course-detail/${id}/lesson/${lesson._id}`);
    };

    const getLessonIcon = (lessonType: string) => {
        switch (lessonType) {
            case "video":
                return <VideoCameraOutlined />;
            case "reading":
                return <ReadOutlined />;
            case "image":
                return <FileOutlined />;
            default:
                return <EyeOutlined />;
        }
    };

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Layout className="min-h-screen">
            <Header className="bg-white shadow-md flex items-center px-4 md:px-6 lg:px-8">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    className="mr-4"
                />
                <div className="flex-1">
                    {selectedLesson && (
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <span 
                                    className="cursor-pointer hover:text-blue-500 transition-colors duration-300 font-semibold" 
                                    onClick={() => navigate('/homepage')}
                                >
                                    Home
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span 
                                    className="cursor-pointer hover:text-blue-500 transition-colors duration-300 font-semibold" 
                                    onClick={() => navigate(`/course-detail/${id}`)}
                                >
                                    {course.name}
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{selectedLesson.name}</Breadcrumb.Item>
                        </Breadcrumb>
                    )}
                </div>
            </Header>
            <Layout>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    width={300}
                    className="bg-white shadow-md overflow-auto"
                    trigger={null}
                    breakpoint="lg"
                    collapsedWidth="0"
                >
                    <Menu
                        mode="inline"
                        defaultOpenKeys={[course.session_list[0]?._id]}
                        style={{ height: "100%" }}
                    >
                        {course.session_list.map((session) => (
                            <Menu.SubMenu key={session._id} title={session.name}>
                                {session.lesson_list.map((lesson) => (
                                    <Menu.Item
                                        key={lesson._id}
                                        icon={getLessonIcon(lesson.lesson_type)}
                                        onClick={() => handleLessonClick(lesson)}
                                    >
                                        {lesson.name}
                                    </Menu.Item>
                                ))}
                            </Menu.SubMenu>
                        ))}
                    </Menu>
                </Sider>
                <Layout>
                    <Content className="p-4 md:p-6 lg:p-8 bg-gray-100">
                        {selectedLesson ? (
                            <div className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg">
                                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">{selectedLesson.name}</h2>
                                {selectedLesson.lesson_type === "video" && selectedLesson.video_url && (
                                    <div className="mb-4">
                                        <iframe
                                            width="100%"
                                            height="250px"
                                            src={selectedLesson.video_url}
                                            title={selectedLesson.name}
                                            frameBorder="0"
                                            allowFullScreen
                                            className="rounded-lg"
                                        ></iframe>
                                    </div>
                                )}
                                {selectedLesson.lesson_type === "image" && selectedLesson.image_url && (
                                    <div className="mb-4">
                                        <img
                                            src={selectedLesson.image_url}
                                            alt={selectedLesson.name}
                                            className="max-w-full h-auto rounded-lg"
                                        />
                                    </div>
                                )}
                                {selectedLesson.description && (
                                    <div className="mt-4 text-sm md:text-base lg:text-lg">
                                        {parse(selectedLesson.description)}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>No lesson selected</div>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LearnCourseDetail;
