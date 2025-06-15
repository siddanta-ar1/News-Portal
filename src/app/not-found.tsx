import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="mt-2 text-gray-600">Sorry, we could not find the page you are looking for.</p>
       <button className="mt-6 text-blue-600 hover:underline hover:text-blue-800">
        <Link href="/" className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Go back home
        </Link>
       </button>
      </div>
    </div>
  )
}
