// import React, { useEffect, useState } from 'react';
// import { Plus, ChevronRight, Loader2, Download } from 'lucide-react';
// import Button from '../../components/Button';
// import Input from '../../components/Input';
// import Search from '../../components/Search';
// import ImageUpload from '../../components/products/ImageUpload';
// import { Category } from '../../types/product';
// import { deleteCategoriesApi, getCategoriesWithSubcategoriesApi, postCategoriesApi, updateCategoriesApi } from '../../Api-Service/Apis';
// import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Controller, useForm } from 'react-hook-form';
// import { Pagination } from '../Pagination';
// import EmptyBox from '../../assets/image/empty-box.png'
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import { useParams } from 'react-router-dom';
// import SingleImageUpload from '../../components/products/SingleImageUpload';
// import { toast } from 'react-toastify';

// export default function Categories() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<any>();
//   const [categoryForm, setCategoryForm] = useState<any>();
//   const queryClient = useQueryClient();
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { id } = useParams<{ id: string }>();
//   const [images, setImages] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [categoriesModal, setCategoriesDeleteModal] = useState(false);
//   const [categoriesId, setCategoriesId] = useState<any>();
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//     setValue,
//   } = useForm({
//     defaultValues: {
//       vendor: "",
//       name: "",
//       parent: "",
//       depth: 0,
//       description: "",
//       image: null,
//       created_by: "",
//     },
//   });

//   const { data, isLoading } = useQuery({
//     queryKey: ["getCategoriesWithSubcategoriesData", id],
//     queryFn: () => getCategoriesWithSubcategoriesApi(`vendor/${id}/`),
//   })

//   const filteredCategories = data?.data?.filter((category: any) =>
//     category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     category.subcategories?.some((sub: any) =>
//       sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const totalPages = Math.ceil(filteredCategories?.length / itemsPerPage);
//   const paginatedItems = filteredCategories?.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, []);


//   const onSubmit = async (data: any) => {
//     setLoading(true);
//     setErrorMessage(''); // clear old error
//     try {
//       const payload = {
//         name: data?.name,
//         ...(categoryForm && { parent: categoryForm }),
//         depth: 0,
//         description: data?.description,
//         image: images ? images[0]?.url : '',
//         created_by: 'vendor',
//         vendor: id,
//       };

//       if (selectedCategory) {
//         const editPayload = {
//           parent: data?.parent || '',
//           depth: data?.depth,
//           description: data?.description,
//           updated_by: 'vendor9',
//           name: data?.name,
//           image: images ? images[0]?.url : '',
//         };

//         const updateApi = await updateCategoriesApi(`${selectedCategory?.id}/`, editPayload);
//         if (updateApi) {
//           queryClient.invalidateQueries(['getCategoriesData'] as InvalidateQueryFilters);
//           reset();
//           setIsModalOpen(false);
//           setImages([]);
//           toast.success("Category created successfully!");
//         }
//       } else {
//         const postApi = await postCategoriesApi('', payload);
//         if (postApi) {
//           queryClient.invalidateQueries(['getCategoriesData'] as InvalidateQueryFilters);
//           reset();
//           setIsModalOpen(false);
//           setImages([])
//         }
//       }
//     } catch (error: any) {
//       console.error("Error submitting category:", error?.response?.data?.non_field_errors);
//       setErrorMessage(error?.response?.data?.non_field_errors || error?.non_field_errors || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleEdit = (category: Category) => {
//     setSelectedCategory(category);
//     setIsModalOpen(true);
//   };

//   useEffect(() => {
//     if (selectedCategory) {
//       setValue('name', selectedCategory?.name)
//       setValue('vendor', selectedCategory?.vendor)
//       setValue('parent', selectedCategory?.parent)
//       // setValue('depth', selectedCategory?.depth)
//       setValue('description', selectedCategory?.description)
//       setValue('depth', selectedCategory?.depth)
//       setImages(selectedCategory?.image)

//     }
//   }, [selectedCategory])

//     const handleDelete = async () => {
//       try {
//         const updateApi = await deleteCategoriesApi(`${categoriesId?.id}`,{deleted_by:'vendor'})
//         if (updateApi) {
//           queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
//           setCategoriesDeleteModal(false);
//           setCategoriesId('');
//         }
//       } catch (error: any) {
//           toast.error(error?.response?.data?.error || "Something went wrong. Please try again.!");
//       }finally{
//         // toast.error("Something went wrong. Please try again.!");
//         setCategoriesDeleteModal(false);
//       }

//     }


