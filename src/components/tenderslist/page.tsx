// Директива "use client" здесь не нужна и не имеет никакого эффекта в Vite.
// Можете ее смело удалить из всех файлов.

import { useState, useEffect } from "react";
import { columns, type Payment } from "./columns";
import { DataTable } from "./data-table";

// Эту функцию можно оставить как есть или вынести в отдельный api.js файл
async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  // Для примера оставим заглушку
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "728ed52f",
          amount: 100,
          status: "pending",
          email: "m@example.com",
        },
        {
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
		{
          id: "728sds52f",
          amount: 2340,
          status: "processing",
          email: "m@example.com",
        },
        // ...
      ]);
    }, 1000); // Имитация сетевой задержки
  });
}

// Компонент теперь является обычной, а не async функцией
export default function DemoPage() {
  // 1. Создаем состояние для хранения данных и состояния загрузки
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Используем useEffect для запроса данных после рендера компонента
  useEffect(() => {
    // Внутри useEffect создаем async функцию и сразу вызываем ее
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getData();
      setData(result);
      setIsLoading(false);
    };

    fetchData();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз

  // Можно добавить отображение загрузчика
  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  // 3. Рендерим таблицу с полученными данными
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}