// Define Product type
type Product = {
  id: string
  name: string
  brand: string
  price: number
  image: string
  status: "In Stock" | "Out of Stock"
  specifications: Record<string, string>
}

// Mock product data
export const mockProducts: Product[] = [
  {
    id: "tv-samsung-1",
    name: 'Samsung 55" Crystal UHD 4K Smart TV',
    brand: "Samsung",
    price: 75000,
    image: "/placeholder.svg?height=200&width=200",
    status: "In Stock",
    specifications: {
      Display: "55-inch Crystal UHD 4K",
      Resolution: "3840 x 2160",
      "Smart Features": "Tizen OS, Voice Assistant",
      Connectivity: "3 HDMI, 2 USB, Wi-Fi, Bluetooth",
      Audio: "20W Dolby Digital Plus",
      "Refresh Rate": "60Hz",
      HDR: "HDR10+",
    },
  },
  {
    id: "tv-sony-1",
    name: 'Sony 65" X80J 4K Ultra HD Smart LED TV',
    brand: "Sony",
    price: 120000,
    image: "/placeholder.svg?height=200&width=200",
    status: "In Stock",
    specifications: {
      Display: "65-inch LED",
      Resolution: "3840 x 2160",
      "Smart Features": "Google TV, Voice Search",
      Connectivity: "4 HDMI, 2 USB, Wi-Fi, Bluetooth",
      Audio: "20W with Dolby Atmos",
      "Refresh Rate": "60Hz",
      HDR: "HDR10, Dolby Vision",
      Processor: "X1 4K Processor",
    },
  },
  {
    id: "tv-lg-1",
    name: 'LG 50" UHD 4K Smart TV',
    brand: "LG",
    price: 65000,
    image: "/placeholder.svg?height=200&width=200",
    status: "In Stock",
    specifications: {
      Display: "50-inch LED",
      Resolution: "3840 x 2160",
      "Smart Features": "webOS, ThinQ AI",
      Connectivity: "3 HDMI, 2 USB, Wi-Fi, Bluetooth",
      Audio: "20W with Ultra Surround",
      "Refresh Rate": "60Hz",
      HDR: "Active HDR",
      Processor: "Quad Core Processor",
    },
  },
  {
    id: "tv-mi-1",
    name: 'Mi 43" 4K Android Smart TV',
    brand: "Xiaomi",
    price: 42000,
    image: "/placeholder.svg?height=200&width=200",
    status: "Out of Stock",
    specifications: {
      Display: "43-inch LED",
      Resolution: "3840 x 2160",
      "Smart Features": "Android TV 10, Chromecast",
      Connectivity: "3 HDMI, 2 USB, Wi-Fi, Bluetooth",
      Audio: "30W with Dolby Audio",
      "Refresh Rate": "60Hz",
      HDR: "HDR10+",
      Processor: "Quad Core A55",
    },
  },
  {
    id: "tv-samsung-2",
    name: 'Samsung 43" AU7700 Crystal 4K UHD Smart TV',
    brand: "Samsung",
    price: 52000,
    image: "/placeholder.svg?height=200&width=200",
    status: "In Stock",
    specifications: {
      Display: "43-inch Crystal UHD",
      Resolution: "3840 x 2160",
      "Smart Features": "Tizen OS, Bixby",
      Connectivity: "3 HDMI, 1 USB, Wi-Fi, Bluetooth",
      Audio: "20W",
      "Refresh Rate": "60Hz",
      HDR: "HDR",
      Processor: "Crystal Processor 4K",
    },
  },
  {
    id: "tv-sony-2",
    name: 'Sony 55" X85J 4K Ultra HD Smart Google TV',
    brand: "Sony",
    price: 95000,
    image: "/placeholder.svg?height=200&width=200",
    status: "In Stock",
    specifications: {
      Display: "55-inch LED",
      Resolution: "3840 x 2160",
      "Smart Features": "Google TV, Voice Search",
      Connectivity: "4 HDMI, 2 USB, Wi-Fi, Bluetooth",
      Audio: "20W with Dolby Atmos",
      "Refresh Rate": "120Hz",
      HDR: "HDR10, Dolby Vision, HLG",
      Processor: "X1 4K HDR Processor",
    },
  },
]
