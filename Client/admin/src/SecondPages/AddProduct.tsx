import { useState, FormEvent, ChangeEvent } from "react"
import axios from "axios";
import Swal from "sweetalert2";
import { getCookie } from "typescript-cookie";

function AddProduct() {

    const [loading, setLoading] = useState(false);

    const token = getCookie('jwt');


    const initialFormData = {
        name:"",
        description:"",
        price:"",
        quantity:"",
        category:""
    };

    const [formData, setFormData] = useState(initialFormData);
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const key = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [key]: value});
    };

    const handleFileChange = (event:ChangeEvent<HTMLInputElement>) => {
      if(event.target.files && event.target.files?.length > 0){
        setFile(event.target.files[0]);
      }
    }

    const handleTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const key = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [key]: value});
    }

    const handleSelect = (event:ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [key]: value})
    }


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        setLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("quantity", formData.quantity);
        data.append("category", formData.category);

        if(file){
          data.append("file", file);
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/addproduct', data, {
                headers: {
                  'Content-Type' : 'multipart/form-data',
                  Authorization :`Bearer ${token}`
                }
            });

            Swal.fire({
                title:"Product added",
                text:"Product added",
                icon:"success"
            });
            setFormData(initialFormData);
            setFile(null);
            

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon:"error",
                title:"Ooops...",
                text:"Something went wrong"
            });
        
        } finally {
            setLoading(false);
        }
        

    }

  return (
    
    <div className="flex flex-col items-center overflow-auto h-screen">

        <div className="w-3/4 md:w-1/2">

            <h3 className="text-3xl text-cyan-900 font-bold">Add Product</h3>
            <h4 className="text-xl text-gray-500 mt-4">Please enter details</h4>


            <form className="space-y-4" onSubmit={handleSubmit}>
                
                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} type="name" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleTextArea} placeholder="Maximum 255 characters" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>

                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm font-medium text-gray-600">Product Image</label>
                    <input name="file" onChange={handleFileChange} type="file" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm font-medium text-gray-600">Price</label>
                    <input name="price" value={formData.price} onChange={handleChange} type="number" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm font-medium text-gray-600">Quantity</label>
                    <input name="quantity" value={formData.quantity} onChange={handleChange} type="number" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm font-medium text-gray-600">Category</label>
                    <div className="mt-1">
                       
                        <select name="category" value={formData.category} onChange={handleSelect} className="w-1/2 py-1 text-gray-900 shadow-sm">
                            <option value="">Category</option>
                            <option value="0">Computer Accessories</option>
                            <option value="1">Development Platform</option>
                            <option value="2">Aeronautics And Robotics</option>
                            <option value="3">Battery And Chargers</option>
                            <option value="4">Electronic Components</option>
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

export default AddProduct