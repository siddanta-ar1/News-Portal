// app/news/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function NewsDetailPage({ params }: { params: { id: number } }) {
  const idStr = params.id.toString();
  const res = await fetch(`https://api.example.com/news/${idStr}`);
  const data = await res.json();

  if (!data) {
    notFound(); // redirects to /not-found
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}
