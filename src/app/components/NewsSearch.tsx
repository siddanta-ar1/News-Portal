'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
  sourc?: 'api' | 'user';
}

export default function NewsSearch() {
  const [country, setCountry] = useState('us'); // default US news
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

async function fetchNews(countryCode: string) {
  setLoading(true);
  setError(null);

  try {
    // ✅ Fetch from external API
    const res = await fetch(
      `https://newsdata.io/api/1/latest?apikey=pub_b5c84fc50e2e44fda7fb187b40740cd9&q=world news&country=${countryCode}`
    );
    const data = await res.json();

    type ApiResultItem = {
      title: string;
      link: string;
      pubDate: string;
      source_id: string;
      // add other fields from the API response if needed
    };

    const apiResults: NewsArticle[] = data.results?.map((item: ApiResultItem) => ({
      ...item,
      source: 'api',
    })) || [];

    // ✅ Fetch from Supabase user_news table
    const { data: dbNews } = await supabase
      .from('user_news')
      .select('*')
      .eq('country_code', countryCode)
      .order('created_at', { ascending: false });

    const userNews: NewsArticle[] = dbNews?.map((item) => ({
      title: item.title,
      link: item.link || '#',
      pubDate: item.created_at,
      source_id: item.author_email || 'User Submission',
      source: 'user',
    })) || [];

    // ✅ Combine both
    setNews([...userNews, ...apiResults]);

    if (!apiResults.length && !userNews.length) {
      setError('No news found for this country.');
    }
  } catch (err) {
    setError('Failed to fetch news: ' + err);
    setNews([]);
  }

  setLoading(false);
}


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (country.trim()) {
      fetchNews(country.trim().toLowerCase());
    }
  }

    async function saveToSupabase(article: NewsArticle) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    alert('Please log in to save news.');
    return;
  }
  
    const { error } = await supabase.from('saved_news').insert({
    title: article.title,
    link: article.link,
    pubDate: article.pubDate,
    source_id: article.source_id,
  });

  if (error) {
    alert('Failed to save: ' + error.message);
  } else {
    alert('Saved to favorites!');
  }
}


  return (
    <section className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 mb-6 space-y-6">
  <form
    onSubmit={handleSubmit}
    className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
  >
    <input
      type="text"
      placeholder="Enter country code (e.g. us, np, in)"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
      className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      disabled={loading}
      className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium transition-all shadow"
    >
      {loading ? '🔄 Loading...' : '🔍 Search'}
    </button>
  </form>

  {error && <p className="text-red-600 text-sm">{error}</p>}

  <ul className="space-y-4">
    {news.map((article, i) => (
      <li
        key={i}
        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800"
      >
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-blue-700 dark:text-blue-400 hover:underline"
        >
          {article.title}
        </a>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {article.source_id} | {new Date(article.pubDate).toLocaleDateString()}
        </p>
        <button
          onClick={() => saveToSupabase(article)}
          className="mt-3 inline-block px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white shadow transition-colors">
         ➕ Save to Favorites
        </button>

      </li>
    ))}
  </ul>
</section>

  );
}
