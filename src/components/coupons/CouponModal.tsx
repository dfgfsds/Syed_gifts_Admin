import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';
import * as Yup from 'yup';
import Button from '../../components/Button';
import { postCouponApi, updateCouponApi } from '../../Api-Service/authendication';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getAllProductVariantSizeApi, getCategoriesWithSubcategoriesApi, getUserApi } from '../../Api-Service/Apis';

// ✅ Validation Schema
const CouponSchema = Yup.object().shape({
    code: Yup.string().required('Code is required'),
    description: Yup.string().required('Description is required'),
    start_date: Yup.string().required('Start date is required'),
    expiry_date: Yup.string().required('Expiry date is required'),
    discount_type: Yup.string().required('Discount type is required'),

    discount_value: Yup.number()
        .nullable()
        .when('discount_type', {
            is: 'percentage',
            then: (schema) => schema.required('Discount value is required').min(1).max(100),
            otherwise: (schema) => schema.strip(),
        }),
    flat_discount: Yup.number()
        .nullable()
        .when('discount_type', {
            is: 'flat',
            then: (schema) => schema.required('Flat discount is required').min(1),
            otherwise: (schema) => schema.strip(),
        }),
    delivery_discount: Yup.number()
        .nullable()
        .when('discount_type', {
            is: 'delivery',
            then: (schema) => schema.required('Delivery discount is required').min(1),
            otherwise: (schema) => schema.strip(),
        }),

    min_purchase_amount: Yup.number().nullable().min(0, 'Minimum purchase must be at least 0'),
    max_discount_amount: Yup.number().nullable().min(0, 'Max discount must be at least 0'),
    usage_limit: Yup.number().nullable().min(1, 'Usage limit must be at least 1'),
    per_user_limit: Yup.number().nullable().min(1, 'Per user limit must be at least 1'),
    // 🔹 Boolean flags
    first_order_only: Yup.boolean().default(false),
    new_users_only: Yup.boolean().default(false),
    auto_apply: Yup.boolean().default(false),
    is_active: Yup.boolean().default(true),
    stackable: Yup.boolean().default(false),
    user_specific: Yup.boolean().default(false),

    // 🔹 Arrays — all safely transformed to backend-friendly formats
    required_products: Yup.array()
        .nullable()
        .transform((_, originalValue) =>
            Array.isArray(originalValue)
                ? originalValue.map((v: any) => Number(v?.value)).filter(Boolean)
                : []
        )
        .of(Yup.number().typeError('Invalid product ID')),

    excluded_products: Yup.array()
        .nullable()
        .transform((_, originalValue) =>
            Array.isArray(originalValue)
                ? originalValue.map((v: any) => Number(v?.value)).filter(Boolean)
                : []
        )
        .of(Yup.number().typeError('Invalid product ID')),

    applicable_categories: Yup.array()
        .nullable()
        .transform((_, originalValue) =>
            Array.isArray(originalValue)
                ? originalValue.map((v: any) => Number(v?.value)).filter(Boolean)
                : []
        )
        .of(Yup.number().typeError('Invalid category ID')),

    excluded_categories: Yup.array()
        .nullable()
        .transform((_, originalValue) =>
            Array.isArray(originalValue)
                ? originalValue.map((v: any) => Number(v?.value)).filter(Boolean)
                : []
        )
        .of(Yup.number().typeError('Invalid category ID')),

    allowed_users: Yup.array()
        .nullable()
        .transform((_, originalValue) =>
            Array.isArray(originalValue)
                ? originalValue.map((v: any) => Number(v?.value)).filter(Boolean)
                : []
        )
        .of(Yup.number().typeError('Invalid user ID')),

    valid_days: Yup.array()
        .nullable()
        .transform((_, originalValue) =>
            Array.isArray(originalValue)
                ? originalValue.map((v: any) => String(v?.value || '').replace(/"/g, ''))
                : []
        )
        .of(Yup.string().typeError('Invalid string')),
});

const daysOptions: any = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
];

function CouponModal({ close, editData, setEditData }: any) {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(CouponSchema),
        defaultValues: {
            code: '',
            description: '',
            start_date: '',
            expiry_date: '',
            discount_type: '',
            min_purchase_amount: null,
            max_discount_amount: null,
            usage_limit: null,
            per_user_limit: null,
            first_order_only: false,
            new_users_only: false,
            auto_apply: false,
            is_active: true,
            stackable: false,
            user_specific: false,
            required_products: [],
            excluded_products: [],
            applicable_categories: [],
            excluded_categories: [],
            allowed_users: [],
            valid_days: [],
        },
    });

    const discountType = watch('discount_type');

    // ✅ Fetch Products using React Query
    const productData: any = useQuery({
        queryKey: ['getAllProductVariantSizeData', id],
        queryFn: () => getAllProductVariantSizeApi(`?vendor_id=${id}`)
    });

    const optionProducts = productData?.data?.data?.map((product: any) => ({
        label: product?.name,
        value: product?.id,
    })) || [];

    const categoryData = useQuery({
        queryKey: ["getCategoriesWithSubcategoriesData", id],
        queryFn: () => getCategoriesWithSubcategoriesApi(`vendor/${id}/`),
    })

    const optionCategories = categoryData?.data?.data?.map((category: any) => ({
        label: category?.name,
        value: category?.id,
    })) || [];

    const userData: any = useQuery({
        queryKey: ['getVendorOrder', id],
        queryFn: () => getUserApi(`?vendor_id=${id}`)
    });

    const userOptions = userData?.data?.data?.map((user: any) => ({
        label: user?.name ? user?.name : user?.contact_number,
        value: user?.id,
    })) || [];

    console.log("userOptions", userOptions)

    useEffect(() => {
        if (!editData) return;

        setValue('code', editData.code || '');
        setValue('description', editData.description || '');
        setValue('start_date', editData.start_date?.split('T')[0] || '');
        setValue('expiry_date', editData.expiry_date?.split('T')[0] || '');
        setValue('discount_type', editData.discount_type || '');

        if (editData.discount_type === 'percentage')
            setValue('discount_value', editData.discount_value || '');
        if (editData.discount_type === 'flat')
            setValue('flat_discount', editData.flat_discount || '');
        if (editData.discount_type === 'delivery')
            setValue('delivery_discount', editData.delivery_discount || '');

        setValue('min_purchase_amount', editData.min_purchase_amount || '');
        setValue('max_discount_amount', editData.max_discount_amount || '');
        setValue('usage_limit', editData.usage_limit || '');
        setValue('per_user_limit', editData.per_user_limit || '');

        setValue(
            'valid_days',
            editData.valid_days?.map((day: any) => ({ label: day, value: day })) || []
        );

        // Boolean flags
        setValue('first_order_only', !!editData.first_order_only);
        setValue('new_users_only', !!editData.new_users_only);
        setValue('auto_apply', !!editData.auto_apply);
        setValue('is_active', !!editData.is_active);
        setValue('stackable', !!editData.stackable);
        setValue('user_specific', !!editData.user_specific);
    }, [editData, setValue]);


    useEffect(() => {
        if (!editData) return;

        const findMatchingOptions = (ids: any[], options: any[]) =>
            ids?.map(id => options.find(opt => opt.value === id))?.filter(Boolean) || [];

        if (optionProducts.length)
            setValue('required_products', findMatchingOptions(editData.required_products || [], optionProducts));
        if (optionProducts.length)
            setValue('excluded_products', findMatchingOptions(editData.excluded_products || [], optionProducts));
        if (optionCategories.length)
            setValue('applicable_categories', findMatchingOptions(editData.applicable_categories || [], optionCategories));
        if (optionCategories.length)
            setValue('excluded_categories', findMatchingOptions(editData.excluded_categories || [], optionCategories));
        if (userOptions.length)
            setValue('allowed_users', findMatchingOptions(editData.allowed_users || [], userOptions));
    }, [editData, optionProducts, optionCategories, userOptions, setValue]);


    const onSubmit = async (data: any) => {
        setApiError('');

        const formatDate = (date: string, endOfDay = false) => {
            if (!date) return null;
            const d = new Date(date);
            if (endOfDay) {
                d.setHours(23, 59, 59, 999);
            } else {
                d.setHours(0, 0, 0, 0);
            }
            return d.toISOString().split('.')[0];
        };

        const payload = {
            code: data.code?.trim(),
            description: data.description?.trim(),
            discount_type: data.discount_type,
            discount_value: data.discount_value ? String(data.discount_value) : null,
            flat_discount: data.flat_discount ? String(data.flat_discount) : null,
            delivery_discount: data.delivery_discount ? String(data.delivery_discount) : null,
            min_purchase_amount: data.min_purchase_amount ? String(data.min_purchase_amount) : "0.00",
            max_discount_amount: data.max_discount_amount ? String(data.max_discount_amount) : "0.00",
            usage_limit: Number(data.usage_limit) || 0,
            per_user_limit: Number(data.per_user_limit) || 0,
            first_order_only: Boolean(data.first_order_only),
            new_users_only: Boolean(data.new_users_only),
            required_products: (data.required_products || []).map((p: any) => Number(p.value || p)).filter(Boolean),
            excluded_products: (data.excluded_products || []).map((p: any) => Number(p.value || p)).filter(Boolean),
            applicable_categories: (data.applicable_categories || []).map((c: any) => Number(c.value || c)).filter(Boolean),
            excluded_categories: (data.excluded_categories || []).map((c: any) => Number(c.value || c)).filter(Boolean),
            allowed_users: (data.allowed_users || []).map((u: any) => Number(u.value || u)).filter(Boolean),
            valid_days: (data.valid_days || []).map((d: any) => d.value || d),
            user_specific: Boolean(data.user_specific),
            is_active: Boolean(data.is_active),
            auto_apply: Boolean(data.auto_apply),
            stackable: Boolean(data.stackable),
            start_date: formatDate(data.start_date),
            expiry_date: formatDate(data.expiry_date, true),
            vendor: Number(id),
            [editData ? "updated_by" : "created_by"]: "vendor",
        };
        try {
            if (editData) {
                await updateCouponApi(`${editData?.id}`, payload);
                setEditData('');
                queryClient.invalidateQueries(['getCouponData'] as InvalidateQueryFilters);
                close();
            } else {
                await postCouponApi('', payload);
                setEditData('');
                queryClient.invalidateQueries(['getCouponData'] as InvalidateQueryFilters);
                close();
            }
        } catch (error: any) {
            setApiError(error?.response?.data?.message || 'Failed to save coupon. Please try again.');
        }
    };


    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl mx-auto rounded-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]">
                <h3 className="text-lg text-gray-900 mb-4 font-bold">{editData ? 'Edit' : 'Create'} Coupon</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* {JSON.stringify(errors)} */}
                    <div className="mb-2">
                        <label className="font-medium">Code</label>
                        <input {...register('code')} className="w-full border rounded px-3 py-2" />
                        {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Description</label>
                        <input {...register('description')} className="w-full border rounded px-3 py-2" />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Start Date</label>
                        <input type="date" {...register('start_date')} className="w-full border rounded px-3 py-2" />
                        {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Expiry Date</label>
                        <input type="date" {...register('expiry_date')} className="w-full border rounded px-3 py-2" />
                        {errors.expiry_date && <p className="text-red-500 text-sm">{errors.expiry_date.message}</p>}
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Discount Type</label>
                        <select {...register('discount_type')} className="w-full border rounded px-3 py-2">
                            <option value="">Select Discount Type</option>
                            <option value="percentage">Percentage</option>
                            <option value="flat">Flat</option>
                            <option value="delivery">Delivery</option>
                        </select>
                        {errors.discount_type && <p className="text-red-500 text-sm">{errors.discount_type.message}</p>}
                    </div>

                    {discountType === 'percentage' && (
                        <div className="mb-2">
                            <label className="font-medium">Discount Value</label>
                            <input type='number' {...register('discount_value')} className="w-full border rounded px-3 py-2" />
                            {errors.discount_value && <p className="text-red-500 text-sm">{errors.discount_value.message}</p>}
                        </div>
                    )}

                    {discountType === 'flat' && (
                        <div className="mb-2">
                            <label className="font-medium">Flat Discount</label>
                            <input type='number' {...register('flat_discount')} className="w-full border rounded px-3 py-2" />
                            {errors.flat_discount && <p className="text-red-500 text-sm">{errors.flat_discount.message}</p>}
                        </div>
                    )}

                    {discountType === 'delivery' && (
                        <div className="mb-2">
                            <label className="font-medium">Delivery Discount</label>
                            <input type='number' {...register('delivery_discount')} className="w-full border rounded px-3 py-2" />
                            {errors.delivery_discount && <p className="text-red-500 text-sm">{errors.delivery_discount.message}</p>}
                        </div>
                    )}

                    {/* Extra Fields */}
                    <div className="mb-2">
                        <label className="font-medium">Minimum Purchase Amount</label>
                        <input type="number" {...register('min_purchase_amount')} className="w-full border rounded px-3 py-2" />
                        {errors.min_purchase_amount && <p className="text-red-500 text-sm">{errors.min_purchase_amount.message}</p>}
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Maximum Discount Amount</label>
                        <input type="number" {...register('max_discount_amount')} className="w-full border rounded px-3 py-2" />
                        {errors.max_discount_amount && <p className="text-red-500 text-sm">{errors.max_discount_amount.message}</p>}
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Usage Limit</label>
                        <input type="number" {...register('usage_limit')} className="w-full border rounded px-3 py-2" />
                        {errors.usage_limit && <p className="text-red-500 text-sm">{errors.usage_limit.message}</p>}
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Per User Limit</label>
                        <input type="number" {...register('per_user_limit')} className="w-full border rounded px-3 py-2" />
                        {errors.per_user_limit && <p className="text-red-500 text-sm">{errors.per_user_limit.message}</p>}
                    </div>

                    {/* ✅ Multi-select Fields */}
                    <div className="mb-2">
                        <label className="font-medium">Required Products</label>
                        <Controller
                            name="required_products"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} isMulti options={optionProducts} className="react-select-container" />
                            )}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Excluded Products</label>
                        <Controller
                            name="excluded_products"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} isMulti options={optionProducts} className="react-select-container" />
                            )}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Applicable Categories</label>
                        <Controller
                            name="applicable_categories"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} isMulti options={optionCategories} className="react-select-container" />
                            )}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Excluded Categories</label>
                        <Controller
                            name="excluded_categories"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} isMulti options={optionCategories} className="react-select-container" />
                            )}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Allowed Users</label>
                        <Controller
                            name="allowed_users"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} isMulti options={userOptions} className="react-select-container" />
                            )}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium">Valid Days</label>
                        <Controller
                            name="valid_days"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} isMulti options={daysOptions} className="react-select-container" />
                            )}
                        />
                    </div>

                    {/* ✅ Boolean checkboxes */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        {[
                            { label: 'First Order Only', name: 'first_order_only' },
                            { label: 'New Users Only', name: 'new_users_only' },
                            { label: 'Auto Apply', name: 'auto_apply' },
                            { label: 'Is Active', name: 'is_active' },
                            { label: 'Stackable', name: 'stackable' },
                            { label: 'User Specific', name: 'user_specific' },
                        ].map((item: any) => (
                            <label key={item.name} className="flex items-center space-x-2">
                                <input type="checkbox" {...register(item.name)} />
                                <span>{item.label}</span>
                            </label>
                        ))}
                    </div>

                    {apiError && <p className="text-red-600 mt-2">{apiError}</p>}

                    <div className="mt-6 flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => { close(), reset(), setEditData('') }} type="button">
                            Cancel
                        </Button>
                        <Button type="submit">{editData ? 'Update' : 'Save'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CouponModal;