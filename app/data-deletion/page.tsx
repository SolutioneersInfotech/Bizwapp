import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DataDeletion() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 flex flex-col items-center">
      {/* Back Button - placed above the card */}
      <div className="w-full max-w-2xl mb-4">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Card */}
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🛡️ Data Deletion Instructions</h1>
        <p className="text-gray-700 mb-4">
          At <span className="font-semibold text-blue-600">BizWapp</span>, we value your privacy. If you
          wish to delete your data from our system, please email us at{" "}
          <a
            href="mailto:solutioneers.infotech@gmail.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            solutioneers.infotech@gmail.com
          </a>{" "}
          with your Facebook user ID or the email address used to register.
        </p>
        <p className="text-gray-700 mb-6">
          Your request will be processed within <strong>7 working days</strong>.
        </p>
        <p className="text-gray-700">
          For urgent concerns, you can also reach us via our support page:{" "}
          <a
            href="https://www.bizwapp.com/help-support"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            www.bizwapp.com/help-support
          </a>
          .
        </p>
      </div>
    </main>
  );
}
