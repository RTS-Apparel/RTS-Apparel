import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useDataStore } from "../../store/dataStore";
import { formatPKR } from "../../lib/utils";
import { AdminSidebar } from "../../components/layout/AdminSidebar";

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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
            City Delivery Rates (PKR)
          </h1>
          <p className="text-xs text-[#4A4A4A]">
            Delivery charges auto-load in Cart and Checkout based on the customer&apos;s selected city.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-5 flex flex-col sm:flex-row items-end gap-4 shadow-sm"
        >
          <div className="flex-1 w-full space-y-1">
            <label htmlFor="dr-city" className="text-xs font-medium text-[#4A4A4A]">
              City Name *
            </label>
            <input
              id="dr-city"
              type="text"
              required
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="e.g. Gujranwala"
              className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>

          <div className="w-full sm:w-44 space-y-1">
            <label htmlFor="dr-charge" className="text-xs font-medium text-[#4A4A4A]">
              Delivery Charge (PKR) *
            </label>
            <input
              id="dr-charge"
              type="number"
              min={0}
              required
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>

          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#E2C07A]"
          >
            <Plus className="w-4 h-4" />
            <span>Add City</span>
          </button>
        </form>

        <div className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F5F4F0] border-b border-[#E8E0D0] text-[#4A4A4A]">
                <th className="py-3.5 px-4">City Name</th>
                <th className="py-3.5 px-4 text-right">Current Rate</th>
                <th className="py-3.5 px-4 text-right">Edit Rate (PKR)</th>
                <th className="py-3.5 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D0] font-mono tabular-nums">
              {deliveryRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-[#F5F4F0] transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-[#1A1A1A]">
                    {rate.city_name}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#C9A84C]">
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
                      className="w-24 h-8 px-2 rounded bg-[#FFFFFF] border border-[#E8E0D0] text-right text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteDeliveryRate(rate.id)}
                      aria-label={`Delete ${rate.city_name}`}
                      className="p-1.5 text-[#9A9A9A] hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
