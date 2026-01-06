import React, { useEffect, useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { ProductForm } from '../../types/product';
import ImageUpload from './ImageUpload';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { getCategoriesWithSubcategoriesApi, postImageUploadApi, postProductVariantSizesCreateApi, updateProductVariantSizesapi } from '../../Api-Service/Apis';
// import SizeSection from './SizeSection';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';

interface ProductModalProps {
  productForm: any;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updates: Partial<ProductForm>) => void;
}

export default function ProductModal({
  productForm,
  onClose,
  // onSubmit,
  onChange,
}: ProductModalProps) {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [images, setImages] = useState<any[]>([]);
  const [variantImages, setVariantImages] = useState<any[]>([]);
  const [isLoadings, setIsLoading] = useState<any>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, control, setValue, watch } = useForm<any>({
    defaultValues: {
      name: '',
      price: 0,
      discountedPrice: undefined,
      description: '',
      images: [],
      varieties: [],
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["getCategoriesWithSubcategoriesData", id],
    queryFn: () => getCategoriesWithSubcategoriesApi(`vendor/${id}/`),
  })

  const handleCategoryChange = (selectedOption: any) => {
    setValue('category', selectedOption?.value);
    // setValue('subcategory', null);
    const selectedCat = data?.data?.find((cat: any) => cat?.id === selectedOption?.value);
    setSubcategoryOptions(
      selectedCat?.subcategories?.map((sub: any) => ({
        value: sub?.id,
        label: sub?.name
      })) || []
    );
  };

  const categoryOptions = data?.data?.map((cat: any) => ({
    value: cat?.id,
    label: cat?.name
  })) || [];

  useEffect(() => {
    if (!subcategoryOptions.length && productForm?.category && data?.data?.length > 0) {
      handleCategoryChange({ value: productForm.category });
    }
  }, [productForm?.category, data]);


  useEffect(() => {
    setValue('name', productForm?.name);
    setValue('price', productForm?.price);
    setValue('discount', productForm?.discount);
    setValue('category', productForm?.category);
    setValue('subcategory', productForm?.subcategory);
    setValue('brand_name', productForm?.brand_name);
    setValue('commission', productForm?.commission);

    setValue('cost', productForm?.cost);
    setValue('weight', productForm?.weight);
    setValue('length', productForm?.length);
    setValue('breadth', productForm?.breadth);
    setValue('height', productForm?.height);

    setValue('sku', productForm?.sku);
    setValue('stock_quantity', productForm?.stock_quantity);
    setValue('description', productForm?.description);
    setValue('description_2', productForm?.description_2);
    setValue('keywords', productForm?.keywords);
    setValue('meta_tax', productForm?.meta_tax);
    setValue('is_custom_image_required', productForm?.is_custom_image_required);
    setValue('is_custom_message_required ', productForm?.is_custom_message_required);
    setValue('image_urls', setImages(productForm?.image_urls?.map((item: any) => { return item })));

    if (productForm?.variants) {
      productForm.variants.forEach((item: any, index: number) => {
        setValue(`varieties.${index}.id`, item?.id);
        setValue(`varieties.${index}.product_variant_title`, item?.product_variant_title);
        setValue(`varieties.${index}.product_variant_description`, item?.product_variant_description);
        setValue(`varieties.${index}.product_variant_sku`, item?.product_variant_sku);
        setValue(`varieties.${index}.product_variant_price`, item?.product_variant_price);
        setValue(`varieties.${index}.product_variant_weight`, item?.product_variant_weight);
        setValue(`varieties.${index}.product_variant_length`, item?.product_variant_length);
        setValue(`varieties.${index}.product_variant_breadth`, item?.product_variant_breadth);
        setValue(`varieties.${index}.product_variant_height`, item?.product_variant_height);
        setValue(`varieties.${index}.product_variant_discount`, item?.product_variant_discount);
        setValue(`varieties.${index}.product_variant_stock_quantity`, item?.product_variant_stock_quantity);
        // setValue(`varieties.${index}.product_variant_image_urls`, setVariantImages(item?.product_variant_image_urls?.map((item: any) => { return item })));
        setValue(
          `varieties.${index}.product_variant_image_urls`,
          setVariantImages((prev) => ({
            ...prev,
            [index]: item?.product_variant_image_urls || [],
          }))
        );

        if (item?.sizes) {
          item.sizes.forEach((sizeItem: any, sizeIndex: number) => {
            setValue(`varieties.${index}.sizes.${sizeIndex}.id`, sizeItem?.id);
            setValue(`varieties.${index}.sizes.${sizeIndex}.product_size`, sizeItem?.product_size);
            setValue(`varieties.${index}.sizes.${sizeIndex}.product_size_price`, sizeItem?.product_size_price);
            setValue(`varieties.${index}.sizes.${sizeIndex}.product_size_breadth`, sizeItem?.product_size_breadth);
            setValue(`varieties.${index}.sizes.${sizeIndex}.product_size_discount`, sizeItem?.product_size_discount);
            setValue(`varieties.${index}.sizes.${sizeIndex}.product_size_height`, sizeItem?.product_size_height);
            setValue(`varieties.${index}.sizes.${sizeIndex}.product_size_length`, sizeItem?.product_size_length);
            setValue(`varieties.${index}.sizes.${sizeIndex}.product_size_sku`, sizeItem?.product_size_sku);
            setValue(`varieties.${index}.sizes.${sizeIndex}.product_size_stock_quantity`, sizeItem?.product_size_stock_quantity);
            setValue(`varieties.${index}.sizes.${sizeIndex}.product_size_weight`, sizeItem?.product_size_weight);
          });
        }
      });
    }

  }, [productForm]);

  console.log(variantImages[0]?.url)
  const onSubmit = async (data: any) => {
    console.log(data)
    // setIsLoading(true);
    setErrorMessage('');

    const payloadUpdate = {
      ...(productForm ? '' : { vendor: id }),
      name: data?.name,
      brand_name: data?.brand_name,
      description: data?.description,
      description_2: data?.description_2,
      commission: data?.commission,
      cost: data?.cost,
      sku: data?.sku,
      price: data?.price,
      weight: data?.weight,
      length: data?.length,
      breadth: data?.breadth,
      height: data?.height,
      discount: data?.discount,
      stock_quantity: data?.stock_quantity,
      is_custom_image_required: data?.is_custom_image_required,
      is_custom_message_required: data?.is_custom_message_required,
      ...(data?.category && { category: data?.category }),
      ...(data?.subcategory && { subcategory: data?.subcategory }),
      keywords: data.keywords,
      meta_tax: data.meta_tax,
      is_featured: true,
      ...(productForm ? { updated_by: "vendor" } : { created_by: "vendor" }),

      status: true,
      image_urls: images?.map((item: any) =>
        item?.url ? item?.url : item
      ),

    };
    const payload = {
      product: {
        ...(productForm ? '' : { vendor: id }),
        name: data?.name,
        brand_name: data?.brand_name,
        description: data?.description,
        description_2: data?.description_2,
        commission: data?.commission,
        cost: data?.cost,
        sku: data?.sku,
        price: data?.price,
        weight: data?.weight,
        length: data?.length,
        breadth: data?.breadth,
        height: data?.height,
        discount: data?.discount,
        stock_quantity: data?.stock_quantity,
        ...(data?.category && { category: data?.category }),
        ...(data?.subcategory && { subcategory: data?.subcategory }),

        keywords: data.keywords,
        meta_tax: data.meta_tax,
        is_featured: true,
        ...(productForm ? { updated_by: "vendor" } : { created_by: "vendor" }),

        status: true,
        product_image_urls: images?.map((item: any) =>
          item?.url ? item?.url : item
        ),

      }
    };

    try {
      let updateApi;
      if (productForm) {
        updateApi = await updateProductVariantSizesapi(productForm?.id, payloadUpdate);
        toast.success("Product updated successfully!");
      } else {
        updateApi = await postProductVariantSizesCreateApi('', payload);
        toast.success("Product created successfully!");
      }

      if (updateApi) {
        queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
        onClose();

      } else {
        throw new Error('Something went wrong. Please try again.');
      }
    } catch (error: any) {
      if (error?.response?.data?.error) {
        const errObj = error.response.data.error;

        // first key + first message (0th index) mattum eduthukkurom
        const [key, value] = Object.entries(errObj)[0] || [];
        const firstMessage = Array.isArray(value) ? value[0] : value;

        setErrorMessage(`${firstMessage}`);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
            <h1 className='font-bold'>{productForm ? 'Edit Products' : 'Products Create'}</h1>
            <div className='grid grid-cols-1 gap-2'>
              <div className='col-span-12 lg:col-span-12 '>
                <Input required label="Name" {...register('name', { required: true })} />
              </div>
              <div className='col-span-12 lg:col-span-12'>
                <ImageUpload images={images} onChange={setImages} />
              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required type="number" label="Price" {...register('price', { required: true })} />

              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required type="number" label="MRP Price" {...register('discount', { required: true })} />
              </div>

              {/* Category Dropdown */}
              <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6">
                <label className="block text-sm font-bold  mb-1">Category <span className="text-red-500 ml-1">*</span></label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={categoryOptions}
                      placeholder="Select Category"
                      onChange={handleCategoryChange}
                      value={categoryOptions.find((opt: any) => opt.value === field.value) || null}
                    />
                  )}
                />
              </div>

              {/* Subcategory Dropdown */}
              {/* <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6">
                <label className="block text-sm font-bold  mb-1">subcategory</label>
                <Controller
                  name="subcategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={subcategoryOptions}
                      placeholder="Select Subcategory"
                      isDisabled={!subcategoryOptions.length}
                      value={subcategoryOptions.find((opt: any) => opt.value === field.value) || null}
                      onChange={(selected: any) => setValue('subcategory', selected?.value)}
                    />
                  )}
                />
              </div> */}
              {/* </div> */}
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required label="Brand Name" {...register('brand_name', { required: true })} />
              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required type="number" label="Commission" {...register('commission', { required: true })} />
              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required type="number" label="Cost" {...register('cost', { required: true })} />
              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required type="number" step="any" label="Weight (in KG)" {...register('weight', { required: true })} />
              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required type="number" step="any" label="Length (in CM)" {...register('length', { required: true })} />
              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required type="number" step="any" label="Breadth (in CM)" {...register('breadth', { required: true })} />
              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required type="number" step="any" label="Height (in CM)" {...register('height', { required: true })} />
              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required label="SKU" {...register('sku', { required: true })} />
              </div>
              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6'>
                <Input required type="number" label="Stock Quantity" {...register('stock_quantity', { required: true })} />
              </div>

              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 flex items-center gap-2 py-2'>
                <label className="block text-md font-bold  mb-1">
                  Custom Image
                </label>
                <Input
                  type="checkbox"
                  id="is_custom_image_required"
                  {...register("is_custom_image_required")}
                  className="h-16 w-16 text-indigo-600 border-gray-300 rounded"
                />
              </div>

              <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 flex items-center gap-2 py-2'>
                <label className="block text-md font-bold  mb-1">
                  Custom Message
                </label>
                <Input
                  type="checkbox"
                  id="is_custom_message_required "
                  {...register("is_custom_message_required ")}
                  className="h-16 w-16 text-indigo-600 border-gray-300 rounded"
                />
              </div>

              <div className='col-span-12 lg:col-span-12'>
                <label className="block text-sm font-bold  mb-1">Description <span className="text-red-500 ml-1">*</span></label>
                <Controller
                  name="description"
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
              <div className='col-span-12 lg:col-span-12'>
                <label className="block text-sm font-bold  mb-1">Meta Description</label>
                <textarea
                  {...register("description_2", {
                    setValueAs: (value) =>
                      typeof value === "string" ? value.trim() : "", // ✅ always return string
                  })}
                  rows={3}
                  placeholder="Meta Description"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* description_2 */}
              <div className='col-span-12 lg:col-span-6'>
                <label className="block text-sm font-bold  mb-1">Keywords</label>
                <textarea
                  {...register('keywords', {
                    setValueAs: (value) =>
                      typeof value === 'string'
                        ? value.split(',').map((kw) => kw.trim()).filter(Boolean)
                        : Array.isArray(value)
                          ? value
                          : [],

                  })}
                  rows={3}
                  placeholder="e.g. dairy, milk"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className='col-span-12 lg:col-span-6'>
                <label className="block text-sm font-bold  mb-1">Meta Tag</label>
                <textarea
                  {...register('meta_tax', {
                    setValueAs: (value) =>
                      typeof value === 'string'
                        ? value.split(',').map((kw) => kw.trim()).filter(Boolean)
                        : Array.isArray(value)
                          ? value
                          : [],

                  })}
                  rows={3}
                  placeholder="e.g. dairy, milk"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            {errorMessage && (
              <p className="text-red-500 mt-2 text-end">{errorMessage}</p>
            )}
            <div className="flex justify-end gap-3">
              <Button className='flex gap-2' type="submit" disabled={isLoadings}>{productForm ? 'Edit Product' : 'Create Product'}
                {isLoadings && (<Loader2 className='mt-auto mb-auto animate-spin' />)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}