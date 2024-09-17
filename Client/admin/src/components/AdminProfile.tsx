import axios from "axios"
import { useEffect, useState } from "react"
import { getCookie } from "typescript-cookie"


interface User{
    id:number;
    first_name:string;
    last_name:string;
    email:string;
    phone_number:number;
    created_at:string;
    updated_at:string;
    user_type:number;
}

function AdminProfile() {

    const[user, setUser] = useState<User | null >(null);


    const jwtToken = getCookie('jwt');


    useEffect (() => {

        axios.get('http://127.0.0.1:8000/api/profile', {
            headers:{
                Authorization: `Bearer ${jwtToken}`
            }
        })
        .then((response) => {
            setUser(response.data);
        })
        console.log("The user profile is: ", user? user.id : '');

    }, []);

  return (
    <div className="flex flex-col items-center overflow-auto h-screen">

       {user? (
         <div className="w-3/4 md:w-1/2">

         <div>
            <img className="rounded-full w-80 h-80" src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1726512700~exp=1726516300~hmac=afa80b29a621f308a76d4183c588e45f86057de59989bf1f8698e229f9a57f9c&w=826"/>
         </div>

         <form className="space-y-4">
             

             <div className="mt-1 mb-6">
                 <label className="block text-sm mb-2 font-medium text-gray-600">First Name</label>
                 <p className="">{user.first_name}</p>

             </div>

             <div className="mt-1 mb-6">
                 <label className="block text-sm mb-2 font-medium text-gray-600">Last Name</label>
                 <p>{user.last_name}</p>

             </div>


             <div className="mt-1 mb-6">
                 <label className="block text-sm mb-2 font-medium text-gray-600">Email</label>
                 <p>{user.email}</p>

             </div>

             <div className="mt-1 mb-6">
                 <label className="block text-sm mb-2 font-medium text-gray-600">Phone</label>
                 <p>{user.phone_number}</p>

             </div>

             <div className="mt-1 mb-6">
                 <label className="block text-sm mb-2 font-medium text-gray-600">Role</label>
                 <p>{user.user_type == 0 ? 'Admin' : 'Customer'}</p>

             </div>



         </form>

     </div>
       ) : ''}
    </div>
  )
}

export default AdminProfile