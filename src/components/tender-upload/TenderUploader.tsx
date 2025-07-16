// ============================================================================
// 2. ОСНОВНОЙ КОМПОНЕНТ ЗАГРУЗКИ
// Файл: components/tender-uploader.tsx

import { toast } from "sonner";

import { CheckCircle2, Loader, XCircle, File, UploadCloud } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { API_CONFIG } from "@/config/api";

type TaskStatus = "idle" | "uploading" | "processing" | "completed" | "failed";

// ============================================================================
export default function TenderUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<TaskStatus>("idle");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Логика обработки файла ---
  const processFile = (selectedFile: File) => {
    if (!selectedFile) return;
    const allowedTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Неверный формат файла", {
        description: "Пожалуйста, выберите файл .xlsx или .xls.",
      });
      return;
    }
    setFile(selectedFile);
    resetState(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  // --- Логика Drag and Drop ---
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { handleDragEvents(e); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { handleDragEvents(e); setIsDragging(false); };

  // --- Управление состоянием ---
  const resetState = (keepFile: boolean = false) => {
    setStatus("idle");
    setTaskId(null);
    setProgress(0);
    setErrorMessage(null);
    if (!keepFile) {
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // --- Логика API запросов ---
  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(50);
    setErrorMessage(null);
    const toastId = toast.loading("Загрузка файла на сервер...");

    const formData = new FormData();
    formData.append("tenderFile", file);

    try {
      const response = await fetch(`${API_CONFIG.API_BASE}/upload-tender`, { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось загрузить файл.");
      
      toast.success("Файл принят, начинается обработка.", { id: toastId });
      setTaskId(result.task_id);
      setStatus("processing");
    } catch (error) {
      const err = error as Error;
      toast.error("Ошибка загрузки", { id: toastId, description: err.message });
      setStatus("failed");
      setErrorMessage(err.message);
    }
  };

  useEffect(() => {
    if (status !== "processing" || !taskId) return;

    intervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${API_CONFIG.API_BASE}/tasks/${taskId}/status`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Задача не найдена.");

        if (result.status === "completed") {
          setStatus("completed");
          setProgress(100);
          toast.success("Обработка тендера успешно завершена!");
          if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (result.status === "failed") {
          setStatus("failed");
          const errorMsg = result.error || "Произошла неизвестная ошибка.";
          setErrorMessage(errorMsg);
          toast.error("Ошибка обработки", { description: errorMsg });
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (error) {
        const err = error as Error;
        setStatus("failed");
        setErrorMessage(err.message);
        toast.error("Ошибка получения статуса", { description: err.message });
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 3000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status, taskId]);

  const isUploadingOrProcessing = status === 'uploading' || status === 'processing';

  // --- Рендеринг компонента ---
  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="text-primary" />
          Загрузка тендера
        </CardTitle>
        <CardDescription>
          Перетащите XLSX файл в область ниже или нажмите для выбора.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* === Зона Drag & Drop === */}
        <div
          className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out
            ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'}`}
          onDrop={handleDrop} onDragOver={handleDragEvents} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Input ref={fileInputRef} id="tenderFile" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} disabled={isUploadingOrProcessing} />
          <div className="text-center">
            <UploadCloud className={`mx-auto h-12 w-12 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
            <p className="mt-2 text-sm text-gray-500"><span className="font-semibold">Нажмите для загрузки</span> или перетащите файл</p>
            <p className="text-xs text-gray-400">XLSX или XLS</p>
          </div>
        </div>

        {/* === Отображение статусов === */}
        {file && !isUploadingOrProcessing && status !== 'completed' && (
          <div className="text-sm text-muted-foreground flex items-center justify-between gap-2 p-2 border rounded-md">
            <div className="flex items-center gap-2 truncate"><File size={16} /> <span className="truncate">{file.name}</span></div>
            <Button variant="ghost" size="icon" onClick={() => resetState()} className="h-6 w-6 flex-shrink-0"><XCircle size={16} /></Button>
          </div>
        )}
        {isUploadingOrProcessing && (
          <div className="w-full pt-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center flex items-center justify-center gap-2"><Loader className="animate-spin" size={16} />{status === 'uploading' ? 'Загрузка...' : 'Обработка на сервере...'}</p>
          </div>
        )}
        {status === 'completed' && (
          <div className="text-green-600 flex items-center gap-2 p-3 bg-green-50 rounded-md"><CheckCircle2 /><span>Обработка успешно завершена!</span></div>
        )}
        {status === 'failed' && (
          <div className="text-red-600 flex items-center gap-2 p-3 bg-red-50 rounded-md"><XCircle /><span>Ошибка: {errorMessage}</span></div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={!file || isUploadingOrProcessing} className="w-full">
          Загрузить и обработать
        </Button>
      </CardFooter>
    </Card>
  );
}