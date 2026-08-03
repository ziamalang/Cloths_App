const services = [
  {
    title: 'Launch campaigns',
    text: 'Design product drops, seasonal offers, and promotional landing pages that feel modern and irresistible.',
  },
  {
    title: 'Visual content',
    text: 'Create premium fashion imagery, reels, and social-ready creative for every collection.',
  },
  {
    title: 'E-commerce support',
    text: 'Improve product presentation, messaging, and page flow so shoppers move from inspiration to purchase.',
  },
]

function Services() {
  return (
    <main className="page-content marketing-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Services</span>
          <h1>Fashion marketing services built for standout collections.</h1>
          <p>
            From launch strategy to visual storytelling, we help clothing brands present their products with confidence and clarity.
          </p>
        </div>
        <div className="hero-badge">
          <strong>Perfect for</strong>
          <span>boutiques, clothing labels, and modern fashion startups</span>
        </div>
      </section>

      <section className="feature-grid">
        {services.map((service) => (
          <article key={service.title} className="info-card">
            <h2>{service.title}</h2>
            <p>{service.text}</p>
          </article>
        ))}
      </section>

      <section className="marketing-footer page-actions">
        <div>
          <h2>Ready to scale your next drop?</h2>
          <p>We make it easy to manage every campaign from one polished fashion-first experience.</p>
        </div>
        <button type="button" className="primary-btn">Explore services</button>
      </section>
    </main>
  )
}

export default Services;
