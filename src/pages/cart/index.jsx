import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {removeFromCart} from '@/redux/cartSlice';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart({id: itemId}));
  };

  const totalAmount = cartItems.reduce((total, item) => {
    const {details, quantity} = item;
    return total + (details.price || 0) * quantity;
  }, 0);

  return (
    <div className='bg-gray-300 h-screen p-8'>
      <div className='container mx-auto p-6 bg-white rounded-lg'>
        <h2 className='text-2xl font-bold mb-4 text-gray-600 text-center'>
          Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className='text-gray-600 text-center text-2xl'>
            Your cart is empty.
          </p>
        ) : (
          <div>
            {cartItems.map((item) => {
              const {details, quantity} = item;
              return (
                <div key={item.id} className='flex items-center mb-4'>
                  <img
                    src={details.image_url}
                    alt={details.title}
                    className='w-16 h-16 object-cover mr-4 rounded'
                  />
                  <div className='flex-1'>
                    <h3 className='font-semibold text-black'>
                      {details.title}
                    </h3>
                    <p className='text-orange-600'>Rs. {details.price}</p>
                    <p className='text-gray-600'>Quantity: {quantity}</p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className='text-red-500 underline cursor-pointer'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className='mt-4'>
              <p className='font-semibold text-black'>Total Amount:</p>
              <p className='text-orange-600'>Rs. {totalAmount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
