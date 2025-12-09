import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { X } from "lucide-react";
import { baseUrl } from "../Api-Service/ApiUrls";

function UpadteSiteDetails({ openModal, handleClose }:any){
    if (!openModal) return null;
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data:any) => {
    setLoading(true);
    try {
    //   const payload = {
    //     ...data,
    //     updated_by: "Vendor",
    //     delivery_auth_token: "", // keep blank as in example
    //   };
    const payload ={
    payment_gateway_client_id: "rzp_live_N9L8M3E4qySTlw",
    delivery_partner_client_id: "udayadhanabal@gmail.com",
    payment_gateway_api_key: "t5lQi8Mf7NTpLpgKJRCKncCe",
    delivery_partner_api_key: "Ud@26122001justvy!",
    payment_gateway: "razorpay",
    delivery_partner: "shiprocket",
    delivery_auth_token: "",
    // own_delivery_charge: null,
    own_cod_delivery_charge: "0",
    // own_courier_company_id: null,
    updated_by: "Vendor",
    // id: 21,

}

      const response = await axios.put(
        `${baseUrl}/vendor-site-details/25/`,
        payload
      );

      if (response.status === 200) {
        alert("Data updated successfully!");
        reset();
      }
    } catch (error) {
      alert("Failed to update. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
  <div
    className="bg-white p-6 rounded-lg shadow-lg w-auto"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex justify-between">
      <h2 className="text-xl font-semibold mb-4">Add Your Address</h2>
      <span onClick={handleClose} className="cursor-pointer">
        <X />
      </span>
    </div>

    {/* <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4">Integration Setup</h2> */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Payment Gateway Client ID"
          {...register("payment_gateway_client_id")}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Payment Gateway API Key"
          {...register("payment_gateway_api_key")}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Delivery Partner Client ID"
          {...register("delivery_partner_client_id")}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Delivery Partner API Key"
          {...register("delivery_partner_api_key")}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Payment Gateway (e.g. razorpay)"
          {...register("payment_gateway")}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Delivery Partner (e.g. shiprocket)"
          {...register("delivery_partner")}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Own COD Delivery Charge"
          {...register("own_cod_delivery_charge")}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF69B4] text-white px-4 py-2 rounded hover:bg-[#C71585]"
        >
          {loading ? "Updating..." : "Update Details"}
        </button>
      </form>
    {/* </div> */}
    </div>
    </div>
  );
};

export default UpadteSiteDetails;
