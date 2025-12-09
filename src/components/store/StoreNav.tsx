import { NavLink, useParams } from 'react-router-dom';
import { Settings, Package, ShoppingCart, Users, User, FolderTree, Megaphone, BarChart, Image, Ticket, Library, Star,Video } from 'lucide-react';

export default function StoreNav() {
  const { id } = useParams<{ id: string }>();

  const links = [
    { to: `/store/${id}/products`, icon: Package, label: 'Products' },
    { to: `/store/${id}/categories`, icon: FolderTree, label: 'Categories' },
    { to: `/store/${id}/orders`, icon: ShoppingCart, label: 'Orders' },
    // { to: `/store/${id}/users`, icon: Users, label: 'Staff' },
    { to: `/store/${id}/website-users`, icon: User, label: 'Customers' },
    // { to: `/store/${id}/marketing`, icon: Megaphone, label: 'Marketing' },
    // { to: `/store/${id}/analytics`, icon: BarChart, label: 'Analytics' },
    { to: `/store/${id}/settings`, icon: Settings, label: 'Settings' },
    { to: `/store/${id}/banner`, icon: Image, label: 'Banner' },
    { to: `/store/${id}/coupons`, icon: Ticket, label: 'Coupons' },
    { to: `/store/${id}/blogs`, icon: Library, label: 'Blogs' },
    // { to: `/store/${id}/reviews`, icon: Star, label: 'Reviews' },
    { to: `/store/${id}/testimonials`, icon: Star, label: 'Testimonials' },
    { to: `/store/${id}/shopByVideos`, icon: Video, label: 'Videos' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex space-x-8 flex-wrap">
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${isActive
                    ? 'border-[#FF69B4] text-[#FF69B4]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}