import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Pagination, Button, Modal, Select, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getCategories, createCategory, editCategory, deleteCategory } from '../../utils/commonImports';
import CategoryForm from '../../components/Admin/Category/CategoryForm';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

interface Category {
    _id: string;
    name: string;
    description: string;
    parent_category_id: string | null;
}

interface FormValues {
    name: string;
    description: string;
    parent_category_id?: string;
}

const { Search } = Input;

const Category: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [filterOption, setFilterOption] = useState<'parent' | 'sub' | ''>('');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalCategories, setTotalCategories] = useState<number>(0);

    const fetchCategories = useCallback(
        async (page: number, size: number, keyword: string, filterOption: string) => {

            const searchCondition = {
                keyword: keyword,
                category: '',
                status: '',
                is_deleted: false,
            };
            const data = await getCategories(searchCondition, page, size);
            let filteredCategories = data.pageData;
            if (filterOption === 'parent') {
                filteredCategories = filteredCategories.filter((cat: Category) => cat.parent_category_id === null);
            } else if (filterOption === 'sub') {
                filteredCategories = filteredCategories.filter((cat: Category) => cat.parent_category_id !== null);
            }
            setCategories(filteredCategories);
            setTotalCategories(data.pageInfo.totalItems); // Adjust based on your API response
            const parentData = await getCategories({ keyword: '', category: '', status: '', is_deleted: false }, 1, 1000);
            setParentCategories(parentData.pageData);

        },
        []
    );

    useEffect(() => {
        fetchCategories(pageNum, pageSize, searchKeyword, filterOption);
    }, [pageNum, pageSize, searchKeyword, filterOption, fetchCategories]);

    const columns: ColumnsType<Category> = useMemo(
        () => [
            {
                title: 'Category Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Parent Category',
                dataIndex: 'parent_category_id',
                key: 'parent_category_id',
                render: (parentCategoryId: string | null) => {
                    const parentCategory = parentCategories.find((cat: Category) => cat._id === parentCategoryId);
                    return parentCategory ? parentCategory.name : 'N/A';
                },
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (record: Category) => (
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => handleEdit(record)}
                            icon={<EditOutlined />}
                            className="text-blue-500 hover:text-blue-700"
                        />
                        <Button
                            onClick={() => handleDelete(record._id)}
                            icon={<DeleteOutlined />}
                            danger
                            className="text-red-500 hover:text-red-700"
                        />
                    </div>
                ),
            },
        ],
        [parentCategories]
    );

    const handleAddCategory = () => {
        setIsEditing(false);
        setEditingCategory(null);
        setIsModalVisible(true);
    };

    const handleEdit = (category: Category) => {
        setIsEditing(true);
        setEditingCategory(category);
        setIsModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this category?',
            onOk: async () => {
                await deleteCategory(id);
                fetchCategories(pageNum, pageSize, searchKeyword, filterOption);
            },
        });
    };

    const handleSubmit = async (values: FormValues) => {
        if (isEditing && editingCategory) {
            await editCategory(editingCategory._id, values);
        } else {
            await createCategory(values);
        }
        setIsModalVisible(false);
        fetchCategories(pageNum, pageSize, searchKeyword, filterOption);

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setPageNum(1); 
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex items-center">
                <Select
                    value={filterOption}
                    placeholder="Select"
                    onChange={(value) => {
                        setFilterOption(value as 'parent' | 'sub' | '');
                        setPageNum(1);
                    }}
                    allowClear
                    className="mr-2 w-40"
                >
                    <Select.Option value="parent">Parent Category</Select.Option>
                    <Select.Option value="sub">Sub Category</Select.Option>
                </Select>
                <Search
                    placeholder="Search by category name"
                    enterButton={<SearchOutlined />}
                    allowClear
                    size="large"
                    onSearch={handleSearch}
                    style={{ width: 300, marginRight: '16px' }}
                />
                <Button type="primary" onClick={handleAddCategory} icon={<PlusOutlined />} className="custom-button ml-auto">
                    New Category
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={categories.map(category => ({ ...category, key: category._id }))}
                pagination={false}
                className="mb-4"
            />
            <div className="flex justify-end mt-5">
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    total={totalCategories}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={(page, pageSize) => {
                        setPageNum(page);
                        setPageSize(pageSize);
                    }}
                    showSizeChanger
                />
            </div>
            <CategoryForm
                isVisible={isModalVisible}
                isEditing={isEditing}
                editingCategory={editingCategory}
                parentCategories={parentCategories}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default Category;
