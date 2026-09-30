import Invoice, { InvoiceData } from "./Invoice";

export default function Index() {
  // Sample invoice data matching your structure
  const sampleInvoice: InvoiceData = {
    invoiceNumber: "INV-001",
    date: "2024-01-15",
    customer: {
      name: "Gamael Kodria Syam",
      address: "Jl. Sudirman No. 123, Jakarta Pusat\nJakarta 10110, Indonesia",
      // MODIFIED: Added sample data for phone and email
      phone: "+62 812 3456 7890",
      email: "gamael.syam@example.com",
    },
    contact: {
      phone: "+62 812 3456 7890",
      address: "Maven Zone HQ, Jakarta",
      website: "www.mavenzone.com",
    },
    items: [
      {
        sl: 1,
        description: "Apple watch",
        price: "500.00",
        qty: 1,
        total: "500.00",
      },
      {
        sl: 2,
        description: "Samsung Galaxy S21",
        price: "800.00",
        qty: 1,
        total: "800.00",
      },
      {
        sl: 3,
        description: "Headphones",
        price: "100.00",
        qty: 6,
        total: "600.00",
      },
      {
        sl: 4,
        description: "Microsoft Surface Pro",
        price: "200.00",
        qty: 3,
        total: "600.00",
      },
    ],
    subTotal: "2500.00",
    DeliveryCharge: 50,
    totalAmount: "2550.00",
    paymentMethod: "Cash On Delivery",
    footerMessage:
      "Your trust means the world to us! Without you, there's no us. We appreciate your trust in Maven Zone.",
    companyTagline: "Quality products. with a promise of care.",
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Maven Zone
            <span className="block text-2xl md:text-3xl font-normal text-gray-600 mt-2">
              Professional Invoice System
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate beautiful, professional invoices for your ecommerce
            business with our modern invoice system.
          </p>
        </div>

        {/* Invoice Component */}
        <div className="mb-16">
          <Invoice invoice={sampleInvoice} />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Professional Design
            </h3>
            <p className="text-gray-600">
              Beautiful, modern invoice design that reflects your brand&apos;s
              professionalism and attention to detail.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Automated Calculations
            </h3>
            <p className="text-gray-600">
              Automatic subtotal, tax, and total calculations with support for
              multiple items and quantities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Easy Customization
            </h3>
            <p className="text-gray-600">
              Fully customizable template with your company branding, colors,
              and business information.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            © 2024 Maven Zone. Professional invoice system for modern
            businesses.
          </p>
        </div>
      </div>
    </div>
  );
}
