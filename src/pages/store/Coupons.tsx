import Coupons from '../../components/coupons/Coupons'
import { useQuery } from '@tanstack/react-query';
import { getVendorWithSiteDetailsApi } from '../../Api-Service/Apis';
import { useParams } from 'react-router-dom';

interface Props { }

function CouponsMain(props: Props) {

    const { id } = useParams<{ id: string }>();

    const getVendorWithSiteDetailsData = useQuery({
        queryKey: ['getVendorWithSiteDetailsData', id],
        queryFn: () => getVendorWithSiteDetailsApi(`${id}/`)
    })
    const vendorSiteDetails = getVendorWithSiteDetailsData?.data?.data;
    const { } = props

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Coupons userId={vendorSiteDetails?.vendor?.user} />
        </div>
    )
}

export default CouponsMain
