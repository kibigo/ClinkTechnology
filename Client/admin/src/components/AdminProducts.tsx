import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {HiOutlineSearch } from 'react-icons/hi'
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from 'typescript-cookie';

interface Product {
    id: number;
    name: string;
    category: number;
    quantity: number;
    description: string;
    price: number;
    is_delete:number;
}


const AdminProduct:React.FC = () => {

    //const linkClasses = "z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600";
    //const [isOpen, setIsOpen] = useState<boolean[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [products, setProduct] = useState<Product[]>([]);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const jwtToken = getCookie('jwt');

    //Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const[itemsPerPage] = useState<number>(10);    

    useEffect(() => {

        const fetchUsers = async () => {

            setLoading(true);

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products', {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                });

                const filteredUser = response.data.filter((product: Product) => product.is_delete === 0);

                if (searchQuery === '') {
                    setProduct(filteredUser);
                } else {
                    const searchUser = filteredUser.filter((product: Product) =>
                        product.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setProduct(searchUser);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [searchQuery, jwtToken]);

    //pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    // console.log(products.length);

    const handleClick = (page: number) => {
        setCurrentPage(page);
    }

    const startIndex = (currentPage -1 ) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);



    const handleDelete = (id: number) => {
        setLoading(true);
        
        axios.delete(`http://127.0.0.1:8000/api/deleteproduct/${id}`,{
            headers:{
                Authorization :`Bearer ${jwtToken}`
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
  return (
    
    <div className="flex flex-col overflow-x-auto">

        <div className="sm:mx-6 lg:-mx-8">

            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">

                <div className="overflow-x-auto">

                    <div className='flex justify-between'>
                        <div className='text-2xl font-bold mt-5 ml-5'>
                            <h2>Products Available</h2>
                        </div>

                        <div className='mt-5 mr-5'>
                            <a href='/admin/products/addproduct'>
                                <button className='bg-blue-600 rounded-md h-10 w-40 text-white'>Add New Product</button>
                            </a>
                        </div>
                    </div>

                    <div className='relative mt-5 ml-5'>
                        <HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 cursor-pointer'/>
                        <input type='text' placeholder='Search' value={searchQuery} onChange={handleInputSearch} className='text-sm focus:outline-none active:outline-none h-10 w-[12rem] md:w-[20rem] border border-gray-300 rounded-md px-4 pl-11 pr-4'/>
                    </div>

                    <table className="w-full text-center text-sm font-light text-surface dark:text-white">

                        <thead className="border-b border-neutral-200 font-medium dark:border-white/10">

                            <tr>

                                <th scope="col" className="px-6 py-4">Product Name</th>
                                <th scope="col" className="px-6 py-4">Category</th>
                                <th scope="col" className="px-6 py-4">Quantity</th>
                                <th scope="col" className="px-6 py-4">Description</th>
                                <th scope="col" className="px-6 py-4">Price</th>
                                <th scope="col" className="px-6 py-4">Actions</th>
                            </tr>

                        </thead>

                        <tbody>
                            {currentProducts.map((product) => (
                                <tr key={product.id} className="border-b border-neutral-200 dark:border-white/10">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{product.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {
                                            product.category == 0 ? 'Computer Accessories':  
                                            product.category == 1 ? 'Development Platform' :  
                                            product.category == 2 ? 'Aeronautics And Robotics':
                                            product.category == 3 ? 'Battery And Chargers':
                                            product.category == 4 ? 'Electronic Components':
                                            product.category == 5 ? 'Gyro And Accelerometer':
                                            product.category == 6 ? 'Integrated Circuits': null    
                                        }
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">{product.quantity}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{product.description}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{product.price}</td>
                                    <td className="whitespace-nowrap px-6 py-4">

                                        <div className="flex gap-8 justify-center">
                                            <Link to={`/admin/products/updateproduct/${product.id}`} className='flex text-center justify-center bg-green-600 text-black w-12 h-8 rounded-md'>
                                                <button>Edit</button>
                                            </Link>     

                                            <button onClick={() => handleDelete(product.id)} className='text-center bg-red-500 text-black w-12 h-8 rounded-md'>Delete</button>                      
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

export default AdminProduct