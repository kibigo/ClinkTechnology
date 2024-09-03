import { ReactNode } from "react";
import { FaArrowTrendUp, FaClockRotateLeft } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { HiMiniCube } from "react-icons/hi2";
import { GoGraph } from "react-icons/go";

function Boxwrapper({children}: {children: ReactNode}){
  return (
    <div className='bg-white rounded-lg flex flex-1 items-center border border-gray-200 lg:mt-10 ml-5 mr-2'>
      {children}
    </div>
  )
}


function Statistics() {
  return (
    <div className='flex flex-col lg:flex-row gap-4 w-3/4 md:w-full'>

      <Boxwrapper>
        <div className="flex flex-1 flex-col ml-5">
          <span className="text-sm text-gray-500 font-light">Total Users</span>

          <div className="flex-col mt-1">
            <strong className="text-3xl">40689</strong>
          </div>

          <div className="mt-1 flex-col">
            <div className="flex">
              <FaArrowTrendUp fontSize={20} className="text-green-500"/>
              <span className="ml-3 text-green-600">8.5% </span>
            </div>
            <div>
              <span className="text-black">Up from yesterday</span>
            </div>

          </div>
        </div>

        <div className="items-center h-12 w-12 mr-1 justify-center flex bg-purple-300 rounded-full">
            <FaUser fontSize={36} className="" />
        </div>
      </Boxwrapper>

      <Boxwrapper>
        <div className="flex flex-1 flex-col ml-5">
          <span className="text-sm text-gray-500 font-light">Total Order</span>

          <div className="flex-col mt-1">
            <strong className="text-3xl">10293</strong>
          </div>

          <div className="mt-1 flex-col">
            <div className="flex">
              <FaArrowTrendUp fontSize={20} className="text-green-500"/>
              <span className="ml-3 text-green-600">8.5% </span>
            </div>
            <div>
              <span className="text-black">Up from yesterday</span>
            </div>

          </div>
        </div>

        <div className="items-center h-12 w-12 mr-1 justify-center flex bg-yellow-300 rounded-full">
            <HiMiniCube fontSize={36} className="" />
        </div>
      </Boxwrapper>


      <Boxwrapper>
        <div className="flex flex-1 flex-col ml-5">
          <span className="text-sm text-gray-500 font-light">Total Sales</span>

          <div className="flex-col mt-1">
            <strong className="text-3xl">$ 89,000</strong>
          </div>

          <div className="mt-1 flex-col">
            <div className="flex">
              <FaArrowTrendUp fontSize={20} className="text-green-500"/>
              <span className="ml-3 text-green-600">1.3% </span>
            </div>
            <div>
              <span className="text-black">Up from yesterday</span>
            </div>

          </div>
        </div>

        <div className="items-center h-12 w-12 mr-1 justify-center flex bg-green-300 rounded-full">
            <GoGraph fontSize={36} className="" />
        </div>
      </Boxwrapper>


      <Boxwrapper>
        <div className="flex flex-1 flex-col ml-5">
          <span className="text-sm text-gray-500 font-light">Total Pending</span>

          <div className="flex-col mt-1">
            <strong className="text-3xl">2040</strong>
          </div>

          <div className="mt-1 flex-col">
            <div className="flex">
              <FaArrowTrendUp fontSize={20} className="text-green-500"/>
              <span className="ml-3 text-green-600">1.8% </span>
            </div>
            <div>
              <span className="text-black">Up from yesterday</span>
            </div>

          </div>
        </div>

        <div className="items-center h-12 w-12 mr-1 justify-center flex bg-orange-300 rounded-full">
            <FaClockRotateLeft fontSize={36} className="" />
        </div>
      </Boxwrapper>
    </div>
  )
}

export default Statistics