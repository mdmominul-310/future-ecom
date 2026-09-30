"use client";
import React from "react";

const TermsConditionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-5 md:py-8 lg:py-10">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Terms & Conditions
        </h1>

        <div className="space-y-6 text-gray-700">
          <p>
            Welcome to our website. If you continue to browse and use this
            website, you are agreeing to comply with and be bound by the
            following terms and conditions of use, which together with our
            privacy policy govern our relationship with you in relation to this
            website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using our website, you agree to be bound by these
            Terms and Conditions and all applicable laws and regulations. If you
            do not agree with any of these terms, you are prohibited from using
            or accessing this site.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            2. Use of Website
          </h2>
          <p>
            The content of the pages of this website is for your general
            information and use only. It is subject to change without notice.
            Neither we nor any third parties provide any warranty or guarantee
            as to the accuracy, timeliness, performance, completeness or
            suitability of the information and materials found or offered on
            this website for any particular purpose. You acknowledge that such
            information and materials may contain inaccuracies or errors and we
            expressly exclude liability for any such inaccuracies or errors to
            the fullest extent permitted by law.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            3. Intellectual Property
          </h2>
          <p>
            This website contains material which is owned by or licensed to us.
            This material includes, but is not limited to, the design, layout,
            look, appearance and graphics. Reproduction is prohibited other than
            in accordance with the copyright notice, which forms part of these
            terms and conditions.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            4. Product Information and Pricing
          </h2>
          <p>
            We strive to ensure that all product information and pricing on our
            website are accurate. However, errors may occur. We reserve the
            right to correct any errors, inaccuracies or omissions and to change
            or update information at any time without prior notice (including
            after you have submitted your order).
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            5. Limitation of Liability
          </h2>
          <p>
            In no event shall we be liable for any direct, indirect, incidental,
            special, consequential or exemplary damages, including but not
            limited to, damages for loss of profits, goodwill, use, data or
            other intangible losses (even if we have been advised of the
            possibility of such damages), resulting from: (i) the use or the
            inability to use the website; (ii) the cost of procurement of
            substitute goods and services resulting from any goods, data,
            information or services purchased or obtained or messages received
            or transactions entered into through or from the website; (iii)
            unauthorized access to or alteration of your transmissions or data;
            (iv) statements or conduct of any third party on the website; or (v)
            any other matter relating to the website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            6. Governing Law
          </h2>
          <p>
            Your use of this website and any dispute arising out of such use of
            the website is subject to the laws of Bangladesh.
          </p>

          <p className="mt-8">
            If you have any questions about these Terms & Conditions, please{" "}
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

export default TermsConditionsPage;
