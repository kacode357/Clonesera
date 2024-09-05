import { useEffect, useState } from 'react';
import { getCategories } from '../utils/commonImports';

type Category = {
    _id: string;
    name: string;
    parent_category_id?: string;
};

const useCategories = () => {
    const [categories, setCategories] = useState<{ [key: string]: Category[] }>({});
    const [parents, setParents] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories({ keyword: "", category: "", status: "", is_deleted: false }, 1, 100);
            const fetchedCategories: Category[] = data.pageData;
            const categoryTree: { [key: string]: Category[] } = {};
            const parentCategories: Category[] = [];

            fetchedCategories.forEach(category => {
                if (!category.parent_category_id) {
                    parentCategories.push(category);
                } else {
                    if (!categoryTree[category.parent_category_id]) {
                        categoryTree[category.parent_category_id] = [];
                    }
                    categoryTree[category.parent_category_id].push(category);
                }
            });
            setCategories(categoryTree);
            setParents(parentCategories);
        };
        fetchCategories();
    }, []);

    return { categories, parents };
};

export default useCategories;
