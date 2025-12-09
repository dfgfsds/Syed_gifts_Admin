import axios from "axios";
import ApiUrls from "./ApiUrls";


// MULTIVENDOR USER APIS 
// GET MULTIVENDOR USER APIS 
export const getMultiVendorUserApi = async (query: any) => {
  return axios.get(
    `${ApiUrls.multivendorUsers}${query}/`
  );
};

// CREATE VENDOR USERS
export const postVendorUsersCreateApi = async (query: any, payload: any) => {
  return axios.post(
    `${ApiUrls.createVendorUsers}${query}`, payload
  );
};

// VENDORS BY MAIN MULTI VENDOR ID 
export const getVendorsByMainMultiVendorIdApi = async (query: any) => {
  return axios.get(
    `${ApiUrls.vendorsByMainMultiVendorId}${query}/`
  );
};

// END MULTIVENDOR USER APIS 

// PRODUCTS APIS

// GET PRODUCTS APIS 
export const getProductApi = async (query: any) => {
  return axios.get(
    `${ApiUrls.product}${query}`
  );
};

// POST PRODUCTS VARIANT SIZE APIS 
export const postProductVariantSizesCreateApi = async (query: any, payload: any) => {
  return axios.post(
    `${ApiUrls.productVariantSizeCreate}${query}`, payload
  );
};

// UPDATE PRODUCTS VARIANT SIZE APIS 
export const updateProductVariantSizesapi = async (query: any, payload: any) => {
  return axios.put(
    `${ApiUrls.updateProductVariantSize}${query}/`, payload
  );
};

// POST PRODUCTS APIS 
export const postProductCreateApi = async (query: any, payload: any) => {
  return axios.post(
    `${ApiUrls.productVariantSizeCreate}${query}`, payload
  );
};


// GET ALL PRODUCTS VARIANT SIZE  APIS 
export const getAllProductVariantSizeApi = async (query: any) => {
  return axios.get(
    `${ApiUrls.allProductVariantSize}${query}`
  );
};

// DELETE  PRODUCTS VARIANT SIZE  APIS 
export const deleteAllProductVariantSizeApi = async (query: any, payload: any) => {
  const formattedQuery = query?.endsWith('/') ? query : `${query}/`;
  return axios.delete(
    `${ApiUrls.product}${formattedQuery}`, {
    data: payload,
  }
  );
};

// DELETE  PRODUCTS VARIANT SIZE  APIS 
export const productStatusUpdateApi = async (query: any, payload: any) => {
  const formattedQuery = query?.endsWith('/') ? query : `${query}/`;
  return axios.put(
    `${ApiUrls.product}${formattedQuery}`, payload
  );
};


// END PRODUCTS APIS 


// {ORDERS APIS }

// ORDERS ITEMS API 
export const getOrderItemsApi = async (query: any) => {
  return axios.get(
    `${ApiUrls.orderItems}${query}`
  );
};

// GET VENDOR ORDER APIS 
export const getVendorOrderApi = async (query: any) => {
  const formattedQuery = query?.endsWith('/') ? query : `${query}/`;
  return axios.get(
    `${ApiUrls.vendorOrder}${formattedQuery}`
  );
};

// PATCH ORDER STATUS API  
export const patchOrderStatusApi = async (query: any, payload: any) => {
  return axios.patch(
    `${ApiUrls.vendorOrder}${query}/`, payload
  );
};


// {ORDERS APIS END}


// {  CATEGORIES APIS }

// GET CATEGORIES APIS 
export const getProductcategoriesApi = async (query: any) => {
  return axios.get(
    `${ApiUrls.categories}${query}`
  );
};

// POST CATEGORIES APIS
export const postCategoriesApi = async (query: any, payload: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}`;
  return axios.post(`${ApiUrls.categories}${formattedQuery}`, payload);
};

// UPDATE CATEGORIES APIS
export const updateCategoriesApi = async (query: any, payload: any) => {
  // const formattedQuery = query?.endsWith('/') ? query : `${query}/`;
  return axios.put(`${ApiUrls?.categories}${query}`, payload);
};

// DELETE CATEGORIES APIS
export const deleteCategoriesApi = async (query: any, payload: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}`;
  return axios.delete(`${ApiUrls.categories}${formattedQuery}`, { data: payload });
};


// GET CATEGORIES WITH SUBCATEGORIS API


export const getCategoriesWithSubcategoriesApi = async (query: any) => {
  return axios.get(
    `${ApiUrls.categoriesWithSubcategories}${query}`
  );
};

