import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  StarHalf,
  Check,
  Info,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileCTA from "@/components/dashboard/landingpage/mobile-cta";
// import Navbar from "@/components/navbar";
import VideoSection from "@/components/dashboard/landingpage/video-section";
import GallerySection from "@/components/dashboard/landingpage/gallery-section";

export default function LandingPage({ product }: { product: any }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-teal-50 to-white">
        <div className="container px-4 py-8 mx-auto md:py-16 lg:px-8 lg:flex lg:items-center lg:gap-12">
          <div className="lg:w-1/2 space-y-4 md:space-y-6">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 px-3 py-1">
                Limited Time Offer
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">
                New Arrival
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
                <StarHalf className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              {/* <span className="text-sm text-gray-600">(128 reviews)</span> */}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">$149.99</span>
              <span className="text-xl text-gray-500 line-through">
                $199.99
              </span>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                25% OFF
              </Badge>
            </div>
            <p className="text-lg text-gray-600 max-w-md">
              Experience crystal-clear sound and unmatched comfort with our
              premium wireless headphones. Perfect for music lovers, gamers, and
              professionals alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Add to Cart
              </Button>
              <Button size="icon" variant="ghost" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <p className="text-sm font-medium text-red-600 animate-pulse flex items-center gap-2">
                <Info className="h-4 w-4" /> Only 5 left in stock - order soon!
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">SKU:</span> WH-2023-PRO
              </p>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2 relative">
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-105">
              <Image
                src={product.images[0].url}
                alt="Premium Wireless Headphones"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Color/Variant Selection */}
      <section className="py-6 bg-white border-t border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Available Colors:
              </h3>
              <div className="flex gap-2 mt-2">
                <button className="w-8 h-8 rounded-full bg-black border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"></button>
                <button className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"></button>
                <button className="w-8 h-8 rounded-full bg-blue-600 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"></button>
                <button className="w-8 h-8 rounded-full bg-red-500 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"></button>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <h3 className="text-sm font-medium text-gray-700">Size:</h3>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 hover:bg-gray-50">
                  Standard
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 hover:bg-gray-50">
                  Compact
                </button>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex border border-gray-300 rounded-md">
                <button className="px-3 py-1 border-r border-gray-300 hover:bg-gray-50">
                  -
                </button>
                <span className="px-4 py-1 flex items-center justify-center">
                  1
                </span>
                <button className="px-3 py-1 border-l border-gray-300 hover:bg-gray-50">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
              <Truck className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-medium text-sm md:text-base">
                  Free Shipping
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  On all orders over $50
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
              <ShieldCheck className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-medium text-sm md:text-base">
                  Secure Checkout
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  100% protected payments
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
              <RotateCcw className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-medium text-sm md:text-base">
                  30-Day Returns
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Satisfaction guaranteed
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
              <Check className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-medium text-sm md:text-base">
                  2-Year Warranty
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Full coverage included
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="mb-4">
                  Introducing our Premium Wireless Headphones, the perfect blend
                  of exceptional sound quality, comfort, and style. Designed for
                  music enthusiasts, gamers, and professionals who demand the
                  best audio experience.
                </p>
                <p className="mb-4">
                  These headphones feature advanced noise cancellation
                  technology that blocks out ambient noise, allowing you to
                  immerse yourself completely in your music or focus on your
                  work without distractions.
                </p>
                <p className="mb-4">
                  The premium memory foam ear cushions provide exceptional
                  comfort for extended wear, while the adjustable headband
                  ensures a perfect fit for any head size. The sleek, modern
                  design makes these headphones as stylish as they are
                  functional.
                </p>
                <p>
                  With up to 40 hours of battery life, you can enjoy your music
                  all day long without worrying about recharging. And when you
                  do need to recharge, the quick-charge feature gives you 4
                  hours of playback from just 10 minutes of charging.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Technical Specifications
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Driver Size</span>
                      <span className="font-medium">40mm</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Frequency Response</span>
                      <span className="font-medium">20Hz - 20kHz</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Impedance</span>
                      <span className="font-medium">32 Ohms</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Sensitivity</span>
                      <span className="font-medium">105dB</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Bluetooth Version</span>
                      <span className="font-medium">5.2</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Battery & Dimensions
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Battery Life</span>
                      <span className="font-medium">Up to 40 hours</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Charging Time</span>
                      <span className="font-medium">2 hours</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Quick Charge</span>
                      <span className="font-medium">
                        10 min = 4 hours playback
                      </span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">250g</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Water Resistance</span>
                      <span className="font-medium">IPX4</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Shipping Information
                  </h3>
                  <p className="mb-2">
                    We offer the following shipping options:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Standard Shipping (3-5 business days): Free on orders over
                      $50, otherwise $5.99
                    </li>
                    <li>Express Shipping (1-2 business days): $12.99</li>
                    <li>
                      International Shipping (7-14 business days): Rates
                      calculated at checkout
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-gray-600">
                    All orders are processed within 24 hours during business
                    days.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Return Policy</h3>
                  <p className="mb-2">
                    We offer a 30-day satisfaction guarantee. If you&apos;re not
                    completely satisfied with your purchase, you can return it
                    within 30 days for a full refund or exchange.
                  </p>
                  <p className="text-sm text-gray-600">
                    Items must be returned in their original packaging and in
                    new, unused condition. Return shipping costs are the
                    responsibility of the customer unless the return is due to
                    our error.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Warranty</h3>
                  <p>
                    All our headphones come with a 2-year manufacturer&apos;s
                    warranty covering defects in materials and workmanship. For
                    warranty claims, please contact our customer support team.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                title: "40-Hour Battery Life",
                description:
                  "Enjoy your music all day with industry-leading battery performance",
                icon: "⚡",
              },
              {
                title: "Active Noise Cancellation",
                description:
                  "Block out the world and immerse yourself in your audio",
                icon: "🔇",
              },
              {
                title: "Premium Sound Quality",
                description:
                  "Experience rich bass and crystal clear highs with our custom drivers",
                icon: "🎵",
              },
              {
                title: "Comfortable Design",
                description:
                  "Designed for extended wear with memory foam ear cushions",
                icon: "👂",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Customer Reviews */}
      <section id="reviews" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Customer Reviews
              </h2>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  <StarHalf className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  Based on 128 reviews
                </span>
              </div>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0">
              Write a Review
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                date: "May 15, 2023",
                comment:
                  "These are the best headphones I've ever owned. The sound quality is amazing and they're so comfortable I forget I'm wearing them!",
              },
              {
                name: "Michael Chen",
                rating: 5,
                date: "April 28, 2023",
                comment:
                  "The battery life is incredible. I use these for work calls all day and they last the entire week on a single charge.",
              },
              {
                name: "Jessica Williams",
                rating: 4,
                date: "May 3, 2023",
                comment:
                  "Great noise cancellation and sound quality. The app could use some improvements, but overall I'm very satisfied with my purchase.",
              },
            ].map((review, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    &quot;{review.comment}&quot;
                  </p>
                  <p className="font-medium">- {review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="#" className="text-teal-600 hover:underline">
              Read all 128 reviews
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How long does the battery last?
              </AccordionTrigger>
              <AccordionContent>
                Our headphones provide up to 40 hours of playback time with
                active noise cancellation enabled. With ANC turned off, you can
                get up to 60 hours of battery life.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Are these headphones water resistant?
              </AccordionTrigger>
              <AccordionContent>
                Yes, our headphones have an IPX4 rating, making them resistant
                to sweat and light rain. However, they are not designed for
                submersion in water.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can I connect to multiple devices?
              </AccordionTrigger>
              <AccordionContent>
                Yes, our headphones support multipoint connection, allowing you
                to connect to two devices simultaneously and seamlessly switch
                between them.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                What&apos;s included in the box?
              </AccordionTrigger>
              <AccordionContent>
                The package includes the wireless headphones, a carrying case, a
                USB-C charging cable, a 3.5mm audio cable for wired use, and a
                user manual.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How do I claim the warranty?</AccordionTrigger>
              <AccordionContent>
                Our headphones come with a 2-year manufacturer&apos;s warranty.
                To claim warranty service, simply contact our customer support
                team with your order details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                name: "Wireless Earbuds Pro",
                price: "$89.99",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Bluetooth Speaker",
                price: "$129.99",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Headphone Stand",
                price: "$24.99",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Premium Audio Cable",
                price: "$19.99",
                image: "/placeholder.svg?height=200&width=200",
              },
            ].map((product, index) => (
              <div key={index} className="group">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-sm md:text-base">
                  {product.name}
                </h3>
                <p className="text-gray-700">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-16 bg-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Ready to Experience Premium Sound?
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and elevate your audio
            experience today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-teal-600 hover:bg-gray-100"
            >
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-teal-700"
            >
              Learn More
            </Button>
          </div>
          <p className="mt-6 text-sm">
            *Free shipping on all orders. 30-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <MobileCTA />
    </div>
  );
}
