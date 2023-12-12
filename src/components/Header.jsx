import {faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header className='bg-gray-800 text-white p-4 flex justify-between items-center'>
      <div>
        <h1 className='text-2xl font-bold'>
          <Link href='/'>
            <h1 className='text-white'>Rando Store</h1>
          </Link>
        </h1>
      </div>

      <div className='flex gap-4'>
        <h1>
          <Link href='/items'>
            <h1 className='text-white'>Home</h1>
          </Link>
        </h1>
        <h1>
          <Link href='/add-items'>
            <h1 className='text-white'>Add Items</h1>
          </Link>
        </h1>
      </div>

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
