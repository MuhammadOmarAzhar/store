import Loader from '@/components/Loader';
import {firestore} from '@/firebase-config';
import {COLLECTION_NAMES} from '@/firebase/constants';
import {fetchCollection} from '@/firebase/functions';
import {isEmpty, orderBy} from 'lodash';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

const Items = () => {
  const [loader, setLoader] = useState(true);
  const [itemList, setItemList] = useState([]);

  const fetchItems = async () => {
    try {
      let response = await fetchCollection(firestore, COLLECTION_NAMES.items);
      let items = orderBy(response, ['created_at'], ['desc']);
      setItemList(items);
    } catch (error) {
      toast.error('Error fetching Items', {
        position: 'top-center',
      });
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className='bg-gray-200'>
      {loader ? (
        <Loader loading={true} />
      ) : (
        <>
          <div className='p-4 grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5'>
            {itemList.map((res) => {
              return (
                <div
                  key={res.id}
                  className='max-w-[300px] rounded-lg grid grid-cols-1 overflow-hidden shadow-lg mt-10 mx-2 bg-white'
                >
                  <div className='flex justify-center items-center'>
                    <img
                      className='max-w-[300px] max-h-[200px] mt-4'
                      src={res.image_url}
                      alt='Item'
                    />
                  </div>
                  <div className='px-6 py-4 w-fit max-w-[500px]'>
                    <div className='text-blue-400 text-xl mb-2'>
                      {res.title}
                    </div>
                    <p className='text-gray-700 text-base mb-2'>
                      {res.description}
                    </p>
                    <p className='text-orange-600'>Rs. {res.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {isEmpty(itemList) ? (
        <div className='text-gray-600 flex-1 text-center text-2xl'>
          No items available yet.
        </div>
      ) : null}
    </div>
  );
};

export default Items;
