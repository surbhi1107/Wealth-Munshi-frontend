import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React from "react";

const PopUp = ({
  isOpen,
  closePopUp = () => {},
  title = "",
  isClose = true,
  children,
  footerChildren,
}) => {
  if (isOpen !== true) return null;

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 w-screen overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="max-w-lg space-y-4 bg-white px-7 py-7 rounded-xl">
            {(title || isClose) && (
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8]">
                {title && (
                  <p className="text-lg lg:text-2xl font-semibold text-[#45486A]">
                    {title}
                  </p>
                )}
                {isClose && (
                  <button onClick={() => closePopUp?.()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
            <div className="">{children}</div>
            {footerChildren && (
              <div className="p-3 border-t border-[#E8E8E8]">
                {footerChildren}
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PopUp;
