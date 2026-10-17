"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toaster() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3200}
      newestOnTop
      closeOnClick
      pauseOnHover
      pauseOnFocusLoss={false}
      draggable
      theme="light"
      hideProgressBar={false}
      closeButton
      toastClassName="!rounded-xl !border !border-primary/10 !bg-white !px-4 !py-3 !font-sans !text-sm !font-medium !text-navy !shadow-[0_10px_30px_-12px_rgba(11,37,64,0.35)]"
      progressClassName="!bg-primary/70"
    />
  );
}

export { Toaster };
