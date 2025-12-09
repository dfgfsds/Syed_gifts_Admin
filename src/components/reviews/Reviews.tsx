import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Api-Service/ApiUrls";
import { useParams } from "react-router-dom";

interface Review {
    user: number;
    vendor: number;
    product_id: number;
    rating: number;
    comment: string;
    created_by: string;
    image_urls: string[];
    video_urls: string[];
}

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();

    // Fetch reviews from API
    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get<any>(`${baseUrl}/reviews/?vendor_id=${id}`); // 🔹 Replace with your API endpoint
            setReviews(res.data?.reviews);
        } catch (err) {
            setError("Failed to fetch reviews");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Delete review API
    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${baseUrl}/reviews/${id}/`); // 🔹 Replace with your DELETE API
         fetchReviews(); 
        } catch (err) {
            console.error("Failed to delete review", err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className="mt-8 flex flex-col">
            <div className=" overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                        {loading ? (
                            <div className="text-center py-6 text-gray-500">Loading...</div>
                        ) : error ? (
                            <div className="text-center py-6 text-red-500">{error}</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            S.No
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Product ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Product Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Comment
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Images
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Videos
                                        </th>
                                        <th className="px-3 py-3 text-sm font-semibold text-gray-900 text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {reviews.map((review:any, index:any) => (
                                        <tr key={review.product_id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {review.user_name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {review.product_id}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {review.product_name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                ⭐ {review.rating}
                                            </td>
                                            <td title={review.comment} className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 ">
                                                {review.comment.slice(0, 40)}{review.comment.length > 40 ? '...' : ''}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                <div className="flex gap-2">
                                                    {review.image_urls.map((url:any, i:number) => (
                                                        <img
                                                            key={i}
                                                            src={url}
                                                            alt="review-img"
                                                            className="w-16 h-16 rounded object-cover"
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                <div className="flex gap-2">
                                                    {review.video_urls.map((url:any, i:number) => (
                                                        <video
                                                            key={i}
                                                            src={url}
                                                            controls
                                                            className="w-24 h-16 rounded"
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {reviews.length === 0 && !loading && (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="text-center py-4 text-gray-500 text-sm"
                                            >
                                                No reviews available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;

