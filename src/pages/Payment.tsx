import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCart } from '../services/Api';
import { message, List, Typography, Card, Row, Col, Spin } from 'antd';
import { toast } from 'react-toastify';
import { DollarOutlined, TagOutlined, TagFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CartItem {
    _id: string;
    course_name: string;
    instructor_name: string;
    price: number;
    discount: number;
}

const Payment: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            const data = {
                searchCondition: {
                    status: 'waiting_paid',
                    is_deleted: false,
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 100,
                },
            };

            try {
                const response = await getCart(data);
                setCartItems(response.pageData);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                message.error('Error fetching cart items');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const selectedItems = cartItems;
    const totalPrice = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const totalDiscount = selectedItems.reduce((acc, item) => acc + (item.price * item.discount / 100), 0);
    const totalBill = totalPrice - totalDiscount;

    const handleUpdateCart = async (status: string) => {
        const items = selectedItems.map(item => ({ _id: item._id, cart_no: item._id }));
        const data = { status, items };

        try {
            await updateCart(data);
            if (status === 'completed') {
                toast.success('Checkout completed');
                navigate('/');
            } else if (status === 'cancel') {
                toast.success('Checkout canceled');
                navigate('/view-cart');
            }
        } catch (error) {
            console.error('Error updating cart status:', error);
            toast.error('Error updating cart status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
                <Spin size="large" />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
                <Text className="text-white text-lg">No items in the cart</Text>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full lg:w-1/2 mx-auto mt-12 p-6 bg-white rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl duration-300">
                <div className="text-center">
                    <Title level={2} className="text-blue-600">Order Summary</Title>
                    <Text className="block text-gray-600 mb-4">Review your order and confirm your purchase</Text>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <List
                        dataSource={selectedItems}
                        renderItem={item => (
                            <List.Item key={item._id} className="py-4 border-b border-gray-300">
                                <Row className="w-full">
                                    <Col span={16}>
                                        <Text className="text-gray-800 text-lg font-medium">{item.course_name}</Text>
                                    </Col>
                                    <Col span={8} className="text-right">
                                        <Text className="text-red-600 text-lg font-semibold">${item.price.toLocaleString()}</Text>
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                    <div className="border-t border-gray-300 mt-6 pt-4">
                        <div className="flex justify-between items-center mb-4 p-4 bg-yellow-50 border-l-8 border-yellow-400 rounded-lg">
                            <DollarOutlined className="text-yellow-500 text-2xl" />
                            <div className="flex-1 ml-4">
                                <Text className="text-gray-800 text-lg font-medium">Original Price:</Text>
                                <Text className="text-gray-900 text-lg font-bold">${totalPrice.toLocaleString()}</Text>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 p-4 bg-green-50 border-l-8 border-green-400 rounded-lg">
                            <TagFilled className="text-green-500 text-2xl" />
                            <div className="flex-1 ml-4">
                                <Text className="text-gray-800 text-lg font-medium">Discount Amount:</Text>
                                <Text className="text-green-700 text-lg font-bold">-${totalDiscount.toLocaleString()}</Text>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-blue-50 border-l-8 border-blue-400 rounded-lg">
                            <TagOutlined className="text-blue-500 text-2xl" />
                            <div className="flex-1 ml-4">
                                <Text className="text-gray-800 text-xl font-semibold">Total Price:</Text>
                                <Text className="text-blue-900 text-xl font-bold">${totalBill.toLocaleString()}</Text>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-8">
                    <button
                        className="w-full py-3 text-lg font-semibold rounded-3xl bg-green-500 border-none text-white hover:bg-green-600 transition duration-300"
                        onClick={() => handleUpdateCart('completed')}
                    >
                        Confirm
                    </button>
                    <button
                        className="w-full py-3 text-lg font-semibold rounded-3xl bg-red-500 border-none text-white hover:bg-red-600 transition duration-300"
                        onClick={() => handleUpdateCart('cancel')}
                    >
                        Cancel
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Payment;
