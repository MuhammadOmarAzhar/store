import React from 'react';
import Header from '../components/Header';
import '../styles/globals.css';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({Component, pageProps}) {
  return (
    <>
      <Header />
      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
