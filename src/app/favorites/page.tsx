'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';


interface SavedNews {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
  image_url?: string;
}

export default function FavoritesPage() {
    const handleDelete = async (id: string) => {
    const { error } = await supabase.from('saved_news').delete().eq('id', id);
    if (error) {
     alert('Failed to delete: ' + error.message);
    } else {
     setNews((prev) => prev.filter((item) => item.id !== id));
    }
    };
  const [news, setNews] = useState<SavedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {




    const getUserAndNews = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from('saved_news')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved news:', error.message);
      } else {
        setNews(data || []);
      }

      setLoading(false);
    };

    getUserAndNews();
  }, []);

 if (loading) {
  return (
    <div className="flex items-center justify-center py-10">
      <p className="text-lg font-medium text-black dark:text-black animate-pulse">
        ⏳ Loading your saved news...
      </p>
    </div>
  );
}

if (!userId) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
      <p className="text-lg font-semibold text-black dark:text-black">
        🔒 Please log in to view your saved news.
      </p>
      <button
        onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-colors"
      >
        Login with Google
      </button>
    </div>
  );
}

  return (
    <section className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 mb-6 space-y-6">
  <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">📌 Your Saved News</h2>

  {news.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
      You have not saved any news yet. Search and save your favorites!
    </p>
  ) : (
    <ul className="space-y-4">
  {news.map((article) => (
    <li
      key={article.id}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow"
    >
      {article.image_url && (
        <Image
          src={article.image_url}
           alt="News Image"
                  width={700}
                  height={300}
                  className="object-cover rounded"
        />
      )}
      <Link
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-lg font-semibold text-blue-700 dark:text-blue-400 hover:underline"
      >
        {article.title}
      </Link>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {article.source_id} | {new Date(article.pubDate).toLocaleDateString()}
      </p>
      <button
        onClick={() => handleDelete(article.id)}
        className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow transition-colors"
      >
        🗑 Delete
      </button>
    </li>
  ))}
</ul>

  )}
</section>

  );
}
