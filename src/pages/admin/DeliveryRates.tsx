import React, { useState } from "react";
import { Plus, Trash2, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { PageHeading } from "../../components/layout/PageHeading";
import { pageVariants } from "../../lib/animations";

export const AdminDeliveryRates: React.FC = () => {
  const deliveryRates = useDataStore((s) => s.deliveryRates);
  const addDeliveryRate = useDataStore((s) => s.addDeliveryRate);
  const updateDeliveryRate = useDataStore((s) => s.updateDeliveryRate);
  const deleteDeliveryRate = useDataStore((s) => s.deleteDeliveryRate);

  const [cityName, setCityName] = useState("");
  const [charge, setCharge] = useState("250");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) return;
    addDeliveryRate(cityName.trim(), Number(charge) || 250);
    setCityName("");
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 bg-[#F5F5F5] rounded-[8px]"
    >
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <PageHeading
          title="Delivery Rates"
          subtitle="City-wise shipping charges"
          icon={<Truck className="w-5 h-5" />}
          breadcrumbs={[
            { label: "Home", to: "/" },
            { label: "Admin", to: "/admin" },
            { label: "Delivery Rates" },
          ]}
        />

        <form
          onSubmit={handleAdd}
          className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] p-5 flex flex-col sm:flex-row items-end gap-4 shadow-xs"
        >
          <div className="flex-1 w-full space-y-1">
            <label htmlFor="dr-city" className="text-xs font-medium text-[#1A1A1A]">
              City Name *
            </label>
            <input
              id="dr-city"
              type="text"
              required
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="e.g. Sadiqabad"
              className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-2 focus:border-[#E63946]"
            />
          </div>

          <div className="w-full sm:w-44 space-y-1">
            <label htmlFor="dr-charge" className="text-xs font-medium text-[#1A1A1A]">
              Delivery Charge (PKR) *
            </label>
            <input
              id="dr-charge"
              type="number"
              min={0}
              required
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              className="w-full h-10 px-3 rounded-[6px] bg-[#FFFFFF] border border-[#E0E0E0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
            />
          </div>

          <button
            type="submit"
            className="h-10 px-5 rounded-[6px] bg-[#E63946] text-[#FFFFFF] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#C1121F] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add City</span>
          </button>
        </form>

        <div className="rounded-[8px] bg-[#FFFFFF] border border-[#E0E0E0] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#1A1A1A] text-[#FFFFFF]">
                <th className="py-3.5 px-4">City Name</th>
                <th className="py-3.5 px-4 text-right">Current Rate</th>
                <th className="py-3.5 px-4 text-right">Edit Rate (PKR)</th>
                <th className="py-3.5 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0] font-mono tabular-nums">
              {deliveryRates.map((rate, idx) => (
                <motion.tr
                  key={rate.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#FFFFFF] text-[#1A1A1A]"
                >
                  <td className="py-3 px-4 font-sans font-bold text-[#1A1A1A]">
                    {rate.city_name}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#E63946]">
                    {formatPKR(rate.charge)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="number"
                      min={0}
                      value={rate.charge}
                      aria-label={`Delivery charge for ${rate.city_name}`}
                      onChange={(e) =>
                        updateDeliveryRate(rate.id, {
                          charge: Number(e.target.value) || 0,
                        })
                      }
                      className="w-24 h-8 px-2 rounded-[4px] bg-[#FFFFFF] border border-[#E0E0E0] text-right text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-2 focus:border-[#E63946]"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteDeliveryRate(rate.id)}
                      aria-label={`Delete ${rate.city_name}`}
                      className="p-1.5 rounded bg-[#C1121F] text-[#FFFFFF] hover:bg-[#E63946] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDeliveryRates;
