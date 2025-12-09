import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import { baseUrl } from "../../Api-Service/ApiUrls";
import { useParams } from "react-router-dom";

// The base URL for the testimonial API
const BASE_URL = `${baseUrl}/testimonial/`;

// Type definition for a Testimonial
type Testimonial = {
    id: number;
    title: string;
    description: string;
    verified_status: boolean;
    user: number;
    vendor: number;
    created_by: string;
    updated_by: string | null;
    created_at: string; // Add created_at to the type
};

// Type definition for the form state
type TestimonialFormState = {
    title: string;
    description: string;
    verified_status: boolean;
    user: number;
    vendor: number;
    created_by: string;
};

// Simple Toggle Switch component for reusability
const ToggleSwitch = ({ checked, onChange }: any) => (
    <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
);

// Function to get the day of the week from an ISO date string
const getDayFromDate = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
};

export default function Testimonials() {
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: any }>(); // This is the vendor ID

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteTestimonial, setDeleteTestimonial] = useState<Testimonial | null>(null);

    const [formData, setFormData] = useState<TestimonialFormState>({
        title: "",
        description: "",
        verified_status: false,
        user: 301,
        vendor: id,
        created_by: "hema",
    });

    /* --------------------------- Queries --------------------------- */
    // Fetch testimonials by vendor ID
    const { data: testimonials, isLoading } = useQuery<{ testimonials: Testimonial[] }>({
        queryKey: ["testimonials", id],
        queryFn: async () => {
            const res = await axios.get(`${BASE_URL}?vendor_id=${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    /* --------------------------- Mutations --------------------------- */
    // Mutation for creating/updating a testimonial (for the form)
    const upsertMutation = useMutation({
        mutationFn: async (payload: TestimonialFormState) => {
            const dataToSend = {
                vendor: payload.vendor,
                user: payload.user,
                title: payload.title,
                description: payload.description,
                verified_status: payload.verified_status,
                created_by: payload.created_by,
            };

            if (editingTestimonial) {
                return axios.put(`${BASE_URL}${editingTestimonial.id}/`, dataToSend, {
                    headers: { "Content-Type": "application/json" },
                });
            } else {
                return axios.post(BASE_URL, dataToSend, {
                    headers: { "Content-Type": "application/json" },
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            closeModal();
        },
    });

    // New mutation for updating the verified status via toggle
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, verified_status }: { id: number; verified_status: boolean }) => {
            // Send a PUT request with only the verified_status and updated_by fields
            const dataToSend = {
                verified_status,
                updated_by: "hema", // Or a dynamic user name
            };
            return axios.put(`${BASE_URL}${id}/`, dataToSend, {
                headers: { "Content-Type": "application/json" },
            });
        },
        onSuccess: () => {
            // Invalidate the testimonials query to refresh the data
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => axios.delete(`${BASE_URL}${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            closeDeleteConfirm();
        },
    });

    /* --------------------------- Handlers --------------------------- */
    const openAddModal = () => {
        setEditingTestimonial(null);
        setFormData({
            title: "",
            description: "",
            verified_status: false,
            user: 301,
            vendor: id,
            created_by: "hema",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            title: testimonial.title,
            description: testimonial.description,
            verified_status: testimonial.verified_status,
            user: testimonial.user,
            vendor: testimonial.vendor,
            created_by: testimonial.created_by,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTestimonial(null);
    };

    const openDeleteConfirm = (testimonial: Testimonial) => {
        setDeleteTestimonial(testimonial);
        setDeleteModal(true);
    };

    const closeDeleteConfirm = () => {
        setDeleteTestimonial(null);
        setDeleteModal(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        upsertMutation.mutate(formData);
    };

    const handleDeleteConfirmed = () => {
        if (!deleteTestimonial) return;
        deleteMutation.mutate(deleteTestimonial.id);
    };

    // New handler for the toggle switch
    const handleToggleStatus = (testimonial: Testimonial) => {
        const newStatus = !testimonial.verified_status;
        updateStatusMutation.mutate({
            id: testimonial.id,
            verified_status: newStatus,
        });
    };

    // Sort testimonials by created_at in descending order (newest first)
    const sortedTestimonials = testimonials?.testimonials
        ? [...testimonials.testimonials].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        : [];

    /* --------------------------- Render --------------------------- */
    return (
        <div className="">
            <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold">Testimonials</h1>
                {/* <Button onClick={openAddModal} className="flex">
          <Plus className="h-4 w-4 mr-2 my-auto" />
          Add Testimonial
        </Button> */}
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 ">
                {isLoading ? (
                    <div className="p-6 text-center">Loading...</div>
                ) : sortedTestimonials?.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold">S.No</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Title</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Verified</th>
                                {/* <th className="px-4 py-2 text-left text-sm font-semibold">Created Day</th> */}
                                {/* <th className="px-4 py-2 text-left text-sm font-semibold">Created By</th> */}
                                <th className="px-4 py-2 text-sm font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {sortedTestimonials.map((testimonial: Testimonial, idx: number) => (
                                <tr key={testimonial.id}>
                                    <td className="px-4 py-2 text-sm">{idx + 1}</td>
                                    <td className="px-4 py-2 text-sm">{testimonial.title}</td>
                                    <td className="px-4 py-2 text-sm">{testimonial.description}</td>
                                    <td className="px-4 py-2 text-sm">
                                        {/* Use the new ToggleSwitch component here */}
                                        <ToggleSwitch
                                            checked={testimonial.verified_status}
                                            onChange={() => handleToggleStatus(testimonial)}
                                        />
                                    </td>
                                    {/* <td className="px-4 py-2 text-sm">
                  
                    {getDayFromDate(testimonial.created_at)}
                  </td>
                  <td className="px-4 py-2 text-sm">{testimonial.created_by}</td> */}
                                    <td className="px-4 py-2 text-sm text-center space-x-2">
                                        {/* <Button variant="outline" onClick={() => openEditModal(testimonial)}>
                      <Edit className="inline-block h-4 w-4 mr-1" />
                      Edit
                    </Button> */}
                                        <Button variant="outline" onClick={() => openDeleteConfirm(testimonial)}>
                                            <Trash2 className="inline-block h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-6 text-center text-blue-600 font-bold">No Testimonials Found</div>
                )}
            </div>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) => setFormData((s) => ({ ...s, title: e.target.value }))}
                                className="w-full border px-3 py-2 rounded"
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))}
                                className="w-full border px-3 py-2 rounded"
                            />
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.verified_status}
                                    onChange={(e) => setFormData((s) => ({ ...s, verified_status: e.target.checked }))}
                                    className="mr-2"
                                />
                                <label>Verified Status</label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={upsertMutation.isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    {upsertMutation.isLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal && deleteTestimonial && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p className="text-sm mb-4">
                            Are you sure you want to delete{" "}
                            <span className="font-bold">{deleteTestimonial.title}</span>?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={closeDeleteConfirm} className="px-4 py-2 border rounded">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirmed}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}