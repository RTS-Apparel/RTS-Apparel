import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "../types";
import { useDataStore } from "./dataStore";

interface CartState {
  items: CartItem[];
  referralCode: string;
  referralAgentName: string | null;
  selectedCity: string;
  isDrawerOpen: boolean;

  setDrawerOpen: (open: boolean) => void;
  setSelectedCity: (city: string) => void;
  addItem: (
    productOrId: Product | string,
    size: string,
    color: string,
    quantity?: number
  ) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  applyReferralCode: (code: string) => {
    valid: boolean;
    message: string;
    agentName?: string;
  };
  clearReferralCode: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      referralCode: "",
      referralAgentName: null,
      selectedCity: "Lahore",
      isDrawerOpen: false,

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
      setSelectedCity: (city) => set({ selectedCity: city }),

      addItem: (productOrId, size, color, quantity = 1) => {
        const allProducts = useDataStore.getState().products;
        const product =
          typeof productOrId === "string"
            ? allProducts.find((p) => p.id === productOrId) || allProducts[0]
            : productOrId;
        if (!product) return;

        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.product_id === product.id &&
              i.size === size &&
              i.color === color
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated, isDrawerOpen: true };
          }
          return {
            items: [
              ...state.items,
              {
                product_id: product.id,
                product,
                quantity,
                size,
                color,
              },
            ],
            isDrawerOpen: true,
          };
        });
        useDataStore
          .getState()
          .addToast(`${product.name_en} (${size}) added to bag`);
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product_id === productId &&
                i.size === size &&
                i.color === color
              )
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      applyReferralCode: (code) => {
        const clean = code.trim().toUpperCase();
        if (!clean) {
          return { valid: false, message: "Please enter a referral code." };
        }
        const users = useDataStore.getState().users;
        const agent = users.find(
          (u) =>
            u.referral_code?.toUpperCase() === clean &&
            u.role === "agent" &&
            u.is_approved &&
            !u.is_blocked
        );
        if (!agent) {
          return {
            valid: false,
            message: "Invalid or inactive agent referral code.",
          };
        }
        set({
          referralCode: agent.referral_code || clean,
          referralAgentName: agent.full_name,
        });
        useDataStore
          .getState()
          .addToast(`Partner code ${clean} linked (${agent.full_name})`);
        return {
          valid: true,
          message: `Linked to RTS Partner: ${agent.full_name}`,
          agentName: agent.full_name,
        };
      },

      clearReferralCode: () =>
        set({ referralCode: "", referralAgentName: null }),

      clearCart: () =>
        set({ items: [], referralCode: "", referralAgentName: null }),
    }),
    {
      name: "rts-apparel-cart-v1",
      partialize: (state) => ({
        items: state.items,
        referralCode: state.referralCode,
        referralAgentName: state.referralAgentName,
        selectedCity: state.selectedCity,
      }),
    }
  )
);
