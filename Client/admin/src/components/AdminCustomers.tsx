import { useEffect, useState } from 'react'
import {HiOutlineSearch } from 'react-icons/hi'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCookie } from 'typescript-cookie';



interface User{
    id:number;
    first_name:string;
    last_name:string;
    email:string;
    created_at:string;
    updated_at:string;
    user_type:number;
}

const AdminCustomers: React.FC = () => {

    const [users, setUsers] = useState<User[]>([]);

    const[loading, setLoading] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState<string>('');

    //const jwtToken = localStorage.getItem('jwtToken');
    const jwtToken = getCookie('jwt');



    useEffect(() => {

        const fetchUsers = async () => {

            setLoading(true);

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/allusers', {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                });

                const filteredUser = response.data.filter((user: User) => user.user_type === 1);
                
                
                if (searchQuery === '') {
                    setUsers(filteredUser);
                } else {
                    const searchUser = filteredUser.filter((user: User) =>
                        user.first_name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setUsers(searchUser);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [searchQuery, jwtToken]);

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };


    const handleDelete = (id: number) =>{
        setLoading(true);

        axios.delete(`http://127.0.0.1:8000/api/admin/deleteuser/${id}`, {
            headers:{
                Authorization :`Bearer ${jwtToken}`
            }
        })
        .then((response) => {

            setLoading(false);

            const updatedUsers = users.filter(user => user.id !== id);
            setUsers(updatedUsers);

            Swal.fire({
                title:'delete',
                text:'User deleted',
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
                            <h2>Active Customers</h2>
                        </div>


                        <div className='mt-5 mr-5'>
                            <a href='/admin/customers/addcustomer'>
                                <button className='bg-blue-600 rounded-md h-10 w-40 text-white'>Add New Customer</button>
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

                                <th scope="col" className="px-6 py-4">User ID</th>
                                <th scope="col" className="px-6 py-4">First Name</th>
                                <th scope="col" className="px-6 py-4">Second Name</th>
                                <th scope="col" className="px-6 py-4">Email</th>
                                <th scope="col" className="px-6 py-4">Created At</th>
                                <th scope="col" className="px-6 py-4">Updated At</th>
                                <th scope="col" className="px-6 py-4">Actions</th>
                            </tr>

                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-neutral-200 dark:border-white/10">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{user.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.first_name}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.last_name}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{formatDate(user.created_at)}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{formatDate(user.updated_at)}</td>
                                    <td className="whitespace-nowrap px-6 py-4">

                                        <div className="flex gap-8 justify-center">
                                            <Link to={`/admin/customers/updatecustomer/${user.id}`} className='flex text-center justify-center bg-green-600 text-black w-12 h-8 rounded-md'>
                                                <button>Edit</button>
                                            </Link>     

                                            <button onClick={() => handleDelete(user.id)} className='text-center bg-red-500 text-black w-12 h-8 rounded-md'>Delete</button>                      
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

                </div>
                
            </div>
        </div>
    </div>
  )
}

export default AdminCustomers