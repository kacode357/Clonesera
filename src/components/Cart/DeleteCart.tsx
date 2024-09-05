import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteCart, getCart } from '../../services/Api';
import { toast } from 'react-toastify';
import { useCartContext } from '../../consts/CartContext';  // Import the custom hook

interface DeleteCartProps {
    cartId: string;
    onRemove: (id: string) => void;
}

const DeleteCart: React.FC<DeleteCartProps> = ({ cartId, onRemove }) => {
    const { setTotalCartItems } = useCartContext();  // Use the context

    const handleDelete = async () => {
        try {
            await deleteCart(cartId);
            onRemove(cartId);
            const cartData = await getCart({
                searchCondition: { status: 'new', is_deleted: false },
                pageInfo: { pageNum: 1, pageSize: 10 }
            });
            setTotalCartItems(cartData.pageInfo.totalItems);  // Update the context
        } catch (error) {
            console.error('Error deleting cart item:', error);
            toast.error('Error deleting cart item');
        }
    };

    return (
        <Button className='text-red-500 cursor-pointer' onClick={handleDelete} type="link" icon={<DeleteOutlined />} />
    );
};

export default DeleteCart;
