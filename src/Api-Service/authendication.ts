import axios from "axios";
import ApiUrls from "./ApiUrls";


//   LOGIN API
export const postLoginInAPi = async (payload: any) => {
  return axios.post(ApiUrls.multiVendorLogin, payload);
};

//   USER CREATE API
export const postCreateMultiVendorAPi = async (payload: any) => {
  return axios.post(ApiUrls.multiVendor, payload);
};

// COUPON API

//   COUPON CREATE API
export const postCouponApi = async (query: any, payload: any) => {
  const formattedQuery = query?.endsWith('/') ? query : `${query}`;
  return axios.post(`${ApiUrls.coupons}${formattedQuery}`, payload);
};

//   COUPON GET API
export const GetCouponApi = async (query: any) => {
  const formattedQuery = query?.endsWith('/') ? query : `${query}`;
  return axios.get(`${ApiUrls.coupons}${formattedQuery}`);
};

//   COUPON UPDATE API
export const updateCouponApi = async (query: any, payload: any) => {
  const formattedQuery = query?.endsWith('/') ? query : `${query}`;
  return axios.put(`${ApiUrls.coupons}${formattedQuery}`, payload);
};

// COUPON DELETE API
export const deleteCouponApi = async (query: any, payload: any) => {
  return axios.delete(`${ApiUrls.coupons}${query}`, {
    data: payload,
  });
};
