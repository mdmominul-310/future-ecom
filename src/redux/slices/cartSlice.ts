import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  buyPrice?: number;
  costPerProduct?: number;
  salePrice?: number;
  discount: number;
  quantity: number;
  stock: number;
  image: { url: string; public_id: string };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  color?: {
    _id: string;
    name: string;
    value: string;
    description?: string;
  } | null;
  size?: {
    _id: string;
    name: string;
    value: string;
    description?: string;
  } | null;
  variant?: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    discount?: number;
    stock: number;
  } | null;
  sku: string;
  specialInstruction?: string;
}

interface CartState {
  cartItems: CartItem[];
  totalAmount: number;
  totalQty: number;
}

const initialState: CartState = {
  cartItems: [],
  totalAmount: 0,
  totalQty: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const cartItemId = action.payload.variant
        ? `${action.payload.productId}-${action.payload.variant._id}`
        : action.payload.productId;

      const itemIndex = state.cartItems.findIndex(
        (i) =>
          (i.variant ? `${i.productId}-${i.variant._id}` : i.productId) ===
          cartItemId
      );

      if (itemIndex > -1) {
        state.cartItems[itemIndex].quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }

      cartSlice.caseReducers.updateTotals(state);
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(
        (item) =>
          (item.variant
            ? `${item.productId}-${item.variant._id}`
            : item.productId) !== action.payload
      );
      cartSlice.caseReducers.updateTotals(state);
    },

    clearCart(state) {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQty = 0;
    },

    increaseQty(state, action: PayloadAction<string>) {
      const item = state.cartItems.find(
        (item) =>
          (item.variant
            ? `${item.productId}-${item.variant._id}`
            : item.productId) === action.payload
      );
      if (item) {
        item.quantity += 1;
      }
      cartSlice.caseReducers.updateTotals(state);
    },

    decreaseQty(state, action: PayloadAction<string>) {
      const item = state.cartItems.find(
        (item) =>
          (item.variant
            ? `${item.productId}-${item.variant._id}`
            : item.productId) === action.payload
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(
            (cartItem) =>
              (cartItem.variant
                ? `${cartItem.productId}-${cartItem.variant._id}`
                : cartItem.productId) !== action.payload
          );
        }
      }
      cartSlice.caseReducers.updateTotals(state);
    },

    updateTotals(state) {
      state.totalQty = state.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalAmount = state.cartItems.reduce((sum, item) => {
        const effectivePrice = item.variant?.price ?? item.price;
        return sum + effectivePrice * item.quantity;
      }, 0);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQty,
  decreaseQty,
} = cartSlice.actions;

export default cartSlice.reducer;
