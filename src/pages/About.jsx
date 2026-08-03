const values = [
  {
    title: 'Fashion-first thinking',
    text: 'We design with the customer journey in mind, from discovery to the final outfit choice.',
  },
  {
    title: 'Modern brand presence',
    text: 'We blend visual storytelling, digital campaigns, and product focus to make clothing brands feel premium.',
  },
  {
    title: 'Scalable creativity',
    text: 'Whether it is one launch or a full seasonal calendar, every campaign is built to grow with your brand.',
  },
]

function About() {
  return (
    <main className="page-content marketing-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">About Zia Cloths</span>
          <h1>Helping clothing brands look unforgettable online and in store.</h1>
          <p>
            We shape fashion marketing that feels polished, aspirational, and instantly recognizable. From launch pages to collection storytelling, every detail is crafted to support your next big moment.
          </p>
        </div>
        <div className="hero-badge">
          <strong>Modern fashion focus</strong>
          <span>Built for labels, boutiques, and brands that want elevated presence.</span>
        </div>
      </section>

      <section className="slider-section about-slider">
        <div className="section-header">
          <span className="eyebrow">Fashion story motion</span>
          <h2>From concept to campaign, every visual is shaped to attract and convert.</h2>
        </div>
        <div className="slider-card">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80" alt="Fashion brand story" />
          <div className="slider-overlay">
            <span className="promo-pill">Luxury brand presence</span>
            <h3>Premium imagery and polished storytelling for modern clothing brands.</h3>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        {values.map((value) => (
          <article key={value.title} className="info-card">
            <h2>{value.title}</h2>
            <p>{value.text}</p>
          </article>
        ))}
      </section>

      <section className="marketing-footer page-actions">
        <div>
          <h2>Ready to build a stronger fashion identity?</h2>
          <p>Let your collections stand out with polished visuals, sharper messaging, and shopper-focused experience.</p>
        </div>
        <button type="button" className="primary-btn">Learn more</button>
      </section>
    </main>
  )
}

export default About;
