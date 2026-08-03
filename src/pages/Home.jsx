import { useEffect, useState } from 'react'
import { fetchDesignCollections } from '../data/mockApi'

const collections = [
  {
    title: 'Monsoon Luxe',
    tag: 'New drop',
    description: 'Layered tailoring, rich neutrals, and easy elegance for cool evenings.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    caption: 'Soft glamour for evening layering',
  },
  {
    title: 'Street Edit',
    tag: 'Editorial',
    description: 'Bold silhouettes and statement textures styled for city-ready confidence.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    caption: 'Confident cuts with premium attitude',
  },
  {
    title: 'Runway Glow',
    tag: 'Limited',
    description: 'Evening wear designed for glowing launches, special events, and premium first impressions.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    caption: 'Statement pieces for standout moments',
  },
  {
    title: 'Studio Muse',
    tag: 'Fresh arrival',
    description: 'Creative wardrobe essentials made to stand out in the spotlight.',
    image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80',
    caption: 'Modern polish with elevated texture',
  },
]

const storyPoints = [
  {
    title: 'Premium storytelling',
    text: 'Every collection receives polished product stories, moodboards, and launch-ready visuals.',
  },
  {
    title: 'AI-inspired visuals',
    text: 'Create eye-catching campaign imagery that feels futuristic, cinematic, and instantly shareable.',
  },
  {
    title: 'Conversion-first design',
    text: 'From hero sections to product cards, every touchpoint is built to guide shoppers forward.',
  },
]

const testimonials = [
  {
    name: 'Ayesha Malik',
    role: 'Boutique owner',
    quote: 'The visuals made our new drop feel luxury-level from day one.',
  },
  {
    name: 'Hassan R.',
    role: 'Fashion startup founder',
    quote: 'Our campaign looked premium, modern, and instantly more attractive online.',
  },
  {
    name: 'Sara Khan',
    role: 'Stylist',
    quote: 'The story behind every outfit now feels stronger and more memorable.',
  },
]

const products = [
  {
    name: 'Velvet Evening Set',
    price: 'PKR 18,500',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Minimal Street Jacket',
    price: 'PKR 12,900',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Luna Signature Dress',
    price: 'PKR 16,200',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
  },
]

const extraCollections = [
  {
    title: 'Soft Atelier',
    tag: 'Editorial',
    description: 'A refined capsule full of soft layers, elevated minimalism, and premium storytelling.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    caption: 'Polished looks for modern brand storytelling',
  },
  {
    title: 'Launch Edit',
    tag: 'Campaign',
    description: 'Fresh silhouettes and bold visuals crafted for launch-day impact and social-first campaigns.',
    image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80',
    caption: 'Designed for high-impact seasonal drops',
  },
]

