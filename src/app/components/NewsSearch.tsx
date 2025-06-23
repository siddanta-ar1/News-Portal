'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source_id: string;
  source: 'api' | 'user';
  visibility?: 'public' | 'private';
  image_url?: string;
}

export default function NewsSearch() {
  const [country, setCountry] = useState('us');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<null | { email?: string }>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function fetchNews(countryCode: string) {
    setLoading(true);
    setError(null);

    try {
      const { data: session } = await supabase.auth.getUser();
      const userEmail = session?.user?.email;

      const { data: dbNews, error: dbError } = await supabase
        .from('user_news')
        .select('*')
        .eq('country_code', countryCode)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      const { data: inviteData } = await supabase
        .from('invites')
        .select('inviter_id')
        .eq('invitee_email', userEmail);

      const inviterIds = inviteData?.map(i => i.inviter_id) || [];

      interface UserNews {
        title: string;
        link?: string;
        created_at: string;
        author_email?: string;
        user_id: string;
        visibility: 'public' | 'private';
        country_code: string;
        image_url?: string;
      }

      const filtered = (dbNews || []).filter((news: UserNews) => {
        return (
          news.visibility === 'public' ||
          (news.visibility === 'private' && inviterIds.includes(news.user_id))
        );
      });

      const userNews: NewsArticle[] = filtered.map((item) => ({
        title: item.title,
        link: item.link || '#',
        pubDate: item.created_at,
        source_id: item.author_email || 'User Submission',
        source: 'user',
        visibility: item.visibility,
        image_url: item.image_url || undefined,
      }));

      const res = await fetch(
        `https://newsdata.io/api/1/latest?apikey=pub_b5c84fc50e2e44fda7fb187b40740cd9&q=world news&country=${countryCode}`
      );
      const data = await res.json();

      interface ApiNewsItem {
        title: string;
        link: string;
        pubDate: string;
        source_id: string;
        image_url?: string;
      }

      const apiResults: NewsArticle[] = data.results?.map((item: ApiNewsItem) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source_id: item.source_id,
        source: 'api',
        image_url: item.image_url,
      })) || [];

      setNews([...userNews, ...apiResults]);

      if (userNews.length === 0 && apiResults.length === 0) {
        setError('No news found for this country.');
      }
    } catch (err) {
      setError('Error fetching news: ' + (err as Error).message);
      setNews([]);
    }

    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert('Please log in to search news.');
      return;
    }
    if (country.trim()) {
      fetchNews(country.trim().toLowerCase());
    }
  }

  async function saveToSupabase(article: NewsArticle) {
    if (!user) {
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
          disabled={!user}
          className={`flex-grow px-4 py-2 rounded-md border ${
            !user
              ? 'border-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
          } text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          type="submit"
          disabled={loading || !user}
          className={`px-5 py-2 rounded-md ${
            !user
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } disabled:bg-blue-400 text-white text-sm font-medium transition-all shadow`}
        >
          {loading ? '🔄 Loading...' : '🔍 Search'}
        </button>
      </form>

      {!user && (
        <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mt-2">
          <svg
            className="w-5 h-5 text-yellow-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
          </svg>
          <span className="text-red-600 text-sm font-medium">
            Please <span className="font-semibold">log in</span> to search news.
          </span>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <ul className="space-y-4">
        {news.map((article, i) => (
          <li
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800"
          >
            {article.image_url && (
              <div className="relative w-full h-52 mb-3 rounded overflow-hidden">
                <Image
                  src={article.image_url}
                  alt="News Image"
                  width={700}
                  height={300}
                  className="object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/fallback.jpg';
                  }}
                />
              </div>
            )}

            <Link
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-blue-700 dark:text-blue-400 hover:underline"
            >
              {article.title}
            </Link>

            <div className="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{article.source_id}</span>
              <span>{new Date(article.pubDate).toLocaleDateString()}</span>
            </div>

            {article.source === 'user' && (
              <span
                className={`inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs rounded-full font-semibold shadow-sm
                  ${article.visibility === 'private'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-green-100 text-green-800 border border-green-200'
                  }`}
              >
                {article.visibility === 'private' ? (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17a2 2 0 002-2v-2a2 2 0 00-2-2 2 2 0 00-2 2v2a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8V7a5 5 0 00-10 0v1" />
                      <rect width="20" height="12" x="2" y="8" rx="2" />
                    </svg>
                    Private
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2v20" />
                    </svg>
                    Public
                  </>
                )}
              </span>
            )}

            <button
              onClick={() => saveToSupabase(article)}
              disabled={!user}
              className={`mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg
                transition-all duration-150 shadow focus:outline-none focus:ring-2 focus:ring-offset-2
                ${user
                  ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white focus:ring-green-400'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              title={user ? 'Save this article to your favorites' : 'Log in to save articles'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Save to Favorites
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
