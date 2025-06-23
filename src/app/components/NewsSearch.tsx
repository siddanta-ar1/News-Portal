'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; 
import { useUser } from '@supabase/auth-helpers-react'; 
import { useRouter } from 'next/navigation'; 
import AuthButtons from './AuthButtons';

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
  source?: 'api' | 'user';
  visibility?: 'public' | 'private'; 
}

export default function NewsSearch() {
  const user = useUser(); 
  const router = useRouter(); 

  const [country, setCountry] = useState('us');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); 

  
  useEffect(() => {
    if (!user) { 
      setShowLoginPrompt(true);
      setNews([]); 
    } else {
      setShowLoginPrompt(false); 
      setError(null); 
      
    }
  }, [user]); // Depend on the 'user' object

  async function fetchNews(countryCode: string) {
    if (!user) { 
      setError('Please log in to fetch news.');
      setShowLoginPrompt(true);
      setNews([]);
      return;
    }

    setLoading(true);
    setError(null);
    setNews([]); 

    try {
     
      const res = await fetch(
        `https://newsdata.io/api/1/latest?apikey=pub_b5c84fc50e2e44fda7fb187b40740cd9&q=world news&country=${countryCode}`
      );
      if (!res.ok) {
          throw new Error(`External API fetch failed with status: ${res.status}`);
      }
      const apiData = await res.json();

      interface ApiNewsItem {
        title: string;
        link: string;
        pubDate: string;
        source_id: string;
      }

      const apiResults: NewsArticle[] = apiData.results?.map((item: ApiNewsItem) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source_id: item.source_id,
        source: 'api',
      })) || [];

      
      interface UserNewsRow {
        title: string;
        link?: string;
        created_at: string;
        author_email?: string;
        visibility?: 'public' | 'private';
      }

      const { data: dbNews, error: dbError } = await supabase
        .from('user_news')
        .select('*')
        .eq('country_code', countryCode)
        .order('created_at', { ascending: false });

      if (dbError) {
          console.error('Supabase fetch error:', dbError);
          if (dbError.code === '42501') { 
              throw new Error("Access denied to user news. Please ensure you are logged in and have permissions.");
          } else {
              throw new Error(`Failed to fetch user-submitted news: ${dbError.message}`);
          }
      }

      const userNews: NewsArticle[] = (dbNews as UserNewsRow[] | null)?.map((item) => ({
        title: item.title,
        link: item.link || '#',
        pubDate: item.created_at,
        source_id: item.author_email || 'User Submission',
        source: 'user',
        visibility: item.visibility 
      })) || [];

      
      const combinedNews = [...userNews, ...apiResults];
      setNews(combinedNews);

      if (combinedNews.length === 0) {
        setError('No news found for this country.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Failed to fetch news: ' + err.message);
      } else {
        setError('Failed to fetch news: Unknown error');
      }
      setNews([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { 
      alert('Please log in to search for news.');
      router.push('/login'); 
    }
    if (country.trim()) {
      fetchNews(country.trim().toLowerCase());
    } else {
      setError('Please enter a country code.');
    }
  }

  async function saveToSupabase(article: NewsArticle) {
    if (!user) { 
      alert('Please log in to save news.');
      return;
    }
    
    const { error: insertError } = await supabase.from('saved_news').insert({
      title: article.title,
      link: article.link,
      pubDate: article.pubDate,
      source_id: article.source_id,
      user_id: user.id, 
    });

    if (insertError) {
      alert('Failed to save to favorites: ' + insertError.message);
    } else {
      alert('Saved to favorites!');
    }
  }

 
  if (showLoginPrompt) {
    return (
      <section className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 mb-6 flex flex-col items-center justify-center min-h-[250px] max-w-md mx-auto">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 mb-2">
        <svg
          className="w-8 h-8 text-blue-600 dark:text-blue-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.663-5.33-4-8-4z"
          />
        </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Access Restricted</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-xs">
        Please log in to search and view news articles.
          </p>
          <div className="mt-2">
        <AuthButtons />
          </div>
        </div>
      </section>
    );
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
          disabled={loading || !country.trim()}
          className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium transition-all shadow"
        >
          {loading ? '🔄 Loading...' : '🔍 Search'}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <ul className="space-y-4">
        {news.map((article, i) => (
          <li
            key={article.link || i}
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
              {article.source === 'user' && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                    User News
                  </span>
              )}
            </p>
            <button
              onClick={() => saveToSupabase(article)}
              className="mt-3 inline-block px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white shadow transition-colors"
            >
              ➕ Save to Favorites
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}