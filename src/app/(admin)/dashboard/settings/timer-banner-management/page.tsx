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
  Timer,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

// --- Types ---
interface CampaignBanner {
  _id: string;
  title: string;
  description: string;
  image: { url: string; public_id: string };
  targetDate: string;
  linkedProductId: string;
  isActive: boolean;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
}

// --- Main Page Component ---
export default function TimerOfferBannerManagementPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Timer className="h-10 w-10" />
            Timer Offer Banner Management
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Create and manage the main promotional campaign banner with a
            countdown.
          </p>
        </header>
        <main>
          <CampaignBannerSettings />
        </main>
      </div>
    </div>
  );
}

// --- Management Logic ---
const CampaignBannerSettings = () => {
  const [banners, setBanners] = useState<CampaignBanner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CampaignBanner | null>(
    null
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bannersRes, productsRes] = await Promise.all([
        fetch("/api/campaign-banner"),
        fetch("/api/products?limit=1000"),
      ]);
      if (!bannersRes.ok || !productsRes.ok)
        throw new Error("Failed to fetch data");
      const bannersData = await bannersRes.json();
      const productsPayload = await productsRes.json();
      setBanners(bannersData);
      setProducts(productsPayload.products || []);
    } catch (error: any) {
      toast.error("Failed to load data.", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (banner: CampaignBanner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      toast.loading("Deleting banner...");
      try {
        const res = await fetch(`/api/campaign-banner/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Deletion failed");
        toast.success("Banner deleted successfully!");
        fetchData(); // Refresh list
      } catch (error: any) {
        toast.error("Delete failed.", { description: error.message });
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    toast.loading("Saving banner...");
    const isEditing = !!editingBanner;
    const endpoint = isEditing
      ? `/api/campaign-banner/${editingBanner?._id}`
      : "/api/campaign-banner";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Save failed");
      }
      toast.success(
        `Banner ${isEditing ? "updated" : "created"} successfully!`
      );
      setIsModalOpen(false);
      setEditingBanner(null);
      fetchData(); // Refresh list
    } catch (error: any) {
      toast.error("Save operation failed.", { description: error.message });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Manage Banners
          </h3>
          <p className="mt-1 text-gray-500">
            Only one banner can be active at a time.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-700 transition"
        >
          <PlusCircle size={18} /> New Banner
        </button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center py-8 text-gray-500">Loading banners...</p>
        ) : banners.length > 0 ? (
          banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-gray-50 p-4 rounded-lg border flex items-center justify-between gap-4 flex-wrap"
            >
              <Image
                src={banner.image.url}
                alt={banner.title}
                width={60}
                height={60}
                className="rounded-md object-cover bg-gray-200"
              />
              <div className="flex-grow">
                <h4 className="font-bold text-gray-800">{banner.title}</h4>
                <p className="text-sm text-gray-500">
                  Ends on: {format(new Date(banner.targetDate), "PPP p")}
                </p>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm">
                {banner.isActive ? (
                  <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="p-2 text-gray-500 hover:text-slate-700"
                  aria-label="Edit Banner"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="p-2 text-red-500 hover:text-red-700"
                  aria-label="Delete Banner"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No banners found.</p>
        )}
      </div>
      {isModalOpen && (
        <CampaignBannerForm
          initialData={editingBanner}
          products={products}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

// --- Form Modal Component ---
const CampaignBannerForm = ({
  initialData,
  products,
  onSubmit,
  onClose,
}: {
  initialData: CampaignBanner | null;
  products: Product[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    targetDate: initialData
      ? format(new Date(initialData.targetDate), "yyyy-MM-dd'T'HH:mm")
      : "",
    linkedProductId: initialData?.linkedProductId || "",
    isActive: initialData?.isActive || false,
  });
  const [image, setImage] = useState<string | null>(
    initialData?.image.url || null
  );

  // Character limit constants
  const TITLE_LIMIT = 60;
  const DESCRIPTION_LIMIT = 120;

  const productOptions = useMemo(
    () => products.map((p) => ({ value: p._id, label: p.name })),
    [products]
  );

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
    if (!image) return toast.error("Banner image is required.");
    if (!formData.linkedProductId)
      return toast.error("Please select a product to link.");
    onSubmit({ ...formData, image });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">
          {initialData ? "Edit Banner" : "Create New Banner"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              maxLength={TITLE_LIMIT}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.title.length}/{TITLE_LIMIT}
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              rows={3}
              maxLength={DESCRIPTION_LIMIT}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.description.length}/{DESCRIPTION_LIMIT}
            </div>
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Banner Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 w-full text-sm"
            />
            {image && (
              <Image
                src={image}
                alt="Preview"
                width={100}
                height={100}
                className="mt-2 rounded bg-gray-200"
              />
            )}
          </div>
          <div>
            <label
              htmlFor="targetDate"
              className="block text-sm font-medium text-gray-700"
            >
              Offer End Date & Time
            </label>
            <input
              id="targetDate"
              type="datetime-local"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link to Product
            </label>
            <SearchableSelect
              options={productOptions}
              value={formData.linkedProductId}
              onChange={(val) =>
                setFormData((p) => ({ ...p, linkedProductId: val }))
              }
              placeholder="Select a product"
            />
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
            >
              Set as Active Banner
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, isActive: e.target.checked }))
                }
                className="sr-only"
              />
              {formData.isActive ? (
                <ToggleRight className="w-10 h-10 text-green-600" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-gray-400" />
              )}
            </label>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-md font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-slate-800 text-white px-6 py-2 rounded-md font-semibold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-500"}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className="-mr-1 ml-2 h-5 w-5 text-gray-400"
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
          <ul className="max-h-60 overflow-y-auto" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`p-2 cursor-pointer hover:bg-slate-100 ${
                    value === option.value ? "bg-slate-200" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
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