//   // deleteCategoriesApi
//   const renderCategoryRow = (category: any, isSubcategory = false) => (
//     <tr key={category.id}>
//       <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//         <div className="flex items-center">
//           {isSubcategory && <ChevronRight className="h-4 w-4 mr-2 text-gray-400" />}
//           {category.image && (
//             <img
//               src={category?.image}
//               alt={category.image.alt}
//               className="h-8 w-8 rounded object-cover mr-2"
//             />
//           )}
//           {category.name}
//         </div>
//       </td>
//       <td className="px-6 py-4 text-sm text-gray-500 max-w-40">

//         {category?.description?.length > 20 ? (
//           <div>{category.description.slice(0, 60)}...</div>
//         ) : (
//           <div>{category.description}</div>
//         )}
//       </td>
//       {/* <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{category.slug}</td> */}
//       <td className="whitespace-nowrap px-6 py-4 text-right text-sm space-x-2">
//         <Button variant="outline" onClick={() => handleEdit(category)}>Edit</Button>
//         {!isSubcategory && (
//           <Button
//             variant="outline"
//             onClick={() => {
//               setCategoryForm(category?.id);
//               setIsModalOpen(true);
//             }}
//           >
//             Add Subcategory
//           </Button>
//         )}
//         <Button variant="outline" onClick={() => { setCategoriesId(category), setCategoriesDeleteModal(true) }}>Delete</Button>

//       </td>
//     </tr>
//   );

//   const handleDownloadExcel = () => {
//     if (!paginatedItems.length) {
//       alert('No Categories to download!');
//       return;
//     }
//     const worksheet = XLSX.utils.json_to_sheet(paginatedItems);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(data, 'categories.xlsx');
//   };
//   console.log(images)

//   return (
//     <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       <div className="px-4 sm:px-0">
//         <div className="sm:flex sm:items-center">
//           <div className="sm:flex-auto">
//             <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
//             <p className="mt-2 text-sm text-gray-700">
//               Manage your product categories
//             </p>
//           </div>
//           <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
//             <Button onClick={() => {
//               setIsModalOpen(true);
//             }}
//               className='flex'
//             >
//               <Plus className="h-4 w-4 mr-2 my-auto" />
//               Add Category
//             </Button>
//           </div>
//         </div>

//         <div className="mt-4 flex justify-between flex-wrap">
//           <Search
//             value={searchTerm}
//             onChange={setSearchTerm}
//             placeholder="Search categories..."
//           />

//           <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
//             <Button onClick={handleDownloadExcel} className='flex'>
//               <Download className="h-4 w-4 mr-2 my-auto" />
//               Excel Download
//             </Button>
//           </div>
//         </div>
//         {isLoading ? (
//           <>
//             {/* <div className="flex justify-center items-center text-blue-700 text-2xl gap-1 py-5">
//               <Loader2 size={40} className="animate-spin" /> Loading...
//             </div> */}
//             <div className="mt-8 flex flex-col">
//               <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//                 <div className="inline-block min-w-full py-2 align-middle">
//                   <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
//                     <table className="min-w-full divide-y divide-gray-300">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">S.No</th>
//                           <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
//                           <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
//                           <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200 bg-white">
//                         {[...Array(5)].map((_, index) => (
//                           <tr key={index}>
//                             {Array.from({ length: 6 }).map((_, idx) => (
//                               <td key={idx} className="px-6 py-4">
//                                 <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             {paginatedItems?.length ? (
//               <div className="mt-8 flow-root">
//                 <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//                   <div className="inline-block min-w-full py-2 align-middle">
//                     <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
//                       <table className="min-w-full divide-y divide-gray-300">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">S.No</th> */}
//                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
//                             <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
//                             {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Slug</th> */}
//                             <th className="px-6 py-3  text-sm font-semibold text-gray-900">Actions</th>
//                             {/* <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th> */}
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200 bg-white">
//                           {paginatedItems?.map((category: any) => (
//                             <React.Fragment key={category.id}>
//                               {renderCategoryRow(category)}
//                               {category.subcategories?.map((subcategory: any) =>
//                                 renderCategoryRow(subcategory, true)
//                               )}
//                             </React.Fragment>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                     {/* Pagination */}
//                     <div className="flex justify-between mt-3 px-2">
//                       <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         onPageChange={setCurrentPage}
//                       />
//                       <select
//                         value={itemsPerPage}
//                         onChange={(e: any) => setItemsPerPage(Number(e.target.value))}
//                         className="border h-10 rounded px-2 py-1 text-sm !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
//                       >
//                         <option value={10}>10 per page</option>
//                         <option value={25}>25 per page</option>
//                         <option value={50}>50 per page</option>
//                         <option value={100}>100 per page</option>
//                       </select>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <img className='size-60 mx-auto' src={EmptyBox} />
//                 <div className='text-center text-[#1718FE] font-bold'>No Categories Found</div>
//               </>
//             )}</>)}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-10 overflow-y-auto">
//           <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//             <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 <h3 className="text-lg font-semibold leading-6 text-gray-900">
//                   {selectedCategory
//                     ? "Edit Category"
//                     : categoryForm
//                       ? "Add Subcategory"
//                       : "Add Category"}
//                 </h3>

