import { useEffect, useState } from 'react'
import { fetchDashboardData, fetchDesignCollections } from '../data/mockApi'

function Dashboard() {
  const [stats, setStats] = useState([])
  const [updates, setUpdates] = useState([])
  const [collections, setCollections] = useState([])
  const [selectedCollection, setSelectedCollection] = useState(null)

  useEffect(() => {
    async function loadData() {
      const dashboardData = await fetchDashboardData()
      const designData = await fetchDesignCollections()
      setStats(dashboardData.stats)
      setUpdates(dashboardData.updates)
      setCollections(designData)
      setSelectedCollection(designData[0])
    }

    loadData()
  }, [])

  return (
    <main className="page-content marketing-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Admin dashboard for fashion collections, APIs, and campaigns</h1>
          <p>Monitor your creative system from one place with live-ready data, content updates, and design insights.</p>
        </div>
      </section>

      <section className="feature-grid dashboard-stats-grid">
        {stats.map((item) => (
          <article key={item.label} className="info-card dashboard-card">
            <h2>{item.value}</h2>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="feature-grid dashboard-content-grid">
        <article className="info-card dashboard-card">
          <h2>Latest updates</h2>
          <ul className="strategy-list">
            {updates.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="info-card dashboard-card">
          <h2>Explore designs</h2>
          <div className="collection-grid dashboard-collection-grid">
            {collections.map((item) => (
              <button
                key={item.id}
                type="button"
                className="collection-card"
                onClick={() => setSelectedCollection(item)}
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
        </article>
      </section>

      {selectedCollection && (
        <section className="strategy-panel">
          <div className="strategy-panel-content">
            <span className="eyebrow">Selected design</span>
            <h3>{selectedCollection.title}</h3>
            <p>{selectedCollection.details}</p>
            <div className="strategy-list">
              {selectedCollection.stats.map((stat) => (
                <li key={stat}>{stat}</li>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default Dashboard
