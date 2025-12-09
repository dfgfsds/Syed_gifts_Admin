import { useState } from "react";
import BlogModal from "./BlogModal";
import { deleteBlogsApi, getBlogsApi } from "../../Api-Service/Apis";
import { InvalidateQueryFilters, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { FileEdit, Loader, Trash2 } from "lucide-react";

function Blogs({ userId }: any) {
  const [blogModal, setBlogModal] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [editData, setEditData] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteData, setDeleteData] = useState<any>('');
  const queryClient = useQueryClient();

  const getBlogsData = useQuery({
    queryKey: ["getBlogsData", id],
    queryFn: () => getBlogsApi(`?vendor_id=${id}`),
  })

  const blogs = getBlogsData?.data?.data?.blogs;

  const confirmDelete = async () => {
    console.log(deleteData)
    if (deleteData) {
      setLoading(true)
      const response = await deleteBlogsApi(`${deleteData?.id}`);
      if (response) {
        queryClient.invalidateQueries(['getBlogsData'] as InvalidateQueryFilters);
        setDeleteModal(false);
        setLoading(false)
      }
    }
  };
  return (
    <>
      <div className="flex justify-between my-4">
        <h3 className="text-lg font-medium text-gray-900">Blogs</h3>
        <button className=' gap-2 bg-[#FF69B4] text-white px-4 py-2 rounded-lg hover:bg-[#FF69B4]'
          onClick={() => setBlogModal(!blogModal)}
        >
          Add Blogs
        </button>
      </div>

      {/* List Blogs */}
      {/* <div className="grid md:grid-cols-4 gap-6">
        {blogs?.map((blog: any) => (
          <div
            key={blog.id}
            className="relative bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition-all duration-300"
          >

            <button
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100"
              onClick={() => { setEditData(blog), setBlogModal(!blogModal) }}
            >
              <FileEdit size={18} className="text-gray-600" />
            </button>

            <img
              src={blog?.banner_url}
              alt={blog?.title}
              className="w-full h-24 object-cover"
            />

            <div className="p-5">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <span className="text-green-600 font-medium capitalize">{blog?.title || "Blog"}</span>
                <span className="mx-2">•</span>
                <span>
                  {new Date(blog?.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h3 className="text-xl line-clamp-1 font-semibold text-gray-800 hover:text-green-700 cursor-pointer">
                {blog?.subtitle}
              </h3>
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">{blog?.description}</p>

              <div className="flex items-center mt-4">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${blog?.author || "A"}`}
                  alt={blog?.author}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="text-sm font-medium text-gray-700">{blog?.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      <div className="grid md:grid-cols-4 gap-6">
        {blogs?.map((blog: any) => (
          <div
            key={blog.id}
            className="relative bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition-all duration-300"
          >
            {/* Top Right Icons */}
            <div className="absolute top-3 right-3 flex gap-2">
              {/* Edit */}
              <button
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                onClick={() => {
                  setEditData(blog);
                  setBlogModal(true);
                }}
              >
                <FileEdit size={18} className="text-gray-600" />
              </button>

              {/* Delete */}
              <button
                className="bg-white p-2 rounded-full shadow hover:bg-red-100"
                onClick={() => {
                  setDeleteData(blog);
                  setDeleteModal(!deleteModal);
                }}
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>

            <img
              src={blog?.banner_url}
              alt={blog?.title}
              className="w-full h-24 object-cover"
            />

            <div className="p-5">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <span className="text-green-600 font-medium capitalize">{blog?.title}</span>
                <span className="mx-2">•</span>
                <span>
                  {new Date(blog?.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h3 className="text-xl line-clamp-1 font-semibold text-gray-800 hover:text-green-700 cursor-pointer">
                {blog?.subtitle}
              </h3>
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">{blog?.description}</p>

              <div className="flex items-center mt-4">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${blog?.author || "A"}`}
                  alt={blog?.author}
                  className="w-6 h-6 rounded-full mr-3"
                />
                <span className="text-sm font-medium text-gray-700">{blog?.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>


      <BlogModal
        open={blogModal}
        close={() => setBlogModal(!blogModal)}
        userId={userId}
        editData={editData}
      />

      {deleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Delete Blog</h2>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete this {deleteData?.title}?
            </p>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => { setDeleteData(""), setLoading(false), setDeleteModal(!deleteModal) }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 gap-2 flex"
              >
                Confirm Delete {loading ? (<Loader className='animate-spin' />) : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Blogs;