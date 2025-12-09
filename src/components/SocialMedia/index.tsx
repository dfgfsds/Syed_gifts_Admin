import React, { useState, useEffect } from 'react';
import {
    FaWhatsapp,
    FaPhoneAlt,
    FaComments,
    FaFacebook,
    FaYoutube,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
} from 'react-icons/fa';
import { getVendorWithSiteDetailsApi, putVendorWithSiteDetailsApi } from '../../Api-Service/Apis';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export default function SocialMedia() {
    const [data, setData] = useState<any>(null);
    const [selectedIcon, setSelectedIcon] = useState<any>(null);
    const [modalData, setModalData] = useState<any>({
        status: false,
        url: '',
        value: '',
        alignment: 'bottom-left',
        position: '0',
    });
    const [modalSection, setModalSection] = useState<string>('');
    const [modalKey, setModalKey] = useState<string>('');
    const { id } = useParams<{ id: string }>();

    // ✅ Fetch vendor data
    const getVendorWithSiteDetailsData = useQuery({
        queryKey: ['getVendorWithSiteDetailsData', id],
        queryFn: () => getVendorWithSiteDetailsApi(`${id}/`),
    });

    const vendorSiteDetails = getVendorWithSiteDetailsData?.data?.data?.vendor_site_details;

    useEffect(() => {
        const vendorDetails = getVendorWithSiteDetailsData?.data?.data?.vendor_site_details;

        if (vendorDetails) {
            setData({
                social_media_icon: {
                    ...defaultData.social_media_icon,
                    ...(vendorDetails.social_media_icon || {}),
                },
                vendor_floating_icon: {
                    ...defaultData.vendor_floating_icon,
                    ...(vendorDetails.vendor_floating_icon || {}),
                },
            });
        } else {
            setData(defaultData);
        }
    }, [getVendorWithSiteDetailsData?.data?.data?.vendor_site_details]);



    const defaultData = {
        social_media_icon: {
            facebook: { status: false, url: '' },
            youtube: { status: false, url: '' },
            instagram: { status: false, url: '' },
            twitter: { status: false, url: '' },
            linkedin: { status: false, url: '' },
        },
        vendor_floating_icon: {
            whatsapp: { status: false, value: '', alignment: 'bottom-left', position: '0' },
            call: { status: false, value: '', alignment: 'bottom-left', position: '1' },
            chat: { status: false, value: '', alignment: 'bottom-right', position: '0' },
        },
    };

    const combinedData = data || defaultData;
    const { social_media_icon, vendor_floating_icon } = combinedData;

    // 🔹 Open modal
    const openModal = (section: string, key: string, values: any) => {
        setModalSection(section);
        setModalKey(key);
        setModalData({
            status: values.status || false,
            url: values.url || '',
            value: values.value || '',
            alignment: values.alignment || 'bottom-left',
            position: values.position || '0',
        });
        setSelectedIcon(key);
    };

    // 🔹 Update data
    const handleUpdate = async () => {
        let cleanModalData = { ...modalData };

        // remove unwanted fields based on section
        if (modalSection === 'social_media_icon') {
            delete cleanModalData.value;
            delete cleanModalData.alignment;
            delete cleanModalData.position;
        } else if (modalSection === 'vendor_floating_icon') {
            delete cleanModalData.url;
        }

        const updatedData = {
            ...combinedData,
            [modalSection]: {
                ...combinedData[modalSection],
                [modalKey]: cleanModalData,
            },
        };

        // final payload
        const payload =
            modalSection === 'social_media_icon'
                ? {
                    social_media_icon: updatedData.social_media_icon,
                    updated_by: 'User',
                }
                : {
                    vendor_floating_icon: updatedData.vendor_floating_icon,
                    updated_by: 'User',
                };

        try {
            const updateApi = await putVendorWithSiteDetailsApi(
               `${vendorSiteDetails?.id}/`,
                payload
            );
            if (updateApi) {
                toast.success('✅ Updated successfully!');
                setSelectedIcon(null);
                setData(updatedData); // ✅ update UI immediately
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Update failed');
            console.error('❌ Update failed:', err);
        }
    };

    // 🔹 Icon map
    const iconsMap: any = {
        facebook: <FaFacebook className="text-blue-600 text-3xl cursor-pointer mx-auto" />,
        youtube: <FaYoutube className="text-red-500 text-3xl cursor-pointer mx-auto" />,
        instagram: <FaInstagram className="text-pink-500 text-3xl cursor-pointer mx-auto" />,
        twitter: <FaTwitter className="text-sky-500 text-3xl cursor-pointer mx-auto" />,
        linkedin: <FaLinkedin className="text-blue-700 text-3xl cursor-pointer mx-auto" />,
        whatsapp: <FaWhatsapp className="text-green-500 text-3xl cursor-pointer mx-auto" />,
        call: <FaPhoneAlt className="text-blue-500 text-3xl cursor-pointer mx-auto" />,
        chat: <FaComments className="text-purple-500 text-3xl cursor-pointer mx-auto" />,
    };

    return (
        <div className="py-5">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Social Media Settings</h2>

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-6">
                {Object.entries(social_media_icon).map(([key, val]: any) => (
                    <div key={key} onClick={() => openModal('social_media_icon', key, val)}>
                        {iconsMap[key]}
                        <p className="text-center capitalize mt-1 text-sm">{key}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Floating Icons</h2>

            {/* Floating Vendor Icons */}
            <div className="flex flex-wrap gap-6">
                {Object.entries(vendor_floating_icon).map(([key, val]: any) => (
                    <div key={key} onClick={() => openModal('vendor_floating_icon', key, val)}>
                        {iconsMap[key]}
                        <p className="text-center capitalize mt-1 text-sm">{key}</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedIcon && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
                    onClick={() => setSelectedIcon(null)}
                >
                    <div
                        className="bg-white/90 rounded-2xl p-6 w-[400px] shadow-2xl border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 capitalize">
                            Edit {modalKey} Settings
                        </h3>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between mb-5">
                            <label className="font-medium text-gray-700">Active</label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={modalData.status}
                                    onChange={(e) => setModalData({ ...modalData, status: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all">
                                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></span>
                                </div>
                            </label>
                        </div>

                        {/* Input field */}
                        <div className="flex flex-col mb-4">
                            <label className="font-medium mb-1 text-gray-700">
                                {modalSection === 'social_media_icon' ? 'URL' : 'Value'}
                            </label>
                            <input
                                type="text"
                                value={modalData.url || modalData.value || ''}
                                onChange={(e) =>
                                    setModalData({
                                        ...modalData,
                                        url: e.target.value,
                                        value: e.target.value,
                                    })
                                }
                                className="border border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 text-sm"
                                placeholder={
                                    modalSection === 'social_media_icon'
                                        ? 'Enter URL'
                                        : 'Enter phone number or chat link'
                                }
                            />
                        </div>

                        {/* Alignment & Position (only for vendor_floating_icon) */}
                        {modalSection === 'vendor_floating_icon' && (
                            <>
                                <div className="flex flex-col mb-4">
                                    <label className="font-medium mb-1 text-gray-700">Alignment</label>
                                    <select
                                        value={modalData.alignment}
                                        onChange={(e) => setModalData({ ...modalData, alignment: e.target.value })}
                                        className="border border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="bottom-left">Bottom Left</option>
                                        <option value="bottom-right">Bottom Right</option>
                                    </select>
                                </div>

                                <div className="flex flex-col mb-6">
                                    <label className="font-medium mb-1 text-gray-700">Position</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={modalData.position}
                                        onChange={(e) => setModalData({ ...modalData, position: e.target.value })}
                                        className="border border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedIcon(null)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:opacity-90"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}