function Home() {
  const slides = [
    {
      image: collections[0].image,
      title: 'Monsoon Luxe',
      text: 'Soft neutrals, layered tailoring, and premium evening polish in one refined story.',
      accent: 'Neutral tailoring',
    },
    {
      image: collections[1].image,
      title: 'Street Edit',
      text: 'Bold cuts and rich textures styled with the same fashion-forward color story.',
      accent: 'Deep contrast',
    },
    {
      image: collections[2].image,
      title: 'Runway Glow',
      text: 'Statement pieces with a warm palette designed for elevated clothing campaigns.',
      accent: 'Warm statement',
    },
  ]

  const [activeSlide, setActiveSlide] = useState(0)
  const [showMoreCollections, setShowMoreCollections] = useState(false)
  const [showStrategyPanel, setShowStrategyPanel] = useState(false)
  const [designCollections, setDesignCollections] = useState([])
  const [selectedDesign, setSelectedDesign] = useState(null)

  useEffect(() => {
    async function loadCollections() {
      const data = await fetchDesignCollections()
      setDesignCollections(data)
      setSelectedDesign(data[0])
    }

    loadCollections()
  }, [])

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const handleExploreCollections = () => {
    setShowMoreCollections(true)
    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleBookStrategyCall = () => {
    setShowStrategyPanel(true)
    document.getElementById('strategy-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="marketing-home">
      <section className="marketing-hero">
        <div className="hero-copy">
          <span className="eyebrow">AI-style clothing marketing</span>
          <h1>Turn every outfit into a story customers want to wear.</h1>
          <p>
            Launch seasonal drops, shape your visual identity, and turn casual browsing into confident buying with a premium fashion experience.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-btn" onClick={handleExploreCollections}>Explore collections</button>
            <a className="secondary-link" href="#collections">View featured looks</a>
          </div>

          <div className="hero-highlights">
            <div>
              <strong>3x faster</strong>
              <span>Launch campaigns with ready-to-use fashion content.</span>
            </div>
            <div>
              <strong>Trend-led</strong>
              <span>Keep your audience engaged with fresh seasonal storytelling.</span>
            </div>
            <div>
              <strong>Shop-ready</strong>
              <span>Guide customers from discovery to checkout with clarity.</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
              alt="Fashion campaign portrait"
            />
            <div className="visual-tag">New season campaign</div>
          </div>
          <div className="hero-mini-cards">
            <div className="mini-card">
              <strong>Signature style</strong>
              <span>Curated outfits designed for bold first impressions and daily confidence.</span>
            </div>
            <div className="mini-card highlighted">
              <strong>Premium reach</strong>
              <span>Build a fashionable brand story that looks elevated on every screen.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="slider-section">
        <div className="section-header">
          <span className="eyebrow">Animated fashion slider</span>
          <h2>Elegant motion, rich visuals, and season-ready storytelling.</h2>
        </div>
        <div className="slider-card">
          <img src={slides[activeSlide].image} alt={slides[activeSlide].title} />
          <div className="slider-overlay">
            <span className="promo-pill">New campaign motion</span>
            <span className="slider-accent">{slides[activeSlide].accent}</span>
            <h3>{slides[activeSlide].title}</h3>
            <p>{slides[activeSlide].text}</p>
          </div>
          <div className="slider-controls">
            <button type="button" className="slider-btn" onClick={prevSlide} aria-label="Previous slide">←</button>
            <button type="button" className="slider-btn" onClick={nextSlide} aria-label="Next slide">→</button>
          </div>
        </div>
      </section>

      <section className="collection-section" id="collections">
        <div className="section-header">
          <span className="eyebrow">Featured looks</span>
          <h2>Fashion collections crafted to feel bold, modern, and effortless.</h2>
          <p>Showcase your best pieces with imagery and messaging that makes people stop, look, and shop.</p>
        </div>

        <div className="collection-grid">
          {collections.map((item) => (
            <article key={item.title} className="collection-card">
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="collection-hover">
                <span className="card-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <strong>{item.caption}</strong>
              </div>
              <div className="collection-body">
                <span className="card-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="collection-grid">
          {designCollections.map((item) => (
            <button
              key={item.id}
              type="button"
              className="collection-card"
              onClick={() => setSelectedDesign(item)}
              style={{ textAlign: 'left', padding: 0, border: 'none', cursor: 'pointer' }}
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="collection-body">
                <span className="card-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </button>
          ))}
        </div>

        {selectedDesign && (
          <div className="strategy-panel">
            <div className="strategy-panel-content">
              <span className="eyebrow">More explore designs</span>
              <h3>{selectedDesign.title}</h3>
              <p>{selectedDesign.details}</p>
              <div className="strategy-list">
                {selectedDesign.stats.map((stat) => (
                  <li key={stat}>{stat}</li>
                ))}
              </div>
            </div>
          </div>
        )}

        {showMoreCollections && (
          <div className="expanded-collections">
            <div className="section-header">
              <span className="eyebrow">More looks</span>
              <h2>Additional fashion stories for larger campaigns and seasonal launches.</h2>
            </div>
            <div className="collection-grid">
              {extraCollections.map((item) => (
                <article key={item.title} className="collection-card">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="collection-hover">
                    <span className="card-tag">{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <strong>{item.caption}</strong>
                  </div>
                  <div className="collection-body">
                    <span className="card-tag">{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="feature-strip">
        {storyPoints.map((point) => (
          <article key={point.title} className="feature-card">
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </article>
        ))}
      </section>

      <section className="product-showcase">
        <div className="section-header">
          <span className="eyebrow">Product showcase</span>
          <h2>Designed to spotlight your best-selling clothing pieces.</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.name} className="product-card">
              <img src={product.image} alt={product.name} loading="lazy" />
              <div className="product-body">
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="video-banner">
        <div>
          <span className="eyebrow">Video banner</span>
          <h2>Fashion ads that feel cinematic, premium, and instantly shareable.</h2>
          <p>Create short promotional videos that attract attention and build excitement around every launch.</p>
        </div>
        <div className="video-frame">
          <div className="video-placeholder">AI Fashion Ad Preview</div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="section-header">
          <span className="eyebrow">Testimonials</span>
          <h2>What fashion brands say about the experience.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial-card">
              <p>“{item.quote}”</p>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-footer">
        <div>
          <h2>Ready to dress your brand in a stronger story?</h2>
          <p>Bring polished fashion visuals, sharper messaging, and engaging product pages to your next campaign. Let every collection feel premium, modern, and easy to fall in love with.</p>
        </div>
        <div className="footer-actions">
          <button type="button" className="primary-btn" onClick={handleBookStrategyCall}>Book a strategy call</button>
          <span className="footer-note">Premium launches • fashion ads • AI creative support</span>
        </div>
      </section>

      {showStrategyPanel && (
        <section id="strategy-panel" className="strategy-panel">
          <div className="strategy-panel-content">
            <span className="eyebrow">Related design</span>
            <h3>Full-stack fashion website experience</h3>
            <p>We combine elegant design, a flexible frontend, and a reliable backend to build memorable brand websites with admin tools for managing collections, campaigns, and content.</p>
            <ul className="strategy-list">
              <li>Luxury UI/UX for fashion brands and storefronts</li>
              <li>Fast backend APIs for products, campaigns, and users</li>
              <li>Admin dashboards for content, launches, and performance</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}

export default Home;
