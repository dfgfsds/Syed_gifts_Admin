import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Loader, X } from "lucide-react";
import Input from "../../components/Input";
import { useParams } from "react-router-dom";
import { postDtdcCreateApi, putVendorWithSiteDetailsApi, updateDtdcCreateApi } from "../../Api-Service/Apis";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function DeliveryModal({ handleClose, vendorSiteDetails, deliveryEditData }: any) {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const validationSchema = Yup.object().shape({
        delivery_partner: Yup.string().required("Please select a delivery partner"),

        // Shiprocket Fields
        delivery_partner_client_id: Yup.string().when("delivery_partner", {
            is: "shiprocket",
            then: (schema) => schema.required("Client ID is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        delivery_partner_api_key: Yup.string().when("delivery_partner", {
            is: "shiprocket",
            then: (schema) => schema.required("API Key is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        // Own Delivery Fields
        own_courier_company_id: Yup.string().when("delivery_partner", {
            is: "own_delivery",
            then: (schema) => schema.required("Courier company ID is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        own_cod_delivery_charge: Yup.string().when("delivery_partner", {
            is: "own_delivery",
            then: (schema) => schema.required("COD delivery charge is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        own_delivery_charge: Yup.string().when("delivery_partner", {
            is: "own_delivery",
            then: (schema) => schema.required("Delivery charge is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        customer_code: Yup.string().when("delivery_partner", {
            is: "dtdc_delivery_partner",
            then: (schema) => schema.required("Customer Code is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        delivery_partner_token: Yup.string().when("delivery_partner", {
            is: "dtdc_delivery_partner",
            then: (schema) => schema.required("Token is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        delivery_partner_api_key_dtdc: Yup.string().when("API Key is required", {
            is: "dtdc_delivery_partner",
            then: (schema) => schema.required("Token is required"),
            otherwise: (schema) => schema.notRequired(),
        }),



        pricing_data: Yup.array().when("delivery_partner", {
            is: "dtdc_delivery_partner",
            then: () =>
                Yup.array().of(
                    Yup.object().shape({
                        service_type: Yup.string().required("Service type is required"),
                        destination: Yup.string().required("Destination is required"),
                        charge_for_initial_500gms: Yup.string().required("Initial charge is required"),
                        charge_for_additional_500gms: Yup.string().required("Additional charge is required"),
                        cod_charges: Yup.string().required("COD charges are required"),
                        cod_percent: Yup.string().required("COD percent is required"),
                        declared_value_of_fixed_cod_charge: Yup.string().required("Fixed COD charge is required"),
                        declared_value_of_cod_charge_percentage_in_range: Yup.string().required("COD range is required"),
                    })
                ),
            otherwise: () => Yup.array().notRequired(),
        }),
    });


    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control,
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            delivery_partner: "",
            delivery_partner_client_id: "",
            delivery_partner_api_key: "",
            own_courier_company_id: "",
            own_cod_delivery_charge: "",
            own_delivery_charge: "",
            customer_code: "",
            delivery_partner_api_key_dtdc: "",
            delivery_partner_token: "",
            pricing_data: [
                {
                    service_type: '',
                    destination: '',
                    charge_for_initial_500gms: '',
                    charge_for_additional_500gms: '',
                    cod_charges: '',
                    cod_percent: '',
                    declared_value_of_fixed_cod_charge: '',
                    declared_value_of_cod_charge_percentage_in_range: '',
                },
            ]
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricing_data',
    });
    const deliveryPartner = watch("delivery_partner");

    useEffect(() => {
        if (deliveryEditData) {
            setValue("delivery_partner", deliveryEditData?.vendor_site_details?.delivery_partner || "");

            //   if (deliveryEditData?.delivery_partner === "shiprocket") {
            setValue("delivery_partner_client_id", deliveryEditData?.vendor_site_details?.delivery_partner_client_id || "");
            setValue("delivery_partner_api_key", deliveryEditData?.vendor_site_details?.delivery_partner_api_key || "");
            //   }

            //   if (deliveryEditData?.delivery_partner === "own_delivery") {
            setValue("own_courier_company_id", deliveryEditData?.vendor_site_details?.own_courier_company_id || "");
            setValue("own_cod_delivery_charge", deliveryEditData?.vendor_site_details?.own_cod_delivery_charge || "");
            setValue("own_delivery_charge", deliveryEditData?.vendor_site_details?.own_delivery_charge || "");
            //   }

            //   if (deliveryEditData?.delivery_partner === "dtdc_delivery_partner") {
            setValue("customer_code", deliveryEditData?.delivery_partner_dtdc_details?.customer_code || "");
            setValue("delivery_partner_api_key_dtdc", deliveryEditData?.delivery_partner_dtdc_details?.delivery_partner_api_key || "");
            setValue("delivery_partner_token", deliveryEditData?.delivery_partner_dtdc_details?.delivery_partner_token || "");

            if (deliveryEditData?.dtdc_pricing_data?.length) {
                deliveryEditData.dtdc_pricing_data.forEach((item: any, index: number) => {
                    setValue(`pricing_data.${index}.id`, item?.id || "");
                    setValue(`pricing_data.${index}.service_type`, item.service_type || "");
                    setValue(`pricing_data.${index}.destination`, item.destination || "");
                    setValue(`pricing_data.${index}.charge_for_initial_500gms`, item.charge_for_initial_500gms || "");
                    setValue(`pricing_data.${index}.charge_for_additional_500gms`, item.charge_for_additional_500gms || "");
                    setValue(`pricing_data.${index}.cod_charges`, item.cod_charges || "");
                    setValue(`pricing_data.${index}.cod_percent`, item.cod_percent || "");
                    setValue(`pricing_data.${index}.declared_value_of_fixed_cod_charge`, item.declared_value_of_fixed_cod_charge || "");
                    setValue(`pricing_data.${index}.declared_value_of_cod_charge_percentage_in_range`, item.declared_value_of_cod_charge_percentage_in_range || "");
                });
                // }
            }
        }
    }, [deliveryEditData, setValue]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        setErrorMsg("");
        let payload = {};
        try {
            if (deliveryPartner === "shiprocket") {
                payload = {
                    delivery_partner: data?.delivery_partner,
                    delivery_partner_client_id: data?.delivery_partner_client_id,
                    delivery_partner_api_key: data?.delivery_partner_api_key,
                    updated_by: 'vendor'
                };
                const response = await putVendorWithSiteDetailsApi(
                    `${vendorSiteDetails?.vendor_site_details?.id}/`,
                    payload
                );
                if (response) {
                    queryClient.invalidateQueries(["getVendorWithSiteDetailsData"] as InvalidateQueryFilters);
                    handleClose();
                }
            } else if (deliveryPartner === "own_delivery") {
                payload = {
                    delivery_partner: data?.delivery_partner,
                    own_courier_company_id: data?.own_courier_company_id,
                    own_cod_delivery_charge: data?.own_cod_delivery_charge,
                    own_delivery_charge: data?.own_delivery_charge,
                    updated_by: 'vendor'

                };
                const response = await putVendorWithSiteDetailsApi(
                    `${vendorSiteDetails?.vendor_site_details?.id}/`,
                    payload
                );
                if (response) {
                    queryClient.invalidateQueries(["getVendorWithSiteDetailsData"] as InvalidateQueryFilters);
                    handleClose();
                }
            } else if (deliveryPartner === "dtdc_delivery_partner") {
                payload = {
                    dtdc_delivery_partner: {
                        id: `${id}`,
                        customer_code: data?.customer_code,
                        delivery_partner_api_key: data?.delivery_partner_api_key_dtdc,
                        delivery_partner_token: data?.delivery_partner_token,
                        created_by: `vendor${id}`
                    },
                    pricing_data: data?.pricing_data?.map((item: any) => ({
                        ...item,
                        id:item?.id,
                        vendor: `${id}`,
                        created_by: `vendor${id}`
                    }))

                };
                const Update = await putVendorWithSiteDetailsApi(
                    `${vendorSiteDetails?.vendor_site_details?.id}/`,
                    {delivery_partner:'dtdc', updated_by: 'vendor'}
                );
                if(deliveryEditData?.delivery_partner_dtdc_details?.customer_code || deliveryEditData?.vendor_site_details?.own_cod_delivery_charge){
                    const response = await updateDtdcCreateApi(`${id}/`,{...payload , updated_by:`vendor${id}`});
                    if (response) {
                        queryClient.invalidateQueries(["getVendorWithSiteDetailsData"] as InvalidateQueryFilters);
                        handleClose();
                    }
                }else{
                    const response = await postDtdcCreateApi(``,payload);
                    if (response) {
                        queryClient.invalidateQueries(["getVendorWithSiteDetailsData"] as InvalidateQueryFilters);
                        handleClose();
                    }
                }
                

            }

            handleClose();
            reset();

        } catch (err: any) {
            setLoading(false);
            setErrorMsg(err?.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false); // End loader
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white w-full max-w-lg mx-auto rounded-lg p-3 shadow-lg max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="flex justify-between font-bold mb-2">
                    <div>Add Delivery Partner</div>
                    <X className="cursor-pointer" onClick={handleClose} />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-2">
                        <label className="text-sm font-bold">Select Delivery Partner</label>
                        <select
                            className="w-full border px-3 py-2 h-10 rounded"
                            {...register("delivery_partner")}
                        >
                            <option value="">Select</option>
                            <option value="shiprocket">Shiprocket</option>
                            <option value="own_delivery">Own Delivery</option>
                            <option value="dtdc_delivery_partner">DTDC</option>
                        </select>
                        {errors.delivery_partner && (
                            <p className="text-red-500 text-sm">{errors.delivery_partner.message}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">


                        {/* Shiprocket Fields */}
                        {deliveryPartner === "shiprocket" && (
                            <>
                                <div>
                                    <Input label="Client ID" {...register("delivery_partner_client_id")} />
                                    {errors.delivery_partner_client_id && <p className="text-red-500 text-sm">{errors.delivery_partner_client_id.message}</p>}
                                </div>
                                <div>
                                    <Input label="API Key" {...register("delivery_partner_api_key")} />
                                    {errors.delivery_partner_api_key && <p className="text-red-500 text-sm">{errors.delivery_partner_api_key.message}</p>}
                                </div>
                            </>
                        )}

                        {/* Own Delivery Fields */}
                        {deliveryPartner === "own_delivery" && (
                            <>
                                <div>
                                    <Input label="Courier Company ID" {...register("own_courier_company_id")} />
                                    {errors.own_courier_company_id && <p className="text-red-500 text-sm">{errors.own_courier_company_id.message}</p>}
                                </div>
                                <div>
                                    <Input label="COD Delivery Charge" {...register("own_cod_delivery_charge")} />
                                    {errors.own_cod_delivery_charge && <p className="text-red-500 text-sm">{errors.own_cod_delivery_charge.message}</p>}
                                </div>
                                <div>
                                    <Input label="Delivery Charge" {...register("own_delivery_charge")} />
                                    {errors.own_delivery_charge && <p className="text-red-500 text-sm">{errors.own_delivery_charge.message}</p>}
                                </div>
                            </>
                        )}
                    </div>

                    {/* DTDC Fields */}
                    {deliveryPartner === "dtdc_delivery_partner" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Input label="Customer Code" {...register("customer_code")} />
                                    {errors.customer_code && <p className="text-red-500 text-sm">{errors.customer_code.message}</p>}
                                </div>
                                <div>
                                    <Input label="API Key" {...register("delivery_partner_api_key_dtdc")} />
                                    {errors.delivery_partner_api_key_dtdc && <p className="text-red-500 text-sm">{errors.delivery_partner_api_key_dtdc.message}</p>}
                                </div>
                                <div>
                                    <Input label="Token" {...register("delivery_partner_token")} />
                                    {errors.delivery_partner_token && <p className="text-red-500 text-sm">{errors.delivery_partner_token.message}</p>}
                                </div>
                            </div>
                            <h2 className="font-bold text-lg mt-5 mb-2 border-t">Pricing Data</h2>

                            {fields?.map((item: any, index) => (
                                <>
                                    <div className="text-lg mb-2 font-bold">
                                        Price {index + 1}
                                    </div>
                                    <div key={item?.id} className="grid grid-cols-2 gap-4">
                                        {/* <div>
                                            <Input label="Service Type" {...register(`pricing_data.${index}.service_type`)} />
                                            {(errors?.pricing_data?.[index] as any)?.service_type?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.service_type?.message}
                                                </p>
                                            )}

                                        </div> */}
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Service Type</label>
                                            <select
                                                {...register(`pricing_data.${index}.service_type`)}
                                                className="w-full px-3 py-2 border bg-white rounded-md focus:outline-none focus:ring-indigo-500"
                                            >
                                                <option value="">Select Service Type</option>
                                                <option value="B2C PRIORITY">B2C PRIORITY</option>
                                                <option value="B2C SMART EXPRESS">B2C SMART EXPRESS</option>
                                                <option value="B2C PREMIUM">B2C PREMIUM</option>
                                                <option value="B2C GROUND ECONOMY">B2C GROUND ECONOMY</option>
                                            </select>
                                            {(errors?.pricing_data?.[index] as any)?.service_type?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.service_type?.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* <div>
                                            <Input label="Destination" {...register(`pricing_data.${index}.destination`)} />
                                            {(errors?.pricing_data?.[index] as any)?.destination?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.destination?.message}
                                                </p>
                                            )}
                                        </div> */}

                                        <div>
                                            <label className="block text-sm font-bold mb-1">Destination</label>
                                            <select
                                                {...register(`pricing_data.${index}.destination`)}
                                                className="w-full px-3 py-2 border bg-white rounded-md focus:outline-none focus:ring-indigo-500"
                                            >
                                                <option value="">Select Destination</option>
                                                <option value="TAMIL NADU">TAMIL NADU</option>
                                                <option value="PONDICHERRY">PONDICHERRY</option>
                                                <option value="ANDHRAPRADESH">ANDHRAPRADESH</option>
                                                <option value="KARNATAKA">KARNATAKA</option>
                                                <option value="KERALA">KERALA</option>
                                                <option value="TELANGANA">TELANGANA</option>
                                                <option value="METRO">METRO</option>
                                                <option value="REST OF INDIA">REST OF INDIA</option>
                                                <option value="SPL DESTINATION">SPL DESTINATION</option>
                                            </select>
                                            {(errors?.pricing_data?.[index] as any)?.destination?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.destination?.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Input label="Charge for Initial 500gms" type='number' {...register(`pricing_data.${index}.charge_for_initial_500gms`)} />
                                            {(errors?.pricing_data?.[index] as any)?.charge_for_initial_500gms?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.charge_for_initial_500gms?.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Input label="Charge for Additional 500gms" type='number' {...register(`pricing_data.${index}.charge_for_additional_500gms`)} />
                                            {(errors?.pricing_data?.[index] as any)?.charge_for_additional_500gms?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.charge_for_additional_500gms?.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Input label="COD Charges" type='number' {...register(`pricing_data.${index}.cod_charges`)} />
                                            {(errors?.pricing_data?.[index] as any)?.cod_charges?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.cod_charges?.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Input label="COD Percent" type='number' {...register(`pricing_data.${index}.cod_percent`)} />
                                            {(errors?.pricing_data?.[index] as any)?.cod_percent?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.cod_percent?.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Input label="Declared Fixed COD Charge" type='number' {...register(`pricing_data.${index}.declared_value_of_fixed_cod_charge`)} />
                                            {(errors?.pricing_data?.[index] as any)?.declared_value_of_fixed_cod_charge?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.declared_value_of_fixed_cod_charge?.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Input label="COD % Charge Range"
                                                type="text"
                                                placeholder="2500-20000"
                                                {...register(`pricing_data.${index}.declared_value_of_cod_charge_percentage_in_range`)} />
                                            {(errors?.pricing_data?.[index] as any)?.declared_value_of_cod_charge_percentage_in_range?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {(errors?.pricing_data?.[index] as any)?.declared_value_of_cod_charge_percentage_in_range?.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => remove(index)} className="text-white bg-red-600 rounded-md text-sm ml-auto p-1 m-2"><X /></button>

                                </>
                            ))}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            service_type: '',
                                            destination: '',
                                            charge_for_initial_500gms: '',
                                            charge_for_additional_500gms: '',
                                            cod_charges: '',
                                            cod_percent: '',
                                            declared_value_of_fixed_cod_charge: '',
                                            declared_value_of_cod_charge_percentage_in_range: '',
                                        })
                                    }
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Add Pricing
                                </button>
                            </div>
                        </>
                    )}
                    {errorMsg && (<p className="text-red-500 justify-end flex mt-2">{errorMsg}</p>)}
                    <div className="mt-5 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded"
                        >Cancel</button>
                        <button
                            type="submit"
                            className="bg-[#FF69B4] hover:bg-[#C71585] text-white px-4 py-2 rounded"
                            disabled={loading}
                        >{loading ? (<div className="flex justify-between gap-1">Loading... <Loader /></div>) : 'Submit'}  </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeliveryModal;
