export const baseUrl = 'https://ecomapi.ftdigitalsolutions.org';
// export const baseUrl = 'https://test-ecomapi.justvy.in';
// const baseUrl ='http://82.29.161.36'

const multiVendor = `${baseUrl}/create_multivendor_users/`;
// const multiVendorLogin=`${baseUrl}/multivendor_user_login/`;
const multiVendorLogin = `${baseUrl}/vendor_user_login/`;
const product = `${baseUrl}/api/products/`;
const categories = `${baseUrl}/api/categories/`;
const vendorOrder = `${baseUrl}/orders/`;
const variants = `${baseUrl}/variants`;
const sizes = `${baseUrl}/sizes`;
const userByVendor = `${baseUrl}/fetch-user-by-vendor-id-orders-count/`;
const userOrder = `${baseUrl}/orders/user/`;
const productVariantSizeCreate = `${baseUrl}/create-product-with-variant-size/`;
const orderItems = `${baseUrl}/order-and-order-items/`;
const categoriesWithSubcategories = `${baseUrl}/categories-with-subcategories/`;
const allProductVariantSize = `${baseUrl}/fetch-all-product-with-variant-size/`;
const updateProductVariantSize = `${baseUrl}/api/products/`;
const multivendorUsers = `${baseUrl}/multivendor_users/`;
// const createVendorUsers=`${baseUrl}/create_vendor_users/`;
const createVendorUsers = `${baseUrl}/create-vendor-user-with-all-related-data/`;
const vendorsByMainMultiVendorId = `${baseUrl}/vendors-by-main_multi_vendor_id/`;
const imageUpload = `${baseUrl}/image_store/`
const vendorAddress = `${baseUrl}/vendor_address/`;
const vendorWithSiteDetails = `${baseUrl}/vendor-with-site-details/`;
const updateVendorSiteDetails = `${baseUrl}/vendor-site-details/`
const updateSelectedAddress = `${baseUrl}/update-selected-address/vendor/`;
const vendors = `${baseUrl}/vendors/`;
const vendorSitePolicies = `${baseUrl}/vendor-site-policies/`;
const coupons = `${baseUrl}/coupons/`
const dtdcDelivery = `${baseUrl}/delivery-partner-data-bulk-pricing-data/dtdc/`
const blog = `${baseUrl}/blog/`;
const refund=`${baseUrl}/initiate_razorpay_refund/`;
const vendorOtherDetails=`${baseUrl}/vendor-other-details/`;
export default {
    multiVendor,
    multiVendorLogin,
    product,
    categories,
    vendorOrder,
    variants,
    sizes,
    userByVendor,
    userOrder,
    productVariantSizeCreate,
    orderItems,
    categoriesWithSubcategories,
    allProductVariantSize,
    updateProductVariantSize,
    multivendorUsers,
    createVendorUsers,
    vendorsByMainMultiVendorId,
    imageUpload,
    vendorAddress,
    vendorWithSiteDetails,
    updateSelectedAddress,
    updateVendorSiteDetails,
    vendors,
    vendorSitePolicies,
    coupons,
    dtdcDelivery,
    blog,
    refund,
    vendorOtherDetails
};