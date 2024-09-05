import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import Swal from 'sweetalert2';



interface OrderItem{
    id:number;
    orderId:number;
    name:string;
    price:number;
    quantity:number;
}


interface Shipment{
    id:number;
    orderId:number;
    regionName:string;
    phone:number;
    country:string;
    city:string;
    address:string;
    price:number;
}

const UpdateOrder:React.FC = () =>{

    const [orderItem, setOrderItem] = useState<OrderItem[]>([]);

    const [shipment, setShipment] = useState<Shipment | null>(null);

    const token = getCookie('jwt');

    const {id} = useParams();


    useEffect(() => {

        const fetchItems = async () => {

            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log(response.data)
                // console.log(typeof(response.data.shipment))
                setOrderItem(response.data.order);
                setShipment(response.data.shipment);
            } catch (error) {
                console.error('Error fetching orderItems:', error);
            }
        };

        fetchItems();
    }, [token]);



    const handleDelete = (id: number) => {
        
        axios.delete(`http://127.0.0.1:8000/api/deleteorderitem/${id}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {

            const updatedProducts = orderItem.filter(item => item.id !== id);
            console.log("delete response",updatedProducts);
            setOrderItem(updatedProducts);

            Swal.fire({
                title:'delete',
                text:'Product deleted',
                icon:'success'
            });

            //return response.data;
        })
    }

  return (
    <>
    <div className="flex flex-col overflow-x-auto">

        <div className="sm:mx-6 lg:-mx-8">

            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">

                <div className="overflow-x-auto">

                    <div className="w-full border-b">
                        <h2 className="text-2xl font-semibold ml-3 text-slate-800">Order Items</h2>
                    </div>

                    <table className="w-3/4 text-center text-sm font-light text-surface dark:text-white">

                        <thead className="border-b border-neutral-200 font-medium dark:border-white/10">

                            <tr>

                                <th scope="col" className="px-6 py-4">Order Id</th>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Price</th>
                                <th scope="col" className="px-6 py-4">Quantity</th>
                                <th scope="col" className="px-6 py-4">Actions</th>
                            </tr>

                        </thead>

                        <tbody>
                            {orderItem.map((item) => (
                                <tr key={item.id} className="border-b border-neutral-200 dark:border-white/10">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{item.orderId}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.price}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{item.quantity}</td>
                                    <td className="whitespace-nowrap px-6 py-4">

                                        <div className="flex gap-8 justify-center">
                                            <Link to={`/admin/orders/updateorderitem/${item.id}`} className='flex text-center justify-center bg-green-600 text-black w-12 h-8 rounded-md'>
                                                <button>Edit</button>
                                            </Link>

                                            <button onClick={() => handleDelete(item.id)} className='text-center bg-red-500 text-black w-12 h-8 rounded-md'>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>
    </div>



{/* DESTINATION TABLE */}


    <div className="flex flex-col overflow-x-auto mt-40">

        <div className="sm:mx-6 lg:-mx-8">

            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">

                <div className="overflow-x-auto">

                    <div className="w-full border-b">
                        <h2 className="text-2xl font-semibold ml-3 text-slate-800">Shipment</h2>
                    </div>

                    <table className="w-3/4 text-center text-sm font-light text-surface dark:text-white">

                        <thead className="border-b border-neutral-200 font-medium dark:border-white/10">

                            <tr>

                                <th scope="col" className="px-6 py-4">Order Id</th>
                                <th scope="col" className="px-6 py-4">Region Name</th>
                                <th scope="col" className="px-6 py-4">Country</th>
                                <th scope="col" className="px-6 py-4">City</th>
                                <th scope="col" className="px-6 py-4">Address</th>
                                <th scope="col" className="px-6 py-4">Price</th>
                                <th scope="col" className="px-6 py-4">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {shipment && (

                                <tr className="border-b border-neutral-200 dark:border-white/10">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{shipment.orderId}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{shipment.regionName}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{shipment.country}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{shipment.city}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{shipment.address}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{shipment.price}</td>
                                    <td className="whitespace-nowrap px-6 py-4">

                                        <div className="flex gap-8 justify-center">
                                            <Link to={`/admin/orders/updateshipment/${shipment.id}`} className='flex text-center justify-center bg-green-600 text-black w-12 h-8 rounded-md'>
                                                <button>Edit</button>
                                            </Link>

                                            <button className='text-center bg-red-500 text-black w-12 h-8 rounded-md'>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>
    </div>
    </>
  )
}

export default UpdateOrder