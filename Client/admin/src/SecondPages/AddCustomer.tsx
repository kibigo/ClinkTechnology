

import { useState, FormEvent, ChangeEvent } from "react"
import axios from "axios";
import Swal from "sweetalert2";
import { getCookie } from "typescript-cookie";

function AddCustomer() {

    const [loading, setLoading] = useState(false);

    const token = getCookie('jwt');


    const initialFormData = {
        first_name:"",
        last_name:"",
        email:"",
        phone_number:"",
        password:"",
        password_confirmation:"",
        user_type:""
    };

    const [formData, setFormData] = useState(initialFormData);


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const key = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [key]: value});
    };




    const handleSelect = (event:ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [key]: value})
    }


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        setLoading(true);

        try {
            await axios.post('http://127.0.0.1:8000/api/createuser', formData, {
                headers: {
                  'Content-Type' : 'application/json',
                  Authorization :`Bearer ${token}`
                }
            });

            console.log(formData);

            Swal.fire({
                title:"User added",
                text:"User added",
                icon:"success"
            });
            setFormData(initialFormData);

            

        } catch (error) {
            console.log(error);

            if(axios.isAxiosError(error)){
                Swal.fire({
                    icon:"error",
                    title:"Ooops...",
                    text:error.response?.data.message
                });
            }
            else if(error instanceof Error){
                Swal.fire({
                    icon:"error",
                    title:"Ooops...",
                    text:error.message
                });
            }else{
                Swal.fire({
                    icon:"error",
                    title:"Ooops...",
                    text:"Unexpected error occurred"
                });
            }
        
        } finally {
            setLoading(false);
        }
        

    }

  return (
    
    <div className="flex flex-col items-center overflow-auto h-screen">

        <div className="w-3/4 md:w-1/2">

            <h3 className="text-3xl text-cyan-900 font-bold">Add User</h3>
            <h4 className="text-xl text-gray-500 mt-4">Please enter details</h4>


            <form className="space-y-4" onSubmit={handleSubmit}>
                
                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">First Name</label>
                    <input name="first_name" value={formData.first_name} onChange={handleChange} type="name" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Last Name</label>
                    <input name="last_name" value={formData.last_name} onChange={handleChange} type="name" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} type="email" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>

                </div>


                <div className="mt-1 mb-6">
                    <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} type="number" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm font-medium text-gray-600">Password</label>
                    <input name="password" value={formData.password} onChange={handleChange} type="password" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                    <input name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} type="password" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm font-medium text-gray-600">Category</label>
                    <div className="mt-1">
                       
                        <select name="user_type" value={formData.user_type} onChange={handleSelect} className="w-1/2 py-1 text-gray-900 shadow-sm">
                            <option value="">User Type</option>
                            <option value="0">Admin</option>
                            <option value="1">Customer</option>
                        </select>
                    </div>
                </div>


                <div className="text-center">
                    <button type="submit" className="rounded-md px-10 bg-blue-600 font-semibold hover:bg-green-900 cursor-pointer text-white text-2xl">Save</button>
                </div>

            </form>

        </div>
        {loading && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-lg font-semibold">Loading...</p>
                </div>
            </div>
        )}
    </div>
  )
}

export default AddCustomer