// {  CATEGORIES APIS END}






// VARIANTS
export const getVariantsProductApi = async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.get(`${ApiUrls.variants}${formattedQuery}`);
};

// SIZES
export const getSizesApi = async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.get(`${ApiUrls.sizes}${formattedQuery}`);
};

// USER GETS
export const getUserApi = async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}`;
  return axios.get(`${ApiUrls.userByVendor}${formattedQuery}`);
};

// USER ORDER GETS
export const getUserOrderApi = async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.get(`${ApiUrls.userOrder}${formattedQuery}`);
};



// IMAGE UPLOAD

export const postImageUploadApi = async (query: any, payload: any) => {
  return axios.post(`${ApiUrls.imageUpload}${query}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// GET ADDRESS APIS 
export const getAddressApi = async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.get(`${ApiUrls.vendorAddress}${formattedQuery}`);
};

// CREATE ADDRESS APIS 
export const postAddressCreateApi = async (query: any, payload: any) => {
  return axios.post(
    `${ApiUrls.vendorAddress}${query}`, payload
  );
};


// UPDATE ADDRESS APIS 
export const updateAddressApi = async (query: any, payload: any) => {
  return axios.put(
    `${ApiUrls.vendorAddress}${query}`, payload
  );
};


// DELETE ADDRESS APIS 
export const deleteAddressApi = async (query: any, payload: any) => {
  return axios.delete(`${ApiUrls.vendorAddress}${query}`, { data: payload });
};

// GET VENDOR WITH SITE DETAILS
export const getVendorWithSiteDetailsApi = async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.get(`${ApiUrls.vendorWithSiteDetails}${formattedQuery}`);
}

// UPDATE VENDOR WITH SITE DETAILS
export const putVendorWithSiteDetailsApi = async (query: any, payload: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.put(`${ApiUrls.updateVendorSiteDetails}${formattedQuery}`, payload);
}

// UPDATE SELECTED ADDRESS
export const updateSelectedAddressApi = async (query: any, payload: any) => {
  return axios.patch(
    `${ApiUrls.updateSelectedAddress}${query}`, payload
  );
}

// PUT VENDORS
export const putVendorsApi = async (query: any, payload: any) => {
  return axios.put(
    `${ApiUrls.vendors}${query}`, payload
  );
}

// UPDATE VENDOR-SITE-POLICIES
export const updateVendorSidePolicesApi = async (query: any, payload: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.patch(
    `${ApiUrls.vendorSitePolicies}${formattedQuery}`, payload
  );
}

// GET VENDOR-SITE-POLICIES
export const getVendorSidePolicesApi = async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}/`;
  return axios.get(
    `${ApiUrls.vendorSitePolicies}${formattedQuery}`
  );
}

// POST DTDC APIS 

// POST DTDC DELIVERY POST API 
export const postDtdcCreateApi = async (query: any, payload: any) => {
  return axios.post(
    `${ApiUrls.dtdcDelivery}${query}`, payload
  );
};

// UPDATE DTDC DELIVERY POST API 
export const updateDtdcCreateApi = async (query: any, payload: any) => {
  return axios.put(
    `${ApiUrls.dtdcDelivery}${query}`, payload
  );
};

// BLOGS APIS 

// POST BLOGS  API 
export const postBlogsApi = async (query: any, payload: any) => {
  return axios.post(
    `${ApiUrls.blog}${query}`, payload
  );
};

// PUT BLOGS  API 
export const putBlogsApi = async (query: any, payload: any) => {
  return axios.put(
    `${ApiUrls.blog}${query}`, payload
  );
};


// GET BLOGS API
export const getBlogsApi = async (query: any) => {
  const formattedQuery = query.endsWith('/') ? query : `${query}`;
  return axios.get(
    `${ApiUrls.blog}${formattedQuery}`
  );
}

// DELETE BLOGS API
export const deleteBlogsApi = async (query: any) => {
  const formattedQuery = query?.endsWith('/') ? query : `${query}`;
  return axios.delete(
    `${ApiUrls?.blog}${formattedQuery}`
  );
}

// POST BLOGS  API 
export const postRefundApi = async (query: any, payload: any) => {
  return axios.post(
    `${ApiUrls.refund}${query}`, payload
  );
};

// UPDATE VENDOR OTHER DETAILS APIS 
export const updateVendorOtherDetailsApi = async (query: any,payload:any) => {
  return axios.patch(
    `${ApiUrls.vendorOtherDetails}${query}`,payload
  );
};




