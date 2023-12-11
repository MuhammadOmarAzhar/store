import {faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';

const Header = () => {
  return (
    <header className='bg-gray-800 text-white p-4 flex justify-between items-center'>
      {/* Left side with store name */}
      <div>
        <h1 className='text-2xl font-bold'>Rando Store</h1>
      </div>

      {/* Right side with cart icon */}
      <div>
        <FontAwesomeIcon
          icon={faShoppingCart}
          className='text-xl cursor-pointer'
        />
      </div>
    </header>
  );
};

export default Header;
