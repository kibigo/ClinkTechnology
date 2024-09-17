import { ReactNode, useEffect, useState } from "react";
import { FaArrowTrendUp, FaClockRotateLeft, FaArrowTrendDown } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { HiMiniCube } from "react-icons/hi2";
import { GoGraph } from "react-icons/go";
import axios from "axios";
import { getCookie } from "typescript-cookie";



interface User{
  id:number;
  first_name:string;
  last_name:string;
  email:string;
  created_at:string;
  updated_at:string;
  user_type:number;
}


interface Order {
  id: number;
  totalPrice:number;
  email:string;
  isDelivered:number;
  isPaid:number;
  orderDate:string;
  created_at:string;
}

function Boxwrapper({children}: {children: ReactNode}){
  return (
    <div className='bg-white rounded-lg flex flex-1 items-center border border-gray-200 lg:mt-10 ml-5 mr-2'>
      {children}
    </div>
  )
}



function Statistics() {

  const jwtToken = getCookie('jwt');

  const [user, setUser] = useState<User[]>([]);
  const [order, setOrder] = useState<Order[]>([]);
  const [paid, setPaid] = useState<Order[]>([]);
  const [pendingOrder, setPendingOrder] = useState<Order[]>([]);
  const [percentUser, setPercentUsers] = useState<number>(Number);
  const [percentOrder, setPercentOrder] = useState<number>(Number);

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/allusers', {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });

        const filteredUser = response.data.filter((user: User) => user.user_type === 1);
        
        setUser(filteredUser);

        const createdToday = response.data.filter((user: User) => {
          const today = new Date();
          const userDate = new Date(user.created_at);

          return(
            userDate.getDate() === today.getDate() &&
            userDate.getMonth() === today.getMonth() &&
            userDate.getFullYear() === today.getFullYear()
          );
        });

        const createdYesterday = response.data.filter((user: User) => {
          const today = new Date();
          const userDate = new Date(user.created_at);

          return(
            userDate.getDate() === today.getDate()-1 &&
            userDate.getMonth() === today.getMonth()-1 &&
            userDate.getFullYear() === today.getFullYear()
          );
        });

        let initial = 0;

        initial += createdToday.length - createdYesterday.length;
        let result = parseInt(((createdToday.length / initial)*100).toFixed());
        
        if(isNaN(result)){
          result = 0;
          setPercentUsers(result);
        }
        setPercentUsers(result);
        


    } catch (error) {
        console.error('Error fetching users:', percentUser);
    } 
    }

    fetchUsers();

  }, [])


  useEffect(() => {

    const fetchOrder = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/orders', {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });

        const todayOrders = response.data.filter((order: Order) => {
          const todayDate = new Date();
          const orderDate = new Date(order.created_at);

          return (
            orderDate.getDate() == todayDate.getDate() &&
            orderDate.getMonth() == todayDate.getMonth() &&
            orderDate.getFullYear() == todayDate.getFullYear()
          )
        });
        
        setOrder(todayOrders);

        const yesterdayOrders = response.data.filter((order: Order) => {
          const todayDate = new Date();
          const orderDate = new Date(order.created_at);

          return (
            orderDate.getDate() == todayDate.getDate()-1 &&
            orderDate.getMonth() == todayDate.getMonth()-1 &&
            orderDate.getFullYear() == todayDate.getFullYear()
          )
        });

        let initial = 0;

        initial += todayOrders.length - yesterdayOrders.length;
        let result = parseInt(((todayOrders.length / initial)*100).toFixed());
        
        if(isNaN(result)){
          result = 0;
          setPercentOrder(result);
        }
        setPercentOrder(result);

        const paidOrders = response.data.filter((order: Order) => {
          const todayDate = new Date()
          const orderDate = new Date(order.created_at);

          return(
            order.isPaid == 0 &&
            orderDate.getDate() == todayDate.getDate() &&
            orderDate.getMonth() == todayDate.getMonth() &&
            orderDate.getFullYear() == todayDate.getFullYear()
          );
        });
        setPaid(paidOrders);

        const pendingOrders = response.data.filter((order: Order) => order.isPaid == 1);
        setPendingOrder(pendingOrders);

    } catch (error) {
        console.error('Error fetching users:', error);
    } 
    }

    fetchOrder();

  }, [])
  return (
    <div className='flex flex-col lg:flex-row gap-4 w-3/4 md:w-full'>

      <Boxwrapper>
        <div className="flex flex-1 flex-col ml-5">
          <span className="text-sm text-gray-500 font-light">Total Users</span>

          <div className="flex-col mt-1">
            <strong className="text-3xl">{user.length}</strong>
          </div>

          <div className="mt-1 flex-col">
            <div className="flex">

              {percentUser == 0 ? '': 
              percentUser < 0 ? (
                <>
                  <FaArrowTrendDown fontSize={20} className="text-green-500"/>
                  <span className="ml-3 text-green-600">
                    {percentUser}
                  </span>

                  <div>
                    <span className="text-black">Up from yesterday</span>
                  </div>
                </>
              ): 

              <>
                  <FaArrowTrendUp fontSize={20} className="text-green-500"/>
                  <span className="ml-3 text-green-600">
                    {`${percentUser}%`}
                  </span>

                  <div>
                    <span className="text-black">Up from yesterday</span>
                  </div>
              </>
              }
            </div>

          </div>
        </div>

        <div className="items-center h-12 w-12 mr-1 justify-center flex bg-purple-300 rounded-full">
            <FaUser fontSize={36} className="" />
        </div>
      </Boxwrapper>

      <Boxwrapper>
        <div className="flex flex-1 flex-col ml-5">
          <span className="text-sm text-gray-500 font-light">Today's Order</span>

          <div className="flex-col mt-1">
            <strong className="text-3xl">{order.length}</strong>
          </div>

          <div className="mt-1 flex-col">
            <div className="flex">
            {percentOrder == 0 ? '': 
              percentOrder < 0 ? (
                <>
                  <FaArrowTrendDown fontSize={20} className="text-green-500"/>
                  <span className="ml-3 text-green-600">
                    {percentOrder}
                  </span>
                  <div>
                    <span className="text-black">Up from yesterday</span>
                  </div>
                </>
              ): 

              <>
                  <FaArrowTrendUp fontSize={20} className="text-green-500"/>
                  <span className="ml-3 text-green-600">
                    {`${percentOrder}%`}
                  </span>
                  <div>
                    <span className="text-black">Up from yesterday</span>
                  </div>
              </>
              }
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
            <strong className="text-3xl">{paid.length}</strong>
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
            <strong className="text-3xl">{pendingOrder.length}</strong>
          </div>

          <div className="mt-1 flex-col">
            <div className="flex">
              {/* <FaArrowTrendUp fontSize={20} className="text-green-500"/>
              <span className="ml-3 text-green-600">1.8% </span> */}
            </div>
            {/* <div>
              <span className="text-black">Up from yesterday</span>
            </div> */}

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