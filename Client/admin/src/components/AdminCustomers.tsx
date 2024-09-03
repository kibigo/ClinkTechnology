import { useEffect, useState } from 'react'
import {HiOutlineSearch } from 'react-icons/hi'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }


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
    <div className="overflow-x-auto overflow-y-auto">

        <div className='flex justify-between'>

            <div className='text-2xl font-bold mt-5 ml-5'>
                <h2>Active Customers</h2>
            </div>

            <div className='mt-5 mr-5'>
                <a href='/admin/addcustomer'>
                    <button className='bg-blue-600 rounded-md h-10 w-40 text-white'>Add New Customer</button>
                </a>
            </div>
        </div>

        <div className='relative mt-5 ml-5'>
            <HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 cursor-pointer'/>
            <input type='text' placeholder='Search' value={searchQuery} onChange={handleInputSearch} className='text-sm focus:outline-none active:outline-none h-10 w-[12rem] md:w-[20rem] border border-gray-300 rounded-md px-4 pl-11 pr-4'/>
        </div>

        <table className="block text-gray-500 text-center w-1 h-[46rem]">

            <thead className="sticky top-0 text-gray-700 uppercase">

                <tr>
                    <th className="px-5 py-3">User_ID</th>
                    <th className="px-5 py-3">First Name</th>
                    <th className="px-5 py-3">Second Name</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Created_at</th>
                    <th className="px-5 py-3">Updated_at</th>
                    <th className='px-5 py-3'>
                        <span>Actions</span>
                    </th>
                </tr>
            </thead>

            <tbody>
                {users.map((user) => (
                    <tr key={user.id} className='border-b'>
                        <td className='px-4 py-3'>{user.id}</td>
                        <td className='px-4 py-3'>{user.first_name}</td>
                        <td className='px-4 py-3'>{user.last_name}</td>
                        <td className='px-4 py-3'>{user.email}</td>
                        <td className='px-4 py-3'>{formatDate(user.created_at)}</td>
                        <td className='px-4 py-3'>{formatDate(user.updated_at)}</td>
                        <td className='px-6 py-3 flex gap-10'>
                            <Link to={`/admin/userdetails/${user.id}`} className='flex bg-green-600 items-center justify-center gap-2 w-20 h-8 rounded-md'>
                                <FiEdit className='text-white'/> 
                                <button className='text-white'>Edit</button>
                            </Link>

                            <div className='flex bg-red-600 items-center justify-center gap-2 w-20 h-8 rounded-md'>
                                <RiDeleteBin6Line className='text-white'/> 
                                <button onClick={() => handleDelete(user.id)} className='text-white'>Delete</button>
                            </div>
                            
                        </td>
                    </tr>
                ))}
            </tbody>

            {loading && (
                <tfoot>
                    <tr>
                        <td colSpan={6} className='text-center text-2xl p-4'>Loading...</td>
                    </tr>
                </tfoot>
            )}
        </table>
    </div>
  )
}

export default AdminCustomers