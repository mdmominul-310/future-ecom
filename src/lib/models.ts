// import mongoose from 'mongoose';
import Product from "@/models/Product";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import User from "@/models/User";
import Review from "@/models/Review";
import { Color } from "@/models/Color";
import Size from "@/models/Size";

// Ensure all models are registered
const models = {
  Product,
  Category,
  Subcategory,
  User,
  Review,
  Color,
  Size,
};

export default models;
