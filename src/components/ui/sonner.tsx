"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toaster() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3500}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
      toastClassName="!rounded-xl !font-sans !text-sm !shadow-xl"
    />
  );
}

export { Toaster };
