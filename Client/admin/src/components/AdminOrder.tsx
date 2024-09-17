import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {HiOutlineSearch } from 'react-icons/hi'
import { BiX } from 'react-icons/bi';
import { TiTick } from 'react-icons/ti';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from 'typescript-cookie';

interface OrderItem {
    id: number;
    totalPrice:number;
    email:string;
    isDelivered:number;
    isPaid:number;
    orderJourney:number;
    orderDate:string;
    created_at:string;
}




const AdminOrder:React.FC = () => {

    //const linkClasses = "z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600";
    //const [isOpen, setIsOpen] = useState<boolean[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [products, setProduct] = useState<OrderItem[]>([]);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const [startDate, setStartDate] = useState<string>('');

    const [endDate, setEndDate] = useState<string>('');

    const [statusFilter, setStatusFilter] = useState<string>('');

    const jwtToken = getCookie('jwt');


    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const[itemsPerPage] = useState<number>(10);    


    const fetchUsers = async () => {

        setLoading(true);

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/orders', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            //const filteredUser = response.data.filter((product: OrderItem) => product.is_delete === 0);
            let productsAvailable = response.data;

            if (searchQuery) {
                productsAvailable = productsAvailable.filter((product: OrderItem) => 
                    product.email.toLowerCase().includes(searchQuery.toLowerCase()) || product.id.toString().includes(searchQuery) 

                );

                // productsAvailable = productsAvailable.filter((product: OrderItem) => 
                //     product.id.toString().includes(searchQuery)

                // );
            }

            if(startDate && endDate){

                const start = new Date(startDate);
                const end = new Date(endDate);

                end.setHours(23, 59, 59, 999);

                productsAvailable = productsAvailable.filter((product: OrderItem) => {
                    const productDate = new Date(product.created_at);

                    return productDate >= start && productDate <= end;
                });
            }


            if(statusFilter){
                productsAvailable = productsAvailable.filter((product: OrderItem) => {

                    if(statusFilter === 'delivered'){
                        return product.isDelivered === 1;
                    }else if (statusFilter === 'not delivered'){
                        return product.isDelivered === 0;
                    }else if(statusFilter === 'paid'){
                        return product.isPaid === 1;
                    }else if(statusFilter === 'not paid'){
                        return product.isPaid === 0;
                    }

                    return true;
                });
            }

            setProduct(productsAvailable);

        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [searchQuery, startDate, endDate, statusFilter, jwtToken]);

    //pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    // console.log(products.length);

    const handleClick = (page: number) => {
        setCurrentPage(page);
    }

    const startIndex = (currentPage -1 ) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);


    const handleOrderUpdate = (id: number) => {

        setLoading(true);

        axios.post(`http://127.0.0.1:8000/api/updateorderstatus/${id}`, {}, {
            headers: {
                Authorization : `Bearer ${jwtToken}`
            }
        })
        .then((response) => {

            Swal.fire({
                title:'Update',
                text:response.data.message,
                icon:'success'
            });

            fetchUsers();
        })
        .catch((error) => {
            if(axios.isAxiosError(error)){

                Swal.fire({
                    title:'Update',
                    text:error.response?.data.message,
                    icon:'success'
                });
            }
        })
        .finally(() => {
            setLoading(false);
            
        })

    };



    const handleDelete = (id: number) => {
        setLoading(true);
        
        axios.delete(`http://127.0.0.1:8000/api/admin/deleteproduct/${id}`,{
            headers:{
                Authorization : `Bearer ${jwtToken}`
            }
        })
        .then((response) => {
            setLoading(false);

            const updatedProducts = products.filter(product => product.id !== id);

            setProduct(updatedProducts);

            Swal.fire({
                title:'delete',
                text:'Product deleted',
                icon:'success'
            });

            return response.data;
        })
    }


    const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };


    const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    };

    const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };


    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
      
  return (


    <div className="flex flex-col overflow-x-auto">

        <div className="sm:mx-6 lg:-mx-8">

            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">

                <div className="overflow-x-auto">

                    <div className='flex justify-between'>
                        <div className='text-2xl font-bold mt-5 ml-5'>
                            <h2>Active Orders</h2>
                        </div>

                    </div>


                    {/* Filters */}

                    <div className='flex gap-10 mt-5 ml-5'>

                        <div className='relative'>
                            <HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 cursor-pointer'/>
                            <input type='text' placeholder='Search' value={searchQuery} onChange={handleInputSearch} className='text-sm focus:outline-none active:outline-none h-10 w-[12rem] md:w-[20rem] border border-gray-300 rounded-md px-4 pl-11 pr-4'/>
                        </div>

                        <span>Start Date</span>
                        <input type='date' value={startDate} onChange={handleStartDate}  className='text-sm focus:outline-none h-10 w-[12rem] border border-gray-300 rounded-md px-4'/>

                        <span>End Date</span>
                        <input type='date' value={endDate} onChange={handleEndDate}  className='text-sm focus:outline-none h-10 w-[12rem] border border-gray-300 rounded-md px-4'/>



                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="text-sm focus:outline-none h-10 w-[12rem] border border-gray-300 rounded-md px-4"
                        >
                            <option value="">Select Status</option>
                            <option value="delivered">Delivered</option>
                            <option value="not-delivered">Not Delivered</option>
                            <option value="paid">Paid</option>
                            <option value="not-paid">Not Paid</option>
                        </select>
                    </div>

                    <table className="w-full text-center text-sm font-light text-surface dark:text-white">

                        <thead className="border-b border-neutral-200 font-medium dark:border-white/10">

                            <tr>

                                <th scope="col" className="px-6 py-4">Order ID</th>
                                <th scope="col" className="px-6 py-4">Email</th>
                                <th scope="col" className="px-6 py-4">Delivery Status</th>
                                <th scope="col" className="px-6 py-4">Payment Status</th>
                                <th scope="col" className="px-6 py-4">Order Journey</th>
                                <th scope="col" className="px-6 py-4">Total Price</th>
                                <th scope="col" className="px-6 py-4">Created_at</th>
                                <th scope="col" className="px-6 py-4">Order Status</th>
                                <th scope="col" className="px-6 py-4">Actions</th>
                            </tr>

                        </thead>

                        <tbody>
                            {currentProducts.map((order) => (
                                <tr key={order.id} className="border-b border-neutral-200 dark:border-white/10">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{order.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{order.email}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {
                                            order.isDelivered == 0 ? (
                                                <div className='flex items-center justify-center'>
                                                    <BiX fontSize={35} className='text-red-500'/>
                                                </div>
                                            ) : (
                                                <div className='flex items-center justify-center'>
                                                    <TiTick fontSize={35} className='text-green-500'/>
                                                </div>
                                            )
                                        }
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {
                                            order.isPaid == 0 ? (
                                                <div className='flex items-center justify-center'>
                                                    <BiX fontSize={35} className='text-red-500'/>
                                                </div>
                                            ) : (
                                                <div className='flex items-center justify-center'>
                                                    <TiTick fontSize={35} className='text-green-500'/>
                                                </div>
                                            )
                                        }
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        {
                                            order.orderJourney == 0 ? (
                                                <p className='font-semibold'>Received</p>
                                            ) : 
                                            order.orderJourney == 1 ? (
                                                <p className='font-semibold'>Processing</p>
                                            ) :
                                            order.orderJourney == 2 ? (
                                                <p className='font-semibold'>Shipping</p>
                                            ) : ''
                                        }
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">{order.totalPrice}</td>

                                    <td className="whitespace-nowrap px-6 py-4">{formatDate(order.created_at)}</td>


                                    <td className="whitespace-nowrap px-6 py-4">
                                        <button onClick={() => handleOrderUpdate(order.id)} className='text-center bg-blue-500 text-black w-32 h-8 rounded-md'>Change Status</button>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">

                                        <div className="flex gap-8 justify-center">
                                            <Link to={`/admin/orders/updateorder/${order.id}`} className='flex text-center justify-center bg-green-600 text-black w-12 h-8 rounded-md'>
                                                <button>view</button>
                                            </Link>     

                                            <button onClick={() => handleDelete(order.id)} className='text-center bg-red-500 text-black w-12 h-8 rounded-md'>Delete</button>                      
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>

                        {loading && (
                            <div className='absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50'>
                                <div className='bg-white p-4 rounded-lg'>
                                    <p className='text-3xl text-gray-800'>Loading...</p>
                                </div>
                            </div>
                        )}
                    </table>


                    <nav style={{left:'50%'}} className='flex text-center fixed justify-center bottom-5 md:bottom-3'>
                        {totalPages > 1 && (

                                <ul className='flex gap-5 md:gap-10 items-center'>
                                    <li className={`${currentPage === 1 ? 'hidden' : ''}`}>
                                        <button onClick={() => handleClick(currentPage -1)}>Previous</button>
                                    </li>

                                {[...Array(totalPages).keys()].map((page) => (
                                        <li key={page} className={`${currentPage === page + 1 ? 'active' : ''}`}>
                                        <button onClick={() => handleClick(page + 1)}>
                                                {page + 1}
                                        </button>
                                        </li>
                                    ))}
                                    <li className={`${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button onClick={() => handleClick(currentPage + 1)}>Next</button>
                                </li>
                            </ul>
                            )}
                    </nav>

                </div>
                
            </div>
        </div>
    </div>
  )
}

export default AdminOrder