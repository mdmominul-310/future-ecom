"use client";
import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-5 md:py-8 lg:py-10">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-700">
          <p>
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Information We Collect
          </h2>
          <p>
            We may collect personal information that you voluntarily provide to
            us when you register on the website, place an order, subscribe to
            our newsletter, respond to a survey, or fill out a form. This
            information may include your name, email address, mailing address,
            phone number, and payment information.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Personal Data:</strong> Name, email address, shipping
              address, billing address, phone number.
            </li>
            <li>
              <strong>Payment Data:</strong> Payment card details (processed
              securely by third-party payment processors).
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you access and
              use the website, including IP address, browser type, operating
              system, and pages visited.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            How We Use Your Information
          </h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To process your orders and manage your account.</li>
            <li>
              To send you transactional emails (order confirmations, shipping
              updates).
            </li>
            <li>
              To send you marketing and promotional communications (if
              you&apos;ve opted in).
            </li>
            <li>To improve our website and services.</li>
            <li>
              To respond to your customer service requests and support needs.
            </li>
            <li>To detect and prevent fraudulent transactions.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Disclosure of Your Information
          </h2>
          <p>
            We may share your information with third-party service providers to
            perform functions on our behalf, such as payment processing,
            shipping, and marketing assistance. We do not sell, trade, or
            otherwise transfer your personally identifiable information to
            outside parties without your consent, other than as described
            herein.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Data Security
          </h2>
          <p>
            We implement a variety of security measures to maintain the safety
            of your personal information when you place an order or enter,
            submit, or access your personal information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Cookies
          </h2>
          <p>
            We use cookies to enhance your experience, gather general visitor
            information, and track visits to our website. You can choose to have
            your computer warn you each time a cookie is being sent, or you can
            choose to turn off all cookies through your browser settings.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Your Consent
          </h2>
          <p>By using our site, you consent to our privacy policy.</p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Changes to Our Privacy Policy
          </h2>
          <p>
            If we decide to change our privacy policy, we will post those
            changes on this page.
          </p>

          <p className="mt-8">
            If you have any questions about this Privacy Policy, please{" "}
            <a href="/contact" className="text-orange-600 hover:underline">
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
