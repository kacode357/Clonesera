import { React, useEffect, useState, useNavigate, getCart, updateCart, message, Checkbox } from '../utils/commonImports';
import DeleteCart from '../components/Cart/DeleteCart';

interface CartItem {
    _id: string;
    course_name: string;
    course_id: string;
    instructor_name: string;
    price: number;
    discount: number;
    cart_no: string;
    status: string;
    course_image: string;
}

const ViewCart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            const data = {
                searchCondition: {
                    status: '',
                    is_deleted: false,
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 100,
                },
            };
            const response = await getCart(data);

            const getCartItems = response.pageData
                .filter((item: CartItem) =>
                    item.status === 'new' || item.status === 'cancel'
                );

            setCartItems(getCartItems);
        };
        fetchCartItems();
    }, []);

    const handleRemove = (id: string) => {
        setCartItems(cartItems.filter(item => item._id !== id));
        setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    };

    const handleSelectChange = (selectedKeys: React.Key[]) => {
        setSelectedRowKeys(selectedKeys);
    };

    const handleCheckout = async () => {
        const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item._id));
        if (selectedItems.length === 0) {
            message.warning('Please select items to checkout');
            return;
        }
        const data = {
            status: 'waiting_paid',
            items: selectedItems.map(item => ({
                _id: item._id,
                cart_no: item.cart_no
            }))
        };
        await updateCart(data);
        setCartItems(cartItems.filter(item => !selectedRowKeys.includes(item._id)));
        setSelectedRowKeys([]);
        navigate('/payment');
    };

    const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item._id));
    const totalPrice = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const totalDiscount = selectedItems.reduce((acc, item) => acc + (item.price * (item.discount / 100)), 0);
    const totalBill = totalPrice - totalDiscount;

    if (cartItems.length === 0) {
        return <div className="flex justify-center items-center h-screen">No items in the cart</div>;
    }

    return (
        <div className="p-2 lg:p-4 flex flex-col lg:flex-row gap-4">
            <div className="lg:w-2/3">
                <h1 className="text-xl font-bold mb-4">My Cart</h1>
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
                    <span className="ml-auto text-blue-500">{cartItems.length} Courses in Cart</span>
                </div>
                <div className="flex flex-col gap-2">
                    {cartItems.map(item => (
                        <div key={item._id} className="bg-white p-2 rounded-md shadow-sm flex items-start gap-2">
                            <Checkbox
                                checked={selectedRowKeys.includes(item._id)}
                                onChange={() => {
                                    const newSelectedRowKeys = selectedRowKeys.includes(item._id)
                                        ? selectedRowKeys.filter(key => key !== item._id)
                                        : [...selectedRowKeys, item._id];
                                    handleSelectChange(newSelectedRowKeys);
                                }}
                            />
                            <img src={item.course_image} alt={item.course_name} className="w-18 h-16 mr-2 rounded-sm mt-1   " />
                            <div className="flex flex-col w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <h2 className="text-sm font-semibold">{item.course_name}</h2>
                                    <DeleteCart cartId={item._id} onRemove={handleRemove} />
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
                                                    <span className="text-green-500 text-xs ml-1">Discount: {item.discount}%</span>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <span className={`text-sm font-bold ${item.discount > 0 ? 'text-red-500' : 'text-black'}`}>
                                        ${(item.price - (item.price * (item.discount / 100))).toLocaleString()}
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
                    <span>Original Price</span>
                    <span className="text-sm font-bold">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span>Discount Amount</span>
                    <span className="text-sm font-bold">-${totalDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-lg font-semibold">Total Price</span>
                    <span className="text-lg font-semibold">${totalBill.toLocaleString()}</span>
                </div>
                <button className="w-full py-2 text-sm font-semibold rounded-3xl bg-[#22c55e] hover:bg-green-600 text-white" onClick={handleCheckout}>
                    Checkout Now
                </button>
            </div>
        </div>
    );
};

export default ViewCart;
