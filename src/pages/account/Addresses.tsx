import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDataStore } from "../../store/dataStore";
import { AccountSidebar } from "../../components/layout/AccountSidebar";

export const AccountAddresses: React.FC = () => {
  const { user } = useAuth();
  const allAddresses = useDataStore((s) => s.addresses);
  const addresses = allAddresses.filter(
    (a) => a.user_id === (user?.id || "user-customer-1")
  );
  const deliveryRates = useDataStore((s) => s.deliveryRates);
  const addAddress = useDataStore((s) => s.addAddress);
  const deleteAddress = useDataStore((s) => s.deleteAddress);
  const setDefaultAddress = useDataStore((s) => s.setDefaultAddress);

  const [label, setLabel] = useState("");
  const [recipientName, setRecipientName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState("Lahore");
  const [addressLine, setAddressLine] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !addressLine.trim()) return;
    addAddress({
      user_id: user?.id || "user-customer-1",
      label: label.trim(),
      recipient_name: recipientName.trim(),
      phone: phone.trim(),
      city,
      address_line: addressLine.trim(),
      is_default: addresses.length === 0,
    });
    setLabel("");
    setAddressLine("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      <AccountSidebar />

      <div className="flex-1 space-y-8">
        <h1 className="text-2xl font-serif-display font-bold text-[#1A1A1A]">
          Saved Delivery Addresses
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1A1A1A]">
                    {addr.label}
                  </span>
                  {addr.is_default && (
                    <span className="text-xs font-mono font-bold text-[#C9A84C]">
                      [Default]
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4A4A4A]">
                  {addr.recipient_name} · {addr.phone}
                </p>
                <p className="text-xs text-[#1A1A1A] pt-1">
                  {addr.address_line}, {addr.city}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E8E0D0] text-xs">
                {!addr.is_default ? (
                  <button
                    type="button"
                    onClick={() =>
                      setDefaultAddress(
                        user?.id || "user-customer-1",
                        addr.id
                      )
                    }
                    className="text-[#C9A84C] font-semibold hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Set as Default</span>
                  </button>
                ) : (
                  <span className="text-[#9A9A9A]">Primary Address</span>
                )}

                <button
                  type="button"
                  onClick={() => deleteAddress(addr.id)}
                  aria-label={`Delete address ${addr.label}`}
                  className="text-[#9A9A9A] hover:text-[#EF4444] p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Address Form */}
        <form
          onSubmit={handleAdd}
          className="rounded-xl bg-[#FAFAFA] border border-[#E8E0D0] p-6 space-y-4 max-w-2xl shadow-xs"
        >
          <h2 className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#C9A84C]" />
            <span>Add New Address</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="addr-label" className="text-xs font-medium text-[#4A4A4A]">
                Label (e.g. Home / Office) *
              </label>
              <input
                id="addr-label"
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="DHA Residence"
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="addr-rec" className="text-xs font-medium text-[#4A4A4A]">
                Recipient Name *
              </label>
              <input
                id="addr-rec"
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="addr-city" className="text-xs font-medium text-[#4A4A4A]">
                City *
              </label>
              <select
                id="addr-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A]"
              >
                {deliveryRates.map((r) => (
                  <option key={r.id} value={r.city_name}>
                    {r.city_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="addr-line" className="text-xs font-medium text-[#4A4A4A]">
              Street Address *
            </label>
            <input
              id="addr-line"
              type="text"
              required
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="House #, Street #, Phase / Block..."
              className="w-full h-10 px-3 rounded-lg bg-[#FFFFFF] border border-[#E8E0D0] text-xs text-[#1A1A1A]"
            />
          </div>

          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-[#C9A84C] text-[#1A1A1A] font-semibold text-xs hover:bg-[#E2C07A]"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
};
