import { notFound } from 'next/navigation';

type Params = Promise<{ id: string }>;

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const res = await fetch(`https://api.example.com/news/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  if (!data) notFound();

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}
