// import React from 'react';
import { X } from 'lucide-react';
// import { Product } from '../../types/product';
import Button from '../Button';
import { useQuery } from '@tanstack/react-query';
import { getSizesApi, getVariantsProductApi } from '../../Api-Service/Apis';

interface ProductDetailsModalProps {
  product: any;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProductDetailsModal({ product, onClose, onEdit }: ProductDetailsModalProps) {

  const productId: any = product?.id;
  const VariantData: any = useQuery({
    queryKey: ['VariantData'],
    queryFn: () => getVariantsProductApi(`/product/${productId}`),
  });

  const sizesData: any = useQuery({
    queryKey: ['getSizesData'],
    queryFn: () => getSizesApi(`/product/${productId}`),
  });


  // const matchingProductsArray = getCartitemsData?.data?.data?.map((item: any) => {
  //   const matchingProduct = products?.data?.find((product: any) => product.id === item.product);
  //   const matchingVariant = VariantData?.data?.data?.message?.find((variant: any) => variant.id === item.product_variant);
  //   const matchingSize =sizesData?.data?.data?.message?.find((size: any) => size.id === item.product_size);


  // const matchingVariant = VariantData?.data?.data?.message?.find(
  //   (variant: any) => variant?.product_id === productId
  // );

  // const matchingSize = sizesData?.data?.data?.message?.find(
  //   (size: any) => size?.product_id === productId
  // );


  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div>
            <div className="aspect-w-3 aspect-h-2 mb-4">
              <img
                src={product?.image_urls[0] ? product?.image_urls[0] : "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="}
                // src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url}
                alt={product?.name}
                className="h-64 w-full object-cover rounded-lg"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">{product?.name} <span className='text-slate-600 ml-3'>
              {/* {product?.weight} g */}
              {product?.brand_name}
            </span></h3>
            <div className="mt-1 text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: product?.description }} />

            <div className="mt-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">₹{product?.price}</span>
                {product?.discount && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ₹{product?.discount}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              {VariantData?.data?.data?.message?.length || sizesData?.data?.data?.message?.length ? (
                <h4 className="text-sm font-medium text-gray-900">Available Varieties</h4>
              ) : ''}

              <div className="mt-2 space-y-4">
                {VariantData?.data?.data?.message?.map((variety: any, index: any) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center">
                      {variety.product_variant_image_urls?.lenth && (
                        <img
                          src={variety.product_variant_image_urls[0]}
                          // alt={variety.color}
                          className="h-16 w-16 rounded object-cover"
                        />
                      )}
                      <div className="ml-4">
                        <h5 className="text-sm font-medium text-gray-900">{variety.product_variant_title}</h5>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {sizesData?.data?.data?.message?.map((size: any, sizeIndex: any) => (
                            <span
                              key={sizeIndex}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                            >
                              {size.product_size} ({size.product_size_stock_quantity})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onEdit}>Edit Product</Button>
          </div>
        </div>
      </div>
    </div>
  );
}