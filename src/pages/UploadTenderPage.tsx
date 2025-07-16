import { Toaster } from "sonner";

import TenderUploader from "../components/tender-upload/TenderUploader";

export default function UploadTenderPage() {
  return (
    // Этот div центрирует наш компонент на странице
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Toaster от Sonner. richColors добавляет иконки к уведомлениям */}
      <Toaster position="top-center" richColors />
      <TenderUploader />
    </div>
  );
}