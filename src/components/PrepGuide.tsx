import { Button } from '@/components/ui/button';

const PrepGuide = () => {
  const downloadPrepGuide = () => {
    // For now, we'll create a simple download link
    // In production, this would be replaced with actual PDF download
    const element = document.getElementById('prep-guide');
    if (element) {
      // Mock PDF download functionality
      alert('PDF download would start here. In production, this connects to your PDF storage.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 text-center">
        <Button onClick={downloadPrepGuide} className="bg-black text-white px-8 py-3">
          📥 Download the Prep Guide
        </Button>
      </div>
      
      <div id="prep-guide" className="bg-white text-black p-8 font-serif">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Look Like a Cover Star</h1>
          <h2 className="text-2xl mb-4">Jeff Honforloco's Ultimate Prep Guide for Editorial Shoots</h2>
          <p className="text-gray-600">www.jeffhonforlocophotos.com • @jeffhonforlocophotos</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What to Expect From Your Shoot</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Moodboard & Creative Direction</li>
            <li>Posing Guidance</li>
            <li>Studio or On-Location Lighting</li>
            <li>Full Retouched Deliverables</li>
          </ul>
          <p className="italic mt-4">"Think of it like a mini fashion campaign — crafted around your personality."</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How to Prepare (Checklist)</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Hydrate the day before</li>
            <li>Sleep 8 hours minimum</li>
            <li>Bring 2–3 versatile outfits</li>
            <li>Arrive with clean face & hair</li>
            <li>Bring comfortable shoes for transitions</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Hair, Makeup & Posing Tips</h2>
          <h3 className="text-xl font-semibold mb-2">Makeup</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Keep it light and natural unless otherwise styled</li>
            <li>Avoid SPF-heavy or oily products</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Hair</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Simple is best. Sleek or messy bun always wins.</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Posing</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Practice 5 go-to poses</li>
            <li>Think elongate, not stiff</li>
            <li>Soften hands and keep chin forward</li>
          </ul>
          <p className="italic mt-4">"Confidence shows more than a perfect pose."</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What Makes the Best Shoot</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Arrive early, not rushed</li>
            <li>Be open to creativity</li>
            <li>Move, flow, and let go of perfection</li>
            <li>Trust Jeff to capture the magic</li>
          </ul>
          <p className="italic mt-4">"My best shots come when you're just being yourself — the real you is the story."</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5 Mistakes to Avoid</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Arriving late</li>
            <li>Bringing wrinkled clothes</li>
            <li>Wearing bold patterns</li>
            <li>Over-accessorizing</li>
            <li>Trying to over-control the session</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Book?</h2>
          <p className="mb-4">
            Book your editorial session now:<br />
            <a href="https://www.jeffhonforlocophotos.com/book" className="text-blue-600 underline">
              https://www.jeffhonforlocophotos.com/book
            </a><br />
            Follow: @jeffhonforlocophotos
          </p>
          <p className="italic">"Let's create timeless visuals together."</p>
        </section>

        <div className="text-center text-sm text-gray-500">
          © 2025 Jeff Honforloco Photography
        </div>
      </div>
    </div>
  );
};

export default PrepGuide;