import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { postBlogsApi, putBlogsApi } from "../../Api-Service/Apis";
import Input from "../Input";
import SingleImageUpload from "../products/SingleImageUpload";
import { useParams } from "react-router-dom";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function BlogModal({ open, close, userId, editData }: any) {
    if (!open) return null;
    const [apiError, setApiError] = useState("");
    const [images, setImages] = useState<any[]>([]);
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const blogSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        subtitle: Yup.string().required("Subtitle is required"),
        description: Yup.string().required("Description is required"),
        content: Yup.string().required("Content is required"),
        author: Yup.string().required("Author is required"),
    });
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm({ resolver: yupResolver(blogSchema) });

    useEffect(() => {
        if (editData) {
            setValue("title", editData?.title || "");
            setValue("subtitle", editData?.subtitle || "");
            setValue("description", editData?.description || "");
            setValue("content", editData?.content || "");
            setValue("author", editData?.author || "");

            if (editData?.banner_url) {
                setImages([{ url: editData?.banner_url }]);
            }
        }
    }, [editData, setValue]);

    const onSubmit = async (data: any) => {
        delete data?.banner_url;
        try {
            setApiError("");
            const payload = {
                ...data,
                banner_url: images[0]?.url || "",
                vendor: id,
                user: userId,
                likes: 0,
            };
            if (editData) {
                const updateApi = await putBlogsApi(`${editData?.id}/`, {
                    ...payload,
                    updated_by: `Vendor${id}`,
                });
                if (updateApi) {
                    reset();
                    close();
                    setImages([]);
                    queryClient.invalidateQueries(['getBlogsData'] as InvalidateQueryFilters);
                }
            } else {
                const updateApi = await postBlogsApi('', {
                    ...payload,
                    created_by: `Vendor${id}`,
                });
                if (updateApi) {
                    reset();
                    close();
                    setImages([]);
                    queryClient.invalidateQueries(['getBlogsData'] as InvalidateQueryFilters);
                }
            }
        } catch (err: any) {
            setApiError(err?.response?.data?.message || "Failed to create blog. Please try again.");
        }
    };


    return (
        <>
            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
                <div className="bg-white p-6 rounded-md w-full max-w-lg max-h-[96vh] overflow-y-auto"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    <h3 className="text-lg font-semibold mb-4">
                        {editData ? "Edit Blog" : "Add New Blog"}
                    </h3>


                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div>
                            <Input label='Title' {...register("title")} className="input" />
                            <p className="text-red-500 text-sm">{errors.title?.message}</p>
                        </div>

                        <div>
                            <Input label='Subtitle' {...register("subtitle")} className="input" />
                            <p className="text-red-500 text-sm">{errors.subtitle?.message}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea {...register("description")}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                            />
                            <p className="text-red-500 text-sm">{errors.description?.message}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <ReactQuill
                                        theme="snow"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <p className="text-red-500 text-sm">{errors.content?.message}</p>
                        </div>

                        <div>
                            <Input label='Author' {...register("author")} className="input" />
                            <p className="text-red-500 text-sm">{errors.author?.message}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Banner
                            </label>
                            <SingleImageUpload images={images} onChange={setImages} />

                        </div>



                        {apiError && <p className="text-red-600">{apiError}</p>}

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => {
                                    close()
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#FF69B4] text-white rounded hover:bg-[#FF69B4]"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default BlogModal;