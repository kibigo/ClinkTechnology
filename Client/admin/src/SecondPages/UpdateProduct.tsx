import axios from "axios";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getCookie } from "typescript-cookie";


function UpdateProduct() {



    const initialFormData = {
        id:"",
        name:"",
        description:"",
        image_url:"",
        price:"",
        quantity:"",
        category:"",
    }

    const {id} = useParams();

    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState(initialFormData);

    const [file, setFile] = useState<File | null>(null);

    const token = getCookie('jwt');

    useEffect(() => {
        setLoading(true);

        axios.get(`http://127.0.0.1:8000/api/products/${id}`, {
            headers:{
                Authorization :`Bearer ${token}`
            }
        })
        .then((response) => {
            console.log(response.data[0]);
            setFormData(response.data[0]);
            setLoading(false)
        })
        .catch((error) => {
            console.error('Errorr fetching product id', error);
            setLoading(false);
        })
    }, [id])


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

    const handleUpdateProduct = async (event:FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();

        setLoading(true);

        const data = new FormData();
        data.append("id", formData.id);
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("quantity", formData.quantity);
        data.append("category", formData.category);

        if(file){
          data.append("file", file);
          console.log("FIle details: ", file);
        }

        //const hasFile = data.has('file');

        //console.log("Data from front", (formData));
        
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/updateproduct', data, {
                headers:{
                    Authorization :`Bearer ${token}`,
                    'Content-Type':'multipart/form-data'
                }
            });

            Swal.fire({
                title:'Update',
                text:response.data.message,
                icon:'success'
            });
            
            console.log(response);
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

            <h3 className="text-3xl text-cyan-900 font-bold">Edit Product Details</h3>
            <h4 className="text-xl text-gray-500 mt-4">Please enter details</h4>


            <form className="space-y-4" onSubmit={handleUpdateProduct} encType="multipart/form-data">
                
                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">ID</label>
                    <input name="id" value={formData.id} type="number" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                    
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} type="name" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>

                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleTextArea} placeholder="Maximum 255 characters" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>

                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Product Image</label>
                    <input name="file" onChange={handleFileChange} type="file" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
        
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Price</label>
                    <input name="price" value={formData.price} onChange={handleChange} type="number" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>

                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Quantity</label>
                    <input name="quantity" value={formData.quantity} onChange={handleChange} type="number" required className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="mt-1 mb-6">
                    <label className="block text-sm mb-2 font-medium text-gray-600">Category</label>
                    <div className="mt-1">
                       
                        <select name="category_id" value={formData.category} onChange={handleSelect} className="w-1/2 py-1 text-gray-900 shadow-sm">
                            <option value="">Category</option>
                            <option value="0">Computer Accessories</option>
                            <option value="1">Development Platform</option>
                            <option value="2">Aeronautics and Robotics</option>
                            <option value="3">Battery and Chargers</option>
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

export default UpdateProduct