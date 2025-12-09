import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import { useParams } from "react-router-dom";
import SingleImageUpload from "../../components/products/SingleImageUpload";
import { baseUrl } from "../../Api-Service/ApiUrls";

// TODO: adjust paths to your actual components/utilities

// If you have a toast system, import it:
// import { toast } from "react-toastify";

const BASE_URL = `${baseUrl}/banners/`;

type Banner = {
    id: number;
    vendor: string;
    type: "Mobile View" | "Web View";
    image_url: string;
    title: string;
    subtitle: string;
    description: string;
    target_url: string;
    start_date: string; // ISO
    end_date: string;   // ISO
    created_by: string;
    updated_by?: string;
    // Backend may return additional fields—keep index signature to absorb them safely
    [key: string]: any;
};

type BannerFormState = {
    vendor: string;
    type: "Mobile View" | "Web View";
    image_url: string;
    title: string;
    subtitle: string;
    description: string;
    target_url: string;
    onclick_function: {
        track: string;
        redirect_type: string;
    };
    start_date: string;
    end_date: string;
    created_by: string;
    updated_by?: string;
};

const defaultOnclick = { track: "click", redirect_type: "new_tab" };

export default function Banner() {

    const { id } = useParams<{ id: string }>();

    const queryClient = useQueryClient();

    // Filter
    const [selectedType, setSelectedType] = useState<"" | "Mobile View" | "Web View">("");

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    // Delete confirm
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteBanner, setDeleteBanner] = useState<Banner | null>(null);
    const [images, setImages] = useState<any[]>([]);


    // Form
    const [formData, setFormData] = useState<BannerFormState>({
        vendor: id,
        type: "Mobile View",
        image_url: "",
        title: "",
        subtitle: "",
        description: "",
        target_url: "",
        onclick_function: defaultOnclick,
        start_date: "",
        end_date: "",
        created_by: "admin_user",
    });


    const toDateInput = (iso?: string) => {
        if (!iso) return "";
        // Expecting full ISO like "2025-06-16T00:00:00Z"
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        // Format yyyy-mm-dd
        return d.toISOString().split("T")[0];
    };

    const todayISODate = () => new Date().toISOString().split("T")[0];

    const openAddModal = () => {
        setEditingBanner(null);
        setFormData({
            vendor: id,
            type: "Mobile View",
            image_url: "",
            title: "",
            subtitle: "",
            description: "",
            target_url: "",
            onclick_function: defaultOnclick,
            start_date: todayISODate(),
            end_date: todayISODate(),
            created_by: "admin_user",
        });
        setIsModalOpen(true);
    };

    // const openEditModal = (banner: Banner) => {
    //     setEditingBanner(banner);
    //     setFormData({
    //         vendor: banner.vendor?.toString?.() ?? id,
    //         type: (banner.type as "Mobile View" | "Web View") ?? "Mobile View",
    //         image_url: images ? images[0]?.url : '',
    //         title: banner.title || "",
    //         subtitle: banner.subtitle || "",
    //         description: banner.description || "",
    //         target_url: banner.target_url || "",
    //         onclick_function: banner.onclick_function || defaultOnclick,
    //         start_date: toDateInput(banner.start_date),
    //         end_date: toDateInput(banner.end_date),
    //         created_by: banner.created_by || "admin_user",
    //         updated_by: "admin_user",
    //     });
    //     setIsModalOpen(true);
    // };

    const openEditModal = (banner: Banner) => {
        setEditingBanner(banner);

        // Pre-fill image state so SingleImageUpload can display it
        setImages(banner.image_url ? [{ url: banner.image_url }] : []);

        setFormData({
            vendor: banner.vendor?.toString?.() ?? id,
            type: (banner.type as "Mobile View" | "Web View") ?? "Mobile View",
            image_url: banner.image_url || "",
            title: banner.title || "",
            subtitle: banner.subtitle || "",
            description: banner.description || "",
            target_url: banner.target_url || "",
            onclick_function: banner.onclick_function || defaultOnclick,
            start_date: toDateInput(banner.start_date),
            end_date: toDateInput(banner.end_date),
            created_by: banner.created_by || "admin_user",
            updated_by: "admin_user",
        });

        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const openDeleteConfirm = (banner: Banner) => {
        setDeleteBanner(banner);
        setDeleteModal(true);
    };

    const closeDeleteConfirm = () => {
        setDeleteModal(false);
        setDeleteBanner(null);
    };


    const { data: banners, isLoading } = useQuery<Banner[]>({
        queryKey: ["banners", id, selectedType],
        queryFn: async () => {
            const typeFilter = selectedType ? `&type=${encodeURIComponent(selectedType)}` : "";
            const res = await axios.get(`${BASE_URL}?vendorId=${id}${typeFilter}`);
            return res.data;
        },
    });


    // Create or Update
    const upsertMutation = useMutation({
        mutationFn: async (payload: BannerFormState) => {
            if (editingBanner) {
                // Backend expects full or partial? We’ll send only changed subset allowed in docs.
                const updatePayload = {
                    vendor: payload.vendor,
                    type: payload.type,
                    image_url: images[0]?.url,
                    title: payload.title,
                    subtitle: payload.subtitle,
                    description: payload.description,
                    target_url: payload.target_url,
                    updated_by: payload.updated_by ?? "admin_user",
                    // you may also include start/end/title/subtitle if backend allows; docs show partial allowed
                };
                return axios.put(`${BASE_URL}${editingBanner.id}/`, updatePayload);
            } else {
                // Create (docs show all fields)
                const createPayload = {
                    vendor: payload.vendor,
                    type: payload.type,
                    image_url: images[0]?.url,
                    title: payload.title,
                    subtitle: payload.subtitle,
                    description: payload.description,
                    target_url: payload.target_url,
                    onclick_function: payload.onclick_function,
                    start_date: `${payload.start_date}T00:00:00Z`,
                    end_date: `${payload.end_date}T23:59:59Z`,
                    created_by: payload.created_by,
                };
                return axios.post(BASE_URL, createPayload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["banners"] });
            setImages([])
            closeModal();
            // toast.success("Banner saved.");
        },
        onError: (err: any) => {
            console.error(err);
            // toast.error(err?.response?.data?.error || "Failed to save banner.");
        },
    });

    // Delete
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => axios.delete(`${BASE_URL}${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["banners"] });
            closeDeleteConfirm();
            // toast.success("Banner deleted.");
        },
        onError: (err: any) => {
            console.error(err);
            // toast.error(err?.response?.data?.error || "Failed to delete banner.");
        },
    });

    /* ---------------------------
     * Handlers
     * ------------------------- */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        upsertMutation.mutate(formData);
    };

    const handleDeleteConfirmed = () => {
        if (!deleteBanner) return;
        deleteMutation.mutate(deleteBanner.id);
    };

    /* ---------------------------
     * Render
     * ------------------------- */
    return (
        <>
            {/* Header + Add */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-2xl font-semibold text-gray-900">Banners</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Manage marketing banners shown in Mobile & Web views.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <Button onClick={openAddModal} className="flex">
                                <Plus className="h-4 w-4 mr-2 my-auto" />
                                Add Banner
                            </Button>
                        </div>
                    </div>

                    {/* Filter Row */}
                    <div className="mt-4 flex justify-between flex-wrap gap-4">
                        <div />
                        <select
                            value={selectedType}
                            onChange={(e) =>
                                setSelectedType(e.target.value as "" | "Mobile View" | "Web View")
                            }
                            className="border h-10 rounded px-3 py-2 text-sm text-gray-700"
                        >
                            <option value="">All Types</option>
                            <option value="Mobile View">Mobile View</option>
                            <option value="Web View">Web View</option>
                        </select>
                        <div />
                    </div>

                    {/* Table */}
                    <div className="mt-8 flex flex-col">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle">
                                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                                    {isLoading ? (
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Image
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Title
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Start
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        End
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {[...Array(5)].map((_, i) => (
                                                    <tr key={i}>
                                                        {Array.from({ length: 6 }).map((__, j) => (
                                                            <td key={j} className="px-6 py-4">
                                                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : banners?.banners?.length ? (
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        S.No
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Image
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Title
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        Start
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                        End
                                                    </th>
                                                    <th className="px-6 py-3 text-sm font-semibold text-gray-900 text-center">
                                                        Actions
                                                    </th>
                                                    <th className="relative px-6 py-3">
                                                        <span className="sr-only">Actions</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {banners?.banners?.map((banner, idx) => (
                                                    <tr key={banner.id}>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 flex gap-2 items-center">
                                                            <img
                                                                src={banner.image_url}
                                                                alt={banner.title}
                                                                className="w-36 h-20 object-cover rounded"
                                                            />

                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                            {banner.title?.length > 30
                                                                ? `${banner.title.slice(0, 30)}...`
                                                                : banner.title}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                            {banner.type}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                            {new Date(banner.start_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                            {new Date(banner.end_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => openEditModal(banner)}
                                                            >
                                                                <Edit className="inline-block h-4 w-4 mr-1" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => openDeleteConfirm(banner)}
                                                            >
                                                                <Trash2 className="inline-block h-4 w-4 mr-1" />
                                                                Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-8 text-center text-blue-700 font-bold">
                                            No Banners Found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Pagination slot if needed later */}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold mb-4">
                            {editingBanner ? "Edit Banner" : "Add Banner"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Title */}
                            <input
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((s) => ({ ...s, title: e.target.value }))
                                }
                                className="w-full border px-3 py-2 rounded"
                            />
                            {/* Subtitle */}
                            <input
                                type="text"
                                placeholder="Subtitle"
                                value={formData.subtitle}
                                onChange={(e) =>
                                    setFormData((s) => ({ ...s, subtitle: e.target.value }))
                                }
                                className="w-full border px-3 py-2 rounded"
                            />
                            {/* Image */}
                            {/* <input
                                type="text"
                                placeholder="Image URL"
                                value={formData.image_url}
                                onChange={(e) =>
                                    setFormData((s) => ({ ...s, image_url: e.target.value }))
                                }
                                className="w-full border px-3 py-2 rounded"
                            /> */}
                            <SingleImageUpload images={images} onChange={setImages} label="Banner Image" />
                            {/* Type */}
                            <select
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData((s) => ({
                                        ...s,
                                        type: e.target.value as "Mobile View" | "Web View",
                                    }))
                                }
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="Mobile View">Mobile View</option>
                                <option value="Web View">Web View</option>
                            </select>
                            {/* Target URL */}

                            <input
                                type="text"
                                placeholder="Target URL"
                                value={formData.target_url}
                                onChange={(e) =>
                                    setFormData((s) => ({ ...s, target_url: e.target.value }))
                                }
                                className="w-full border px-3 py-2 rounded"
                            />

                            {/* Description */}
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((s) => ({ ...s, description: e.target.value }))
                                }
                                className="w-full border px-3 py-2 rounded min-h-[80px]"
                            />
                            {/* Dates */}

                            <>
                                <label className="block text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        setFormData((s) => ({ ...s, start_date: e.target.value }))
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                />
                                <label className="block text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) =>
                                        setFormData((s) => ({ ...s, end_date: e.target.value }))
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </>


                            {/* Buttons */}
                            <div className="flex justify-end gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={upsertMutation.isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {upsertMutation.isLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Delete Confirm Modal */}
            {deleteModal && deleteBanner && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete{" "}
                            <span className="font-bold">{deleteBanner.title}</span>?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={closeDeleteConfirm}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirmed}
                                disabled={deleteMutation.isLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleteMutation.isLoading ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

