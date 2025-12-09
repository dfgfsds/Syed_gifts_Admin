import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import Button from '../../components/Button';
import Search from '../../components/Search';
import ProductModal from '../../components/products/ProductModal';
import ProductsTable from '../../components/products/ProductsTable';
import ProductDetailsModal from '../../components/products/ProductDetailsModal';
import { Product } from '../../types/product';
import { getAllProductVariantSizeApi } from '../../Api-Service/Apis';
import { useQuery } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { baseUrl } from '../../Api-Service/ApiUrls';

export default function Products() {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productForm, setProductForm] = useState<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // ✅ Category filter state

  // ✅ Fetch Categories
  const getCategoriesData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/main-categories/${id}`);
      setCategories(res?.data || []);
    } catch (error: any) {
      console.log(error?.response?.data?.message || 'Something went wrong!');
    }
  };

  useEffect(() => {
    getCategoriesData();
  }, []);

  // ✅ Fetch Products using React Query
  const { data, isLoading }: any = useQuery({
    queryKey: ['getAllProductVariantSizeData', id],
    queryFn: () => getAllProductVariantSizeApi(`?vendor_id=${id}`)
  });

  const handleAddProduct = () => {
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductForm(product);
    setIsEditing(true);
    setIsModalOpen(true);
    setSelectedProduct(null);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductForm('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(productForm);
    closeModal();
  };

  // ✅ Apply Search + Category Filter
  const filteredProducts: Product[] =
    data?.data?.filter((product: any) => {

      const term = searchTerm.toLowerCase();
      const matchesSearch =
        product?.name?.toLowerCase()?.includes(term) ||
        product?.description?.toLowerCase()?.includes(term) ||
        product?.price?.toString()?.includes(term);

      const matchesCategory =
        !selectedCategory || product?.category?.toString() === selectedCategory;

      return matchesSearch && matchesCategory;
    }) || [];

  // ✅ Excel Download
  const handleDownloadExcel = () => {
    if (!filteredProducts.length) {
      alert('No products to download!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, 'products.xlsx');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your store's products and inventory
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button onClick={handleAddProduct} className="flex">
              <Plus className="h-4 w-4 mr-2 my-auto" />
              Add Product
            </Button>
          </div>
        </div>

        {/* ✅ Filters Section */}
        <div className="mt-4 flex justify-between flex-wrap gap-4">
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search products by name"
          />

          {/* ✅ Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="sm:mt-0">
            <Button onClick={handleDownloadExcel} className="flex">
              <Download className="h-4 w-4 mr-2 my-auto" />
              Excel Download
            </Button>
          </div>
        </div>

        {/* ✅ Modals */}
        {isModalOpen && (
          <ProductModal
            productForm={productForm}
            onClose={closeModal}
            onSubmit={handleSubmit}
            onChange={(updates) => setProductForm('')}
          />
        )}

        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onEdit={() => handleEditProduct(selectedProduct)}
          />
        )}

        {/* ✅ Products Table */}
        <ProductsTable
          isLoading={isLoading}
          products={filteredProducts || []}
          onEdit={handleEditProduct}
          onView={handleViewProduct}
        />
      </div>
    </div>
  );
}
