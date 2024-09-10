

import axios from "axios";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import { getCookie } from "typescript-cookie";


function Settings() {

    const initialFormData = {
        id:"",
        first_name:"",
        last_name:"",
        email:"",
        phone_number:"",
        password:"",
    }


    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState(initialFormData);

    const token = getCookie('jwt');

    useEffect(() => {
        setLoading(true);

        axios.get('http://127.0.0.1:8000/api/profile', {
            headers:{
                Authorization :`Bearer ${token}`
            }
        })
        .then((response) => {
            console.log(response.data);
            setFormData(response.data);
            setLoading(false)
        })
        .catch((error) => {
            console.error('Errorr fetching product id', error);
            setLoading(false);
        })
    }, [])


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const key = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [key]: value});
    };



    const handleUpdateProduct = async (event:FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();

        setLoading(true);

        try{
            const response = await axios.post('http://127.0.0.1:8000/api/editprofile', formData, {
                headers:{
                    Authorization :`Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            });

            Swal.fire({
                title:'Update',
                text:response.data.message,
                icon:'success'
            });
            
            //console.log(response);
            //setFormData(initialFormData);
            setLoading(false);

        }catch(error: unknown){
            console.log('Error updating product details', error);
            setLoading(false);

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

        }
    }



  return (

    <div className="flex flex-col items-center overflow-auto h-screen">

        <div className="w-3/4 md:w-1/2">

            <h3 className="text-3xl text-cyan-900 font-bold">Update Profile</h3>
            <h4 className="text-xl text-gray-500 mt-4">Please enter details</h4>


            <form className="space-y-4" onSubmit={handleUpdateProduct} encType="multipart/form-data">
                

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
                    <label className="block text-sm mb-2 font-medium text-gray-600">Phone</label>
                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} type="number" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>

                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Password</label>
                    <input name="password" value={formData.password} onChange={handleChange} type="password" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>

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

export default Settings