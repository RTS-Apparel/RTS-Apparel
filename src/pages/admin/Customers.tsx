import React, { useMemo, useState } from "react";
import { Search, Users, Phone, MapPin, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { useDataStore } from "../../store/dataStore";
import { ADMIN_TRANSLATIONS } from "../../lib/i18n";
import { formatPKR } from "../../lib/utils";
import {
  pageVariants,
  statCardVariants,
  CountUpNumber,
} from "../../lib/animations";

interface CustomerRecord {
  key: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export const AdminCustomers: React.FC = () => {
  const orders = useDataStore((s) => s.orders);
  const adminLanguage = useDataStore((s) => s.adminLanguage);
  const t = ADMIN_TRANSLATIONS[adminLanguage];
  const [search, setSearch] = useState("");

  const customers = useMemo<CustomerRecord[]>(() => {
    const map = new Map<string, CustomerRecord>();

    orders.forEach((order) => {
      const key = order.customer_phone.replace(/[\s-]/g, "");
      const existing = map.get(key);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += order.total_amount;
        if (new Date(order.created_at) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.created_at;
        }
      } else {
        map.set(key, {
          key,
          name: order.customer_name,
          phone: order.customer_phone,
          city: order.delivery_city,
          address: order.delivery_address,
          totalOrders: 1,
          totalSpent: order.total_amount,
          lastOrderDate: order.created_at,
        });
      }
    });

    return Array.from(map.values()).filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 bg-[#F5F5F5] rounded-[8px]"
    >
      <AdminSidebar />
      <main className="flex-1 space-y-6">
        <PageHeading
          title="Customers"
          subtitle="View and manage store customers"
          icon={<Users className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Customers" },
          ]}
        />

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              adminLanguage === "roman_ur"
                ? "Naam, phone ya shehar talash karein..."
                : "Search by name, phone, or city..."
            }
            className="w-full h-10 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] pl-10 pr-4 text-xs text-[#1A1A1A] placeholder:text-[#999999] focus:border-2 focus:border-[#E63946] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
          <motion.div
            custom={0}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] p-6 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[#666666] mb-2">
              <span>{t.customers}</span>
              <Users className="w-4 h-4 text-[#E63946]" />
            </div>
            <p className="text-[24px] text-[#1A1A1A] font-bold">
              <CountUpNumber value={customers.length} />
            </p>
          </motion.div>
          <motion.div
            custom={1}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] p-6 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[#666666] mb-2">
              <span>{t.orders}</span>
              <ShoppingBag className="w-4 h-4 text-[#E63946]" />
            </div>
            <p className="text-[24px] text-[#1A1A1A] font-bold">
              <CountUpNumber value={orders.length} />
            </p>
          </motion.div>
          <motion.div
            custom={2}
            variants={statCardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] border-t-[3px] border-t-[#E63946] p-6 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[#666666] mb-2">
              <span>{t.totalRevenue}</span>
              <MapPin className="w-4 h-4 text-[#E63946]" />
            </div>
            <p className="text-[24px] text-[#1A1A1A] font-bold">
              <CountUpNumber
                value={customers.reduce((acc, c) => acc + c.totalSpent, 0)}
                prefix="Rs. "
              />
            </p>
          </motion.div>
        </div>

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
              {customers.map((customer, idx) => (
                <motion.tr
                  key={customer.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#FFFFFF] text-[#1A1A1A]"
                >
                  <td className="py-3.5 px-4 font-sans">
                    <p className="font-bold text-[#1A1A1A]">
                      {customer.name}
                    </p>
                    <p className="text-[11px] text-[#666666] truncate max-w-xs">
                      {customer.address}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-[#1A1A1A] font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                      {customer.phone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-[#666666]">
                    {customer.city}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">
                    {customer.totalOrders}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#E63946]">
                    {formatPKR(customer.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-[#666666]">
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </motion.div>
  );
};

export default AdminCustomers;