//                 {/* Name */}
//                 <Input label="Name" {...register("name", { required: true })} />
//                 {/* Depth */}
//                 {/* <Input label="Depth" {...register("depth")} /> */}
//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Description</label>
//                   <textarea
//                     {...register("description")}
//                     rows={3}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                   />
//                 </div>
//                 {/* Image Upload */}

//                 <SingleImageUpload images={images} onChange={setImages} />

//                 {errorMessage && (
//                   <div className="text-red-600 mb-3 text-sm">
//                     {errorMessage}
//                   </div>
//                 )}


//                 <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
//                   <Button type="button" variant="outline" onClick={() => { reset(), setSelectedCategory(''), setCategoryForm(''), setIsModalOpen(false),setImages([]) }}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={loading}>
//                     {selectedCategory ? "Save Changes" : "Add Category"}
//                     {loading && (<Loader2 className='mt-auto mb-auto animate-spin' />)}
//                   </Button>
//                 </div>
//               </form>

//             </div>
//           </div>
//         </div>
//       )}

// {categoriesModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-auto" onClick={(e) => e.stopPropagation()}>
//             <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
//             <p className="text-sm text-gray-600 mb-4">Are you sure you want to Delete <span className='font-bold'>{categoriesId?.name}</span>?</p>

//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 onClick={() => setCategoriesDeleteModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
//               >
//                 Confirm Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import { Plus, ChevronRight, Loader2, Download } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Search from '../../components/Search';
import ImageUpload from '../../components/products/ImageUpload';
import { Category } from '../../types/product';
import { deleteCategoriesApi, getCategoriesWithSubcategoriesApi, postCategoriesApi, updateCategoriesApi } from '../../Api-Service/Apis';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Pagination } from '../Pagination';
import EmptyBox from '../../assets/image/empty-box.png'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useParams } from 'react-router-dom';
import SingleImageUpload from '../../components/products/SingleImageUpload';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [categoryForm, setCategoryForm] = useState<any>();
  const queryClient = useQueryClient();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams<{ id: string }>();
  const [images, setImages] = useState<any[]>([]);
  const [bannerImages, setBannerImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [categoriesModal, setCategoriesDeleteModal] = useState(false);
  const [categoriesId, setCategoriesId] = useState<any>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      vendor: "",
      name: "",
      parent: "",
      depth: 0,
      description: "",
      description2: "",
      image: null,
      banner_image: null,
      created_by: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["getCategoriesWithSubcategoriesData", id],
    queryFn: () => getCategoriesWithSubcategoriesApi(`vendor/${id}/`),
  })

  const filteredCategories = data?.data?.filter((category: any) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories?.some((sub: any) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description2?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredCategories?.length / itemsPerPage);
  const paginatedItems = filteredCategories?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        name: data?.name,
        ...(categoryForm && { parent: categoryForm }),
        depth: 0,
        description: data?.description,
        description2: data?.description2,
        image: images ? images[0]?.url : '',
        banner_image: bannerImages ? bannerImages[0]?.url : '',
        created_by: 'vendor',
        vendor: id,
      };

      if (selectedCategory) {
        const editPayload = {
          parent: data?.parent || '',
          depth: data?.depth,
          description: data?.description,
          description2: data?.description2,
          updated_by: 'vendor9',
          name: data?.name,
          image: images ? images[0]?.url : '',
          banner_image: bannerImages ? bannerImages[0]?.url : '',
        };

        const updateApi = await updateCategoriesApi(`${selectedCategory?.id}/`, editPayload);
        if (updateApi) {
          queryClient.invalidateQueries(['getCategoriesData'] as InvalidateQueryFilters);
          reset();
          setIsModalOpen(false);
          setImages([]);
          setBannerImages([]);
          toast.success("Category updated successfully!");
        }
      } else {
        const postApi = await postCategoriesApi('', payload);
        if (postApi) {
          queryClient.invalidateQueries(['getCategoriesData'] as InvalidateQueryFilters);
          reset();
          setIsModalOpen(false);
          setImages([]);
          setBannerImages([]);
        }
      }
    } catch (error: any) {
      console.error("Error submitting category:", error?.response?.data?.non_field_errors);
      setErrorMessage(error?.response?.data?.non_field_errors || error?.non_field_errors || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (selectedCategory) {
      setValue('name', selectedCategory?.name);
      setValue('vendor', selectedCategory?.vendor);
      setValue('parent', selectedCategory?.parent);
      setValue('description', selectedCategory?.description);
      setValue('description2', selectedCategory?.description2);
      setValue('depth', selectedCategory?.depth);
      setImages(selectedCategory?.image ? [selectedCategory.image] : []);
      setBannerImages(selectedCategory?.banner_image ? [selectedCategory.banner_image] : []);
    }
  }, [selectedCategory]);

  const handleDelete = async () => {
    try {
      const updateApi = await deleteCategoriesApi(`${categoriesId?.id}`, { deleted_by: 'vendor' });
      if (updateApi) {
        queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
        setCategoriesDeleteModal(false);
        setCategoriesId('');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.!");
    } finally {
      setCategoriesDeleteModal(false);
    }
  };

  const renderCategoryRow = (category: any, isSubcategory = false) => (
    <tr key={category.id}>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
        <div className="flex items-center">
          {isSubcategory && <ChevronRight className="h-4 w-4 mr-2 text-gray-400" />}
          {category.image && (
            <img
              src={category?.image}
              alt={category.image.alt}
              className="h-8 w-8 rounded object-cover mr-2"
            />
          )}
          {category.name}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-40">
        {category?.description?.length > 20 ? (
          <div>{category.description.slice(0, 60)}...</div>
        ) : (
          <div>{category.description}</div>
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm space-x-2">
        <Button variant="outline" onClick={() => handleEdit(category)}>Edit</Button>
        {/* {!isSubcategory && (
          <Button
            variant="outline"
            onClick={() => {
              setCategoryForm(category?.id);
              setIsModalOpen(true);
            }}
          >
            Add Subcategory
          </Button>
        )} */}
        <Button variant="outline" onClick={() => { setCategoriesId(category), setCategoriesDeleteModal(true) }}>Delete</Button>
      </td>
    </tr>
  );

  const handleDownloadExcel = () => {
    if (!paginatedItems.length) {
      alert('No Categories to download!');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(paginatedItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'categories.xlsx');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your product categories
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button onClick={() => {
              setIsModalOpen(true);
            }}
              className='flex'
            >
              <Plus className="h-4 w-4 mr-2 my-auto" />
              Add Category
            </Button>
          </div>
        </div>

        <div className="mt-4 flex justify-between flex-wrap">
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search categories..."
          />

          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button onClick={handleDownloadExcel} className='flex'>
              <Download className="h-4 w-4 mr-2 my-auto" />
              Excel Download
            </Button>
          </div>
        </div>
        {isLoading ? (
          <>
            <div className="mt-8 flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                          <th className="px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {[...Array(5)].map((_, index) => (
                          <tr key={index}>
                            {Array.from({ length: 3 }).map((_, idx) => (
                              <td key={idx} className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {paginatedItems?.length ? (
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {paginatedItems?.map((category: any) => (
                            <React.Fragment key={category.id}>
                              {renderCategoryRow(category)}
                              {category.subcategories?.map((subcategory: any) =>
                                renderCategoryRow(subcategory, true)
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-between mt-3 px-2">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                      <select
                        value={itemsPerPage}
                        onChange={(e: any) => setItemsPerPage(Number(e.target.value))}
                        className="border h-10 rounded px-2 py-1 text-sm !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
                      >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <img className='size-60 mx-auto' src={EmptyBox} />
                <div className='text-center text-[#1718FE] font-bold'>No Categories Found</div>
              </>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {selectedCategory
                    ? "Edit Category"
                    : categoryForm
                      ? "Add Subcategory"
                      : "Add Category"}
                </h3>

                <Input label="Name" {...register("name", { required: true })} />
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700">About content</label>
                  <textarea
                    {...register("description2")}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  /> */}
                  <label className="block text-sm font-bold  mb-1">About content</label>
                  <Controller
                    name="description2"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <ReactQuill
                        {...field}
                        onChange={(value) => field.onChange(value)} // important
                        value={field.value}
                        theme="snow"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className='flex justify-between'>
                  <SingleImageUpload images={bannerImages} onChange={setBannerImages} label="Banner Image" />
                  <SingleImageUpload images={images} onChange={setImages} label="Category Image" />
                </div>


                {errorMessage && (
                  <div className="text-red-600 mb-3 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => {
                    reset();
                    setSelectedCategory('');
                    setCategoryForm('');
                    setIsModalOpen(false);
                    setImages([]);
                    setBannerImages([]);
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {selectedCategory ? "Save Changes" : "Add Category"}
                    {loading && (<Loader2 className='mt-auto mb-auto animate-spin' />)}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {categoriesModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to Delete <span className='font-bold'>{categoriesId?.name}</span>?</p>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setCategoriesDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}