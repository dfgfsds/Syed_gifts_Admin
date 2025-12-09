import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProductVariantSizeApi } from "../../Api-Service/Apis";
import { baseUrl } from "../../Api-Service/ApiUrls";

interface ProductDetails {
    id: number;
    name: string;
    brand_name: string;
    price: string;
}

interface ProductOption {
    id: number;
    name: string;
}

interface Video {
    id: number;
    title: string;
    thumbnail_url: string;
    created_by: string;
    vendor: number;
    product: number;
    product_details?: ProductDetails;
    created_at: string;
}

const ShopByVideos: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const { id } = useParams<{ id: string }>();

    const [formData, setFormData] = useState({
        title: "",
        created_by: "admin",
        product: "",
        thumbnail_url: "",
    });

    // 🔹 Fetch Products using React Query
    const { data: productData, isLoading: productLoading } = useQuery({
        queryKey: ["getAllProductVariantSizeData", id],
        queryFn: () => getAllProductVariantSizeApi(`?vendor_id=${id}`),
        enabled: !!id,
    });

    const productOptions: ProductOption[] =
        productData?.data?.map((p: any) => ({
            id: p.id,
            name: p.name,
        })) || [];

    // 🔹 GET Videos
    const fetchVideos = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseUrl}/videos/vendor/${id}/`);
            if (res.data?.success) {
                setVideos(res.data.videos);
            }
        } catch (err) {
            console.error("Error fetching videos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    // 🔹 Handle Input
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔹 POST New Video
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && selectedVideo) {
                // Update existing video
                await axios.put(`${baseUrl}/videos/${selectedVideo.id}/`, {
                    ...formData,
                    updated_by: "admin",
                    vendor: id,
                });
                alert("Video updated successfully!");
            } else {
                // Create new video
                await axios.post(`${baseUrl}/videos/`, {
                    ...formData,
                    vendor: id,
                });
                alert("Video added successfully!");
            }

            setShowModal(false);
            setFormData({
                title: "",
                created_by: "admin",
                product: "",
                thumbnail_url: "",
            });
            setIsEditing(false);
            setSelectedVideo(null);
            fetchVideos();
        } catch (err) {
            console.error("Error saving video:", err);
            alert("Failed to save video");
        }
    };

    // 🔹 Edit Video
    const handleEdit = (video: Video) => {
        setSelectedVideo(video);
        setFormData({
            title: video.title,
            created_by: video.created_by,
            product: video.product.toString(),
            thumbnail_url: video.thumbnail_url,


        });
        setIsEditing(true);
        setShowModal(true);
    };

    // 🔹 Delete Video
    const handleDelete = async (videoId: number) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            try {
                await axios.delete(`${baseUrl}/videos/${videoId}/`);
                alert("Video deleted successfully!");
                fetchVideos();
            } catch (err) {
                console.error("Error deleting video:", err);
                alert("Failed to delete video");
            }
        }
    };

    // ------------------------ UI ------------------------
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Shop By Videos</h2>
                <button
                    onClick={() => {
                        setShowModal(true);
                        setIsEditing(false);
                        setFormData({
                            title: "",
                            created_by: "admin",
                            product: "",
                            thumbnail_url: "",
                        });
                    }}
                    className="bg-[#FF69B4] text-white hover:bg-[#C71585] px-4 py-2 rounded-lg "
                >
                    + Add Video
                </button>
            </div>

            {loading ? (
                <p>Loading videos...</p>
            ) : videos.length === 0 ? (
                <p className="text-gray-500">No videos found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">Title</th>
                                <th className="px-4 py-2 border">Product</th>
                                <th className="px-4 py-2 border">Preview</th>
                                <th className="px-4 py-2 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video, i) => (
                                <tr key={video.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{i + 1}</td>
                                    <td className="px-4 py-2 border">{video.title}</td>
                                    <td className="px-4 py-2 border">
                                        {video.product_details?.name || "—"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {video.thumbnail_url.includes("youtube.com") ||
                                            video.thumbnail_url.includes("youtu.be") ? (
                                            <iframe
                                                className="w-52 h-32 rounded"
                                                src={
                                                    // First, extract the video ID from the URL
                                                    (() => {
                                                        const url = video.thumbnail_url;
                                                        let id = "";
                                                        if (url.includes("youtube.com/shorts/")) {
                                                            id = url.split("youtube.com/shorts/")[1].split(/[?&]/)[0];
                                                        } else if (url.includes("youtube.com/watch?v=")) {
                                                            id = url.split("watch?v=")[1].split(/[?&]/)[0];
                                                        } else if (url.includes("youtu.be/")) {
                                                            id = url.split("youtu.be/")[1].split(/[?&]/)[0];
                                                        }
                                                        return `https://www.youtube.com/embed/${id}`;
                                                    })()
                                                }
                                                title="YouTube video"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <video
                                                src={video.thumbnail_url}
                                                controls
                                                className="w-52 h-32 rounded"
                                            />
                                        )}
                                    </td>

                                    <td className="px-4 py-2 border text-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(video)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(video.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 🔹 Add/Edit Video Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
                        <h3 className="text-lg font-semibold mb-4">
                            {isEditing ? "Edit Video" : "Add New Video"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                                required
                            />

                            <select
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md bg-white"
                                required
                            >
                                <option value="">Select Product</option>
                                {productLoading ? (
                                    <option>Loading...</option>
                                ) : (
                                    productOptions.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))
                                )}
                            </select>

                            <input
                                type="text"
                                name="thumbnail_url"
                                placeholder="Video URL (YouTube or direct)"
                                value={formData.thumbnail_url}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                                required
                            />

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#FF69B4] text-white hover:bg-[#C71585] rounded-lg "
                                >
                                    {isEditing ? "Update" : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopByVideos;
