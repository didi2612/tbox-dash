import React from "react";
import { useNavigate } from "react-router-dom";

const Terms: React.FC = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate(-1); // Go back to the previous page (Signup)
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-500 text-white mb-5 py-3 text-center shadow-md">
        <h1 className="text-2xl text-white uppercase font-bold tracking-wide">Terms & Conditions</h1>
      </header>

      {/* Terms Content */}
      <div className="flex-grow px-6 md:px-16 py-8 overflow-y-auto max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="space-y-6">
          {[
            { title: "1. Introduction", content: "By signing up, you agree to abide by our terms. Please read them carefully." },
            { title: "2. User Responsibilities", content: "Provide accurate details, keep credentials secure, and avoid misuse." },
            { title: "3. Privacy Policy", content: "Your data is protected under our privacy policy. We do not share without consent." },
            { title: "4. Prohibited Activities", content: "Any attempt to hack or disrupt the system leads to an immediate ban." },
            { title: "5. Changes to Terms", content: "We may update terms periodically. Continued use implies acceptance." },
            { title: "6. Contact Information", content: 'For queries, contact us at <a href="mailto:support@example.com" class="text-blue-500 hover:underline">support@example.com</a>.' }
          ].map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              <p className="text-gray-600 mt-1">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accept Button */}
      <footer className="bg-white py-4 shadow-md fixed bottom-0 left-0 w-full flex justify-center">
        <button
          onClick={handleAccept}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
        >
          Accept & Continue
        </button>
      </footer>
    </div>
  );
};

export default Terms;
