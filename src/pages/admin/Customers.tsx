import React, { useMemo, useState } from "react";
import { Search, Users, Phone, MapPin, ShoppingBag } from "lucide-react";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { useDataStore } from "../../store/dataStore";
import { ADMIN_TRANSLATIONS } from "../../lib/i18n";
import { formatPKR } from "../../lib/utils";

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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />
      <main className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C9A84C] block mb-1">
              CRM Directory
            </span>
            <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
              {t.customers}
            </h1>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9A9A9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                adminLanguage === "roman_ur"
                  ? "Naam, phone ya shehar talash karein..."
                  : "Search by name, phone, or city..."
              }
              className="w-full h-10 rounded-lg bg-[#FAFAFA] border border-[#E8E0D0] pl-10 pr-4 text-xs text-[#1A1A1A] focus:border-[#C9A84C] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
          <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-5">
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[#4A4A4A] mb-2">
              <span>{t.customers}</span>
              <Users className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <p className="text-2xl text-[#1A1A1A] font-bold">
              {customers.length}
            </p>
          </div>
          <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-5">
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[#4A4A4A] mb-2">
              <span>{t.orders}</span>
              <ShoppingBag className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <p className="text-2xl text-[#1A1A1A] font-bold">{orders.length}</p>
          </div>
          <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-5">
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[#4A4A4A] mb-2">
              <span>{t.totalRevenue}</span>
              <MapPin className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <p className="text-2xl text-[#C9A84C] font-bold">
              {formatPKR(customers.reduce((acc, c) => acc + c.totalSpent, 0))}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E0D0] text-[#4A4A4A] bg-[#F5F4F0]">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
              {customers.map((customer) => (
                <tr
                  key={customer.key}
                  className="hover:bg-[#F5F4F0] transition-colors"
                >
                  <td className="py-3.5 px-4 font-sans">
                    <p className="font-semibold text-[#1A1A1A]">
                      {customer.name}
                    </p>
                    <p className="text-[11px] text-[#4A4A4A] truncate max-w-xs">
                      {customer.address}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-[#1A1A1A]">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
                      {customer.phone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-[#4A4A4A]">
                    {customer.city}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">
                    {customer.totalOrders}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#C9A84C]">
                    {formatPKR(customer.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4 text-[#4A4A4A]">
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminCustomers;
