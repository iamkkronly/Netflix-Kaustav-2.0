import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-geist-sans">CloudRay</h1>
        <nav>
          <Link href="/login" legacyBehavior>
            <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              Login with Telegram
            </a>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-32">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-extrabold font-geist-sans leading-tight mb-4">
              CloudRay: The Free, Unlimited Cloud Storage
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Powered by your own Telegram "Saved Messages," offering a secure and limitless home for your files.
            </p>
            <Link href="/login" legacyBehavior>
              <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
                Start Storing Free!
              </a>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-800/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold font-geist-sans">Why CloudRay?</h3>
              <p className="text-gray-400 mt-2">Zero costs, zero limits, and zero compromises on security.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h4 className="text-xl font-bold mb-2">Unlimited Capacity</h4>
                <p className="text-gray-400">Leverage Telegram's generous 2GB per-file limit and store as much as you want.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h4 className="text-xl font-bold mb-2">Zero Cost & Zero Compromise</h4>
                <p className="text-gray-400">A truly free solution that doesn't sacrifice performance or features.</p>
              </div>
              {/* Feature 3 */}
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h4 className="text-xl font-bold mb-2">Secure by Design</h4>
                <p className="text-gray-400">Your files stay on your personal Telegram account, protected by their encryption.</p>
              </div>
              {/* Feature 4 */}
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h4 className="text-xl font-bold mb-2">Integrated Media Streaming</h4>
                <p className="text-gray-400">Stream your videos and audio files directly from the app without downloading.</p>
              </div>
              {/* Feature 5 */}
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <h4 className="text-xl font-bold mb-2">Fast, Instant Search</h4>
                <p className="text-gray-400">Find any file in seconds with our powerful, indexed search.</p>
              </div>
              {/* Feature 6 (Placeholder for visual) */}
              <div className="bg-gray-800 p-6 rounded-lg text-center flex items-center justify-center">
                 <h4 className="text-xl font-bold mb-2">Modern Interface</h4>
                 <p className="text-gray-400">A sleek and intuitive UI for managing your files.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10">
        <div className="container mx-auto px-6 text-center">
           <div className="mb-4">
            <Link href="/login" legacyBehavior>
                <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
                  Start Storing Free! (Login with Telegram)
                </a>
            </Link>
           </div>
          <p className="text-gray-500">&copy; 2025 Kaustav Ray. All Rights Reserved.</p>
          <p className="text-gray-600 text-sm mt-2">CloudRay is an independent project and is not affiliated with Telegram.</p>
        </div>
      </footer>
    </div>
  );
}