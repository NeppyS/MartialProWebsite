import React from "react";
import { useNavigate } from "react-router-dom";



function DashNavigation() {

  const navigate = useNavigate();
    return (
      <>
        <div className="flex flex-col w-full items-start bg-white h-screen p-10">
          <div className="w-full h-[15%] bg-slate-200" title="logo">
            THIS IS LOGO
          </div>
          <button
            className=" font-bold"
            onClick={() => navigate("/")}
          >
            Dashboard
          </button>

          <div className=" w-[100%] mt-12" title="General">
            <p className=" text-100% font-semibold text-[#909090]">GENERAL</p>

            <div className=" flex flex-col p-4 ">
              <div className=" text-[20px]">
                <button onClick={() => navigate("/UsersPage")}>Users</button>
              </div>
              <div className=" text-[20px]">
                <button>Payment</button>
              </div>
            </div>
          </div>

          <div className=" w-[100%] mt-12" title="support">
            <p className=" text-100% font-semibold text-[#909090]">SUPPORT</p>

            <div className=" flex flex-col p-4 ">
              <div className=" text-[20px]">
                <button>Settings</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );

}

export default DashNavigation;