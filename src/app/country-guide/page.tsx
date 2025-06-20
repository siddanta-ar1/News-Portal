'use client';

const countries = [
  { name: 'Nepal', code: 'np', flag: '🇳🇵' },
  { name: 'India', code: 'in', flag: '🇮🇳' },
  { name: 'United States', code: 'us', flag: '🇺🇸' },
  { name: 'Canada', code: 'ca', flag: '🇨🇦' },
  { name: 'Germany', code: 'de', flag: '🇩🇪' },
  { name: 'France', code: 'fr', flag: '🇫🇷' },
  { name: 'Japan', code: 'jp', flag: '🇯🇵' },
  { name: 'China', code: 'cn', flag: '🇨🇳' },
  { name: 'Australia', code: 'au', flag: '🇦🇺' },
  { name: 'United Kingdom', code: 'gb', flag: '🇬🇧' },
  { name: 'Russia', code: 'ru', flag: '🇷🇺' },
  { name: 'Brazil', code: 'br', flag: '🇧🇷' },
  { name: 'South Korea', code: 'kr', flag: '🇰🇷' },
  { name: 'Italy', code: 'it', flag: '🇮🇹' },
  { name: 'Spain', code: 'es', flag: '🇪🇸' },
  { name: 'Mexico', code: 'mx', flag: '🇲🇽' },
  { name: 'Indonesia', code: 'id', flag: '🇮🇩' },
  { name: 'Pakistan', code: 'pk', flag: '🇵🇰' },
  { name: 'Bangladesh', code: 'bd', flag: '🇧🇩' },
  { name: 'Turkey', code: 'tr', flag: '🇹🇷' },
  { name: 'Saudi Arabia', code: 'sa', flag: '🇸🇦' },
  { name: 'UAE', code: 'ae', flag: '🇦🇪' },
  { name: 'South Africa', code: 'za', flag: '🇿🇦' },
  { name: 'Nigeria', code: 'ng', flag: '🇳🇬' },
  { name: 'Argentina', code: 'ar', flag: '🇦🇷' },
  { name: 'Malaysia', code: 'my', flag: '🇲🇾' },
  { name: 'Philippines', code: 'ph', flag: '🇵🇭' },
  { name: 'Thailand', code: 'th', flag: '🇹🇭' },
];

export default function CountryGuidePage() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 align-middle">🌐 Supported Country Codes</h1>
      <p className="mb-4 text-gray-600">Use the following country codes to search for news by region.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {countries.map((country) => (
          <div
            key={country.code}
            className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition"
          >
            <div className="text-4xl text-red-500 mb-2">{country.flag}</div>
            <h2 className="text-xl font-semibold">{country.name}</h2>
            <p className="text-sm text-gray-500">Code: <code className="bg-gray-100 dark:bg-black px-1 py-0.5 rounded">{country.code}</code></p>
          </div>
        ))}
      </div>
    </main>
  );
}
