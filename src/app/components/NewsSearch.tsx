'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Your Supabase client
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation'; // Using next/navigation for App Router

interface NewsArticle {
  id?: string; // Crucial for identifying user-submitted news and linking to invite page
  user_id?: string; // Author's user ID, also crucial for invite button logic
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
  source?: 'api' | 'user';
  visibility?: 'public' | 'private'; // For Feature 2
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
      setNews([]); // Clear news if user is not logged in
    } else {
      setShowLoginPrompt(false);
      setError(null); // Clear any previous error messages
      // Optional: auto-fetch default news (e.g., for 'us') when a user logs in
      // if (news.length === 0 && !loading && !error && country) {
      //   fetchNews(country);
      // }
    }
  }, [user]);

  async function fetchNews(countryCode: string) {
    if (!user) {
      setError('Please log in to fetch news.');
      setShowLoginPrompt(true);
      setNews([]);
      return;
    }

    setLoading(true);
    setError(null);
    setNews([]); // Clear old news while loading

    try {
      // --- Fetch from external API ---
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
        // Add other properties from NewsData.io if you use them, like description, image_url etc.
      }

      const apiResults: NewsArticle[] = apiData.results?.map((item: ApiNewsItem) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source_id: item.source_id,
        source: 'api',
      })) || [];

      // --- Fetch from Supabase user_news table ---
      // This call will be automatically filtered by RLS based on the authenticated 'user'
      // Ensure 'id' and 'user_id' (author's ID) are included in the select.
      const { data: dbNews, error: dbError } = await supabase
        .from('user_news')
        .select('id, title, description, link, created_at, author_email, visibility, user_id, country_code')
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

      // Updated interface to match fetched data including id and user_id
      interface UserNewsDbItem {
        id: string; // The UUID from your user_news table
        user_id: string; // The author's UUID
        title: string;
        link?: string;
        created_at: string;
        author_email?: string;
        visibility?: 'public' | 'private';
        description?: string; // Include if you fetch it
        country_code?: string; // Include if you fetch it
      }

      const userNews: NewsArticle[] = (dbNews as UserNewsDbItem[] | null)?.map((item) => ({
        id: item.id, // --- IMPORTANT: Map the ID ---
        user_id: item.user_id, // --- IMPORTANT: Map the user_id (author's ID) ---
        title: item.title,
        link: item.link || '#',
        pubDate: item.created_at, // Using created_at for pubDate for user news
        source_id: item.author_email || 'User Submission',
        source: 'user',
        visibility: item.visibility,
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
      return;
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
      user_id: user.id, // Explicitly set user_id from the authenticated user
    });

    if (insertError) {
      alert('Failed to save to favorites: ' + insertError.message);
    } else {
      alert('Saved to favorites!');
    }
  }

  // --- Conditional Rendering for Login Prompt ---
  if (showLoginPrompt) {
    return (
      <section className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-8 mb-6 space-y-6 flex flex-col items-center justify-center min-h-[350px]">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-2">
            <svg
              className="w-10 h-10 text-blue-600 dark:text-blue-300"
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Access Restricted</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-xs">
            Please log in to search and view news articles.
          </p>
         
        </div>
      </section>
    );
  }

  // --- Main Search UI Rendering ---
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
            key={article.id || article.link || i} // Prefer article.id for user news, then link, then index
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
              {article.source === 'user' && ( // Indicate if it's user-submitted news
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                    User News
                  </span>
              )}
              {article.source === 'user' && article.visibility === 'private' && ( // Indicate if it's private user news
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                    Private
                  </span>
              )}
            </p>
            {/* Save to Favorites button */}
            <button
              onClick={() => saveToSupabase(article)}
              className="mt-3 inline-block px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700 text-white shadow transition-colors">
            ➕ Save to Favorites
            </button>
            {/* Add Invite button for private user news if current user is the author */}
            {article.source === 'user' && article.visibility === 'private' && article.id && article.user_id === user?.id && (
                <button
                    onClick={() => router.push(`/invite-to-news/${article.id}`)} // Link to the new page for inviting users
                    className="ml-2 mt-3 inline-block px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow transition-colors"
                >
                    ✉️ Invite Users
                </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}