import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Button, Checkbox } from 'antd';
import { toast } from 'react-toastify';
import { getCart, getCourseDetail, updateCart } from '../../utils/commonImports';
import { DeleteOutlined } from '@ant-design/icons';

interface CartItem {
    _id: string;
    course_name: string;
    course_id: string;
    instructor_name: string;
    price: number;
    discount: number;
    cart_no: string;
    status: string;
    image_url: string;
}

const WaitingPaid: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const navigate = useNavigate();

    const fetchCartItems = useCallback(async () => {
        const data = {
            searchCondition: {
                status: 'waiting_paid',
                is_deleted: false,
            },
            pageInfo: {
                pageNum: 1,
                pageSize: 1000,
            },
        };
        const response = await getCart(data);
        const courseIds = response.pageData.map((item: CartItem) => item.course_id);

        const courseDetails = await Promise.all(courseIds.map(async (id: string) => {
            return await getCourseDetail(id);
        }));

        const getCartImage = response.pageData.map((item: CartItem, index: number) => ({
            ...item,
            image_url: courseDetails[index] ? courseDetails[index].image_url : ''
        }));

        setCartItems(getCartImage);

    }, []);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const handleDelete = async (itemId: string, cartNo: string) => {
        await updateCart({
            status: 'cancel',
            items: [{ _id: itemId, cart_no: cartNo }]
        });
        setCartItems(cartItems.filter(item => item._id !== itemId));
        toast.success('Item deleted successfully');
    };

    const handleSelectChange = (selectedKeys: React.Key[]) => {
        setSelectedRowKeys(selectedKeys);
    };

    const handleCheckout = () => {
        const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item._id));
        if (selectedItems.length === 0) {
            message.warning('Please select items to checkout');
            return;
        }
        const courseIds = selectedItems.map(item => item.course_id);
        navigate('/payment', { state: { courseIds } });
    };

    const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item._id));
    const totalPrice = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const totalDiscount = selectedItems.reduce((acc, item) => acc + item.discount, 0);
    const totalBill = totalPrice - totalDiscount;

    if (cartItems.length === 0) {
        return <div className="flex justify-center items-center h-screen">No items in waiting paid</div>;
    }

    return (
        <div className="p-2 lg:p-4 flex flex-col lg:flex-row gap-4">
            <div className="lg:w-2/3 flex flex-col gap-4">
                <div className="flex items-center mb-2">
                    <Checkbox
                        onChange={e => {
                            const checked = e.target.checked;
                            setSelectedRowKeys(checked ? cartItems.map(item => item._id) : []);
                        }}
                        checked={selectedRowKeys.length === cartItems.length}
                    >
                        Select all
                    </Checkbox>
                    <span className="ml-auto text-blue-500">{cartItems.length} courses in waiting paid</span>
                </div>
                <div className="flex flex-col gap-2">
                    {cartItems.map(item => (
                        <div key={item._id} className="bg-white p-2 rounded-md shadow-sm flex flex-col sm:flex-row items-start gap-2">
                            <Checkbox
                                checked={selectedRowKeys.includes(item._id)}
                                onChange={() => {
                                    const newSelectedRowKeys = selectedRowKeys.includes(item._id)
                                        ? selectedRowKeys.filter(key => key !== item._id)
                                        : [...selectedRowKeys, item._id];
                                    handleSelectChange(newSelectedRowKeys);
                                }}
                            />
                            <img src={item.image_url} alt={item.course_name} className="w-24 h-24 mb-2 sm:mb-0 sm:mr-2 object-cover" />
                            <div className="flex flex-col w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <h2 className="text-sm font-semibold">{item.course_name}</h2>
                                    <DeleteOutlined
                                        className="text-red-500 cursor-pointer"
                                        onClick={() => handleDelete(item._id, item.cart_no)}
                                    />
                                </div>
                                <div className="flex items-center mb-1">
                                    <p className="text-gray-600 text-xs">By {item.instructor_name}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {item.discount > 0 && (
                                            <>
                                                <span className="text-gray-500 line-through text-xs">${item.price.toLocaleString()}</span>
                                                <span className="ml-1 flex items-center">
                                                    <i className="fas fa-tag text-green-500 text-xs"></i>
                                                    <span className="text-green-500 text-xs ml-1">Discount: ${item.discount}</span>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <span className={`text-sm font-bold ${item.discount > 0 ? 'text-red-500' : 'text-black'}`}>
                                        ${(item.price - item.discount).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:w-1/3 p-4 bg-white rounded-md shadow-sm">
                <h2 className="text-lg font-bold mb-2">Order Summary</h2>
                <div className="flex justify-between mb-1">
                    <span>Subtotal</span>
                    <span className="text-sm font-bold">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span>Total Discount</span>
                    <span className="text-sm font-bold">-${totalDiscount}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">${totalBill.toLocaleString()}</span>
                </div>
                <Button type="primary" className="w-full py-2 text-sm font-semibold" onClick={handleCheckout}>
                    Checkout Now
                </Button>
            </div>
        </div>
    );
};

export default WaitingPaid;
