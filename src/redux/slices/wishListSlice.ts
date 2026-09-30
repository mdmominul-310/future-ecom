import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
}

const initialState: WishlistItem[] = [];

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      if (!state.find(item => item.id === action.payload.id)) {
        state.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      return state.filter(item => item.id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
