"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  PlusCircle,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import Image from "next/image";

// --- Types ---
interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  url: string;
  linkType?: "category" | "product";
  linkedId?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}
interface Product {
  _id: string;
  name: string;
}

// --- Main Page Component ---
export default function HeroManagementPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <ImageIcon className="h-10 w-10" />
            Hero Section Management
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Create, edit, and manage the slides in your homepage carousel.
          </p>
        </header>
        <main>
          <HeroSectionSettings />
        </main>
      </div>
    </div>
  );
}

// --- Reusable Card Component ---
const SettingsCard = ({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="p-6 flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-gray-500">{description}</p>
      </div>
      {actions && <div>{actions}</div>}
    </div>
    <div className="px-6 py-4 bg-gray-50/70">{children}</div>
  </div>
);

// --- Hero Section Management Component ---
const HeroSectionSettings = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsDataLoading(true);
      try {
        const [slidesRes, categoriesRes, productsRes] = await Promise.all([
          fetch("/api/hero-slides"),
          fetch("/api/categories"),
          fetch("/api/products?limit=1000"),
        ]);

        if (!slidesRes.ok) throw new Error("Failed to fetch slides");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
        if (!productsRes.ok) throw new Error("Failed to fetch products");

        const slidesData: HeroSlide[] = await slidesRes.json();
        const categoriesData: Category[] = await categoriesRes.json();
        const productsPayload = await productsRes.json();

        setSlides(slidesData);
        setCategories(categoriesData);
        setProducts(productsPayload.products || []);
      } catch (error: any) {
        toast.error("Failed to load initial data.", {
          description: error.message,
        });
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreate = () => {
    setEditingSlide(null);
    setIsModalOpen(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      toast.loading("Deleting slide...");
      try {
        const response = await fetch(`/api/hero-slides/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete");
        }
        setSlides(slides.filter((s) => s._id !== id));
        toast.success("Slide deleted successfully!");
      } catch (error: any) {
        toast.error("Delete failed.", { description: error.message });
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    toast.loading("Saving slide...");
    const isEditing = !!editingSlide;
    const endpoint = isEditing
      ? `/api/hero-slides/${editingSlide?._id}`
      : "/api/hero-slides";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save slide");
      }

      const savedSlide = await response.json();

      if (isEditing) {
        setSlides(
          slides.map((s) => (s._id === savedSlide._id ? savedSlide : s))
        );
        toast.success("Slide updated successfully!");
      } else {
        setSlides([...slides, savedSlide]);
        toast.success("Slide created successfully!");
      }

      setIsModalOpen(false);
      setEditingSlide(null);
    } catch (error: any) {
      toast.error("Save operation failed.", { description: error.message });
    }
  };

  return (
    <SettingsCard
      title="Manage Slides"
      description="Control the slides displayed in the main homepage carousel."
      actions={
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-700 transition"
        >
          <PlusCircle size={18} />
          New Slide
        </button>
      }
    >
      {isDataLoading ? (
        <p className="text-gray-500">Loading slides...</p>
      ) : (
        <div className="space-y-4">
          {slides.length > 0 ? (
            slides.map((slide) => (
              <div
                key={slide._id}
                className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={80}
                    height={80}
                    className="rounded-md object-cover bg-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{slide.title}</h4>
                    <p className="text-sm text-gray-500">{slide.subtitle}</p>
                    <a
                      href={slide.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:underline"
                    >{`Link: ${slide.url}`}</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 text-gray-500 hover:text-slate-700 transition-colors"
                    aria-label="Edit slide"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete slide"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No slides have been created yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Click &quot;New Slide&quot; to get started.
              </p>
            </div>
          )}
        </div>
      )}
      {isModalOpen && (
        <HeroSlideForm
          initialData={editingSlide}
          categories={categories}
          products={products}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </SettingsCard>
  );
};

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="w-full text-left bg-white border border-gray-300 rounded-md shadow-sm p-2 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-500"}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border-gray-300 rounded-md shadow-sm p-2 pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`p-2 cursor-pointer hover:bg-slate-100 ${
                    value === option.value ? "bg-slate-200" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 text-center">
                No options found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- UPDATED Hero Slide Form Modal Component ---
const HeroSlideForm = ({
  initialData,
  categories,
  products,
  onSubmit,
  onClose,
}: {
  initialData: HeroSlide | null;
  categories: Category[];
  products: Product[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    description: initialData?.description || "",
    linkType: initialData?.linkType || "category",
    linkedId: initialData?.linkedId || "",
  });
  const [image, setImage] = useState<string | null>(initialData?.image || null);

  // Character limit constants
  const TITLE_LIMIT = 40;
  const SUBTITLE_LIMIT = 25;
  const DESCRIPTION_LIMIT = 125;

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ value: cat.slug, label: cat.name })),
    [categories]
  );
  const productOptions = useMemo(
    () => products.map((prod) => ({ value: prod._id, label: prod.name })),
    [products]
  );

  const handleLinkedIdChange = (value: string) => {
    setFormData((prev) => ({ ...prev, linkedId: value }));
  };

  const handleLinkTypeChange = (type: "category" | "product") => {
    setFormData((prev) => ({ ...prev, linkType: type, linkedId: "" }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error("Slide image is required.");
      return;
    }
    if (!formData.linkedId) {
      toast.error(`Please select a ${formData.linkType}.`);
      return;
    }
    const finalUrl =
      formData.linkType === "category"
        ? `/category/${formData.linkedId}`
        : `/products/${formData.linkedId}`;
    onSubmit({ ...formData, url: finalUrl, image });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity">
      <div
        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {initialData ? "Edit Hero Slide" : "Create New Hero Slide"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-slate-500 focus:border-slate-500"
              required
              maxLength={TITLE_LIMIT}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.title.length}/{TITLE_LIMIT}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-slate-500 focus:border-slate-500"
              required
              maxLength={SUBTITLE_LIMIT}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.subtitle.length}/{SUBTITLE_LIMIT}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-slate-500 focus:border-slate-500"
              maxLength={DESCRIPTION_LIMIT}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.description.length}/{DESCRIPTION_LIMIT}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slide Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
            />
            {image && (
              <div className="mt-4 border rounded-lg p-2 inline-block">
                <Image
                  src={image}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
              </div>
            )}
          </div>
          <div className="border-t pt-6">
            <label className="block text-lg font-semibold text-gray-800">
              &quot;Shop Now&quot; Button Link
            </label>
            <div className="mt-4 flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="linkType"
                  value="category"
                  checked={formData.linkType === "category"}
                  onChange={() => handleLinkTypeChange("category")}
                  className="h-4 w-4 text-slate-600 focus:ring-slate-500"
                />
                <span className="ml-2 text-gray-700">Link to Category</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="linkType"
                  value="product"
                  checked={formData.linkType === "product"}
                  onChange={() => handleLinkTypeChange("product")}
                  className="h-4 w-4 text-slate-600 focus:ring-slate-500"
                />
                <span className="ml-2 text-gray-700">Link to Product</span>
              </label>
            </div>
            <div className="mt-4">
              {formData.linkType === "category" ? (
                <SearchableSelect
                  placeholder="Select a Category"
                  options={categoryOptions}
                  value={formData.linkedId}
                  onChange={handleLinkedIdChange}
                />
              ) : (
                <SearchableSelect
                  placeholder="Select a Product"
                  options={productOptions}
                  value={formData.linkedId}
                  onChange={handleLinkedIdChange}
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-slate-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-slate-700 transition-colors"
            >
              Save Slide
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
