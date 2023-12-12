import React, {useState} from 'react';
import {isEmpty} from 'lodash';
import {toast} from 'react-toastify';
import {COLLECTION_NAMES} from '@/firebase/constants';
import {firestore, storage} from '@/firebase-config';
import {insertIntoCollection} from '@/firebase/functions';
import moment from 'moment';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {Grid} from 'react-loader-spinner';

const AddItems = () => {
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState(null);
  const [localImageUrl, setLocalImageUrl] = useState('');

  const clearState = () => {
    setImage('');
    setImageName(null);
    setLocalImageUrl('');
    setTitle('');
    setPrice('');
    setDescription('');
  };

  const handleImage = (e) => {
    if (e.target.files[0].size > 1597152) {
      toast.success('File size is larger than 1.5MB', {
        position: 'top-center',
      });
      return;
    }
    const file = e.target.files[0];

    setImage(file);
    setImageName(file.name);
    handleUrl(e);
  };

  const handleUrl = (event) => {
    const {target} = event;
    const {files} = target;
    if (files && files[0]) {
      var reader = new FileReader();
      reader.onload = (event) => {
        setLocalImageUrl(event.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const uploadPhoto = async () => {
    try {
      setLoader(true);
      let imageUrl = await uploadImageToStorage();
      let data = {
        title,
        description,
        price,
        image_url: imageUrl,
        created_at: moment().unix(),
      };

      await insertIntoCollection(firestore, COLLECTION_NAMES.items, data);
      clearState();
      setLoader(false);
      toast.success('Item added successfully', {
        position: 'top-center',
      });
    } catch (error) {
      toast.error('Failed to add post', {
        position: 'top-center',
      });
    }
  };

  const uploadImageToStorage = async () => {
    try {
      let cloudFolderName = 'Images';

      const min = 1;
      const max = 1000000;
      let uniqueNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      let postRef = `${cloudFolderName}/${uniqueNumber}-${imageName}`;

      if (image !== null) {
        const posterReference = ref(storage, postRef);

        let snapshot = await uploadBytes(posterReference, image);
        let downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      }
    } catch (error) {
      toast.error(error.message, {
        position: 'top-center',
      });
    }
  };

  return (
    <div className='bg-gray-200 flex items-center justify-center h-screen'>
      <div className='bg-white shadow rounded-lg p-8 w-full md:w-[40%] h-full md:h-auto'>
        <div className='py-6 px-6 lg:px-8'>
          <h3 className='-mt-6 -ml-7 text-xl font-medium text-gray-900 text-center'>
            Add Items
          </h3>
        </div>
        <div className='flex items-center justify-center w-full'>
          {isEmpty(localImageUrl) ? (
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
            >
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <svg
                  className='w-8 h-8 mb-4 text-gray-500'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 16'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                  />
                </svg>
                <p className='mb-2 text-sm text-gray-500'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-gray-500'>
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id='dropzone-file'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImage}
              />
            </label>
          ) : (
            <img
              src={`${localImageUrl}`}
              alt={'PostImage'}
              className='max-h-[200px] max-w-[300px] rounded-lg'
            />
          )}
        </div>
        <div className='my-4'>
          <label className='block mb-2 text-sm font-medium text-gray-900'>
            {'Title'}
          </label>
          <input
            type='text'
            className='focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='my-4'>
          <label className='blockmb-2 text-sm font-medium text-gray-900'>
            {'Price (Rs.)'}
          </label>
          <input
            type='text'
            className='focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5'
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className='my-4'>
          <label className='blockmb-2 text-center text-sm font-medium text-gray-900'>
            {'Description'}
          </label>
          <textarea
            type='text'
            className='h-32 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 '
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          className='bg-blue-500 hover:bg-blue-700 w-full text-white font-semibold py-2 px-4 rounded relative'
          onClick={uploadPhoto}
          disabled={loader}
        >
          {loader ? (
            <div className='flex justify-center items-center'>
              <Grid
                height='30'
                width='30'
                color='#FFFFFF'
                ariaLabel='grid-loading'
                radius='12.5'
                wrapperStyle={{}}
                wrapperClass=''
                visible={true}
              />
            </div>
          ) : (
            'Add Item'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddItems;
