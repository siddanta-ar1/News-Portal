'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';

const countries = [
  { name: 'Nepal', code: 'np' },
  { name: 'India', code: 'in' },
  { name: 'USA', code: 'us' },
  { name: 'Canada', code: 'ca' },
  { name: 'Germany', code: 'de' },
  { name: 'France', code: 'fr' },
  { name: 'Japan', code: 'jp' },
  { name: 'China', code: 'cn' },
  { name: 'Australia', code: 'au' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'Russia', code: 'ru' },
  { name: 'Brazil', code: 'br' },
  { name: 'South Korea', code: 'kr' },
  { name: 'Italy', code: 'it'},
  { name: 'Spain', code: 'es' },
  { name: 'Mexico', code: 'mx'},
  { name: 'Indonesia', code: 'id' },
  { name: 'Pakistan', code: 'pk'},
  { name: 'Bangladesh', code: 'bd'},
  { name: 'Turkey', code: 'tr' },
  { name: 'Saudi Arabia', code: 'sa' },
  { name: 'UAE', code: 'ae' },
  { name: 'South Africa', code: 'za' },
  { name: 'Nigeria', code: 'ng'},
  { name: 'Argentina', code: 'ar' },
  { name: 'Malaysia', code: 'my' },
  { name: 'Philippines', code: 'ph' },
  { name: 'Thailand', code: 'th' },
];

export default function SubmitNewsPage() {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return alert('Please log in first.');

    const { error } = await supabase.from('user_news').insert({
      user_id: user.id,
      author_email: user.email,
      title,
      link,
      description,
      country_code: countryCode,
    });

    if (error) {
      console.error(error);
      alert('Failed to submit news.');
    } else {
      alert('News submitted!');
      router.push('/');
    }
  };

  return (
    <main className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
  <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
    📝 Submit News by Country
  </h1>

  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        News Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter news headline"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        News Link
      </label>
      <input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Optional link to source"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write a short summary..."
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Select Country <span className="text-red-500">*</span>
      </label>
      <select
        required
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">-- Choose a country --</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
    >
      📤 Submit News
    </button>
  </form>
</main>

  );
}
