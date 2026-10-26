
import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabase'

function App() {
  const [search, setSearch] = useState('')
  const [selectedCreator, setSelectedCreator] = useState(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return
      if (error) setAuthError('Unable to check your session. Please refresh and try again.')
      setSession(data?.session ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setAuthLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async (event) => {
    event.preventDefault()
    setAuthError('')
    setSigningIn(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    })

    if (error) {
  console.error("Supabase login error:", error.message);
  setAuthError(error.message);
  setSigningIn(false);
  return;
}

    setSigningIn(false)
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) setAuthError('Unable to sign out. Please try again.')
    setSelectedCreator(null)
    setShowContactForm(false)
  }
  const categories = [
    'Photography',
    'Videography',
    'Makeup Artists',
    'Graphic Designers',
    'Musicians',
    'Event Creators',
    
  ]

  const creators = [
    {
      name: 'Ayush Photography',
      category: 'Photographer',
      price: '₹15,000',
      location: 'Hubballi',
      image: '/images/creator-photographer.jpg',
      description:
        'Capturing weddings, portraits, and meaningful moments through creative photography.',
      specialty: 'Wedding and portrait photography',
    },
    {
      name: 'Sachin Visuals',
      category: 'Videographer',
      price: '₹15,000',
      location: 'Dharwad',
      image: '/images/creator-videographer.jpg',
      description:
        'Creating visual stories through cinematic videos and creative filmmaking.',
      specialty: 'Videography and cinematic films',
    },
    {
      name: 'Ameya',
      category: 'Musician & Vocalist',
      price: '₹15,000',
      location: 'Dharwad',
      image: '/images/creator-ameya.jpg',
      description:
        'Bringing events and special occasions to life through music and vocal performances.',
      specialty: 'Live music and vocal performances',
    },
  ]

  const filteredCreators = creators.filter((creator) => {
    const query = search.trim().toLowerCase()

    if (!query) return true

    const searchableText = [
      creator.name,
      creator.category,
      creator.location,
      creator.specialty,
      creator.category === 'Wedding Photographer'
        ? 'photography photographer'
        : '',
      creator.category === 'Videographer'
        ? 'videography filmmaker'
        : '',
      creator.category === 'Musician & Vocalist'
        ? 'musicians musician vocalist singer singing'
        : '',
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(query)
  })

  
const handleCategoryClick = (category) => {
  const categorySearchTerms = {
    Photography: 'photographer',
    Videography: 'videographer',
    'Makeup Artists': 'makeup artist',
    'Graphic Designers': 'graphic designer',
    Musicians: 'musician',
    'Event Creators': 'event creator',
   
  }

  setSearch(categorySearchTerms[category] || category)

  document
    .getElementById('creators')
    ?.scrollIntoView({ behavior: 'smooth' })
}


  const openCreatorProfile = (creator) => {
    setSelectedCreator(creator)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const closeCreatorProfile = () => {
    setSelectedCreator(null)
    setSearch('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (authLoading) {
    return (
      <div className="app auth-loading-screen">
        <p className="eyebrow">TAGX / THE CREATIVE INDEX</p>
        <p>Checking your sign-in…</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="app auth-gate">
        <header className="navbar auth-navbar">
          <a className="brand" href="#home">TAG<span>X</span></a>
          <span className="auth-nav-label">PRIVATE ACCESS</span>
        </header>

        <main className="auth-main">
          <section className="auth-card" aria-labelledby="auth-title">
            <p className="eyebrow">TAGX / MEMBERS AREA</p>
            <h1 id="auth-title">Welcome <span>back.</span></h1>
            <p className="auth-description">Sign in with an account provided by the TAGX administrator.</p>

            <form className="auth-form" onSubmit={handleSignIn}>
              <label htmlFor="tagx-email">Email address</label>
              <input
                id="tagx-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                required
              />

              <label htmlFor="tagx-password">Password</label>
              <input
                id="tagx-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                required
              />

              {authError && <p className="auth-error" role="alert">{authError}</p>}

              <button className="auth-submit" type="submit" disabled={signingIn}>
                {signingIn ? 'Signing in…' : 'Sign in ↗'}
              </button>
            </form>

            <p className="auth-footnote">Access is limited to approved accounts. There is no public sign-up.</p>
          </section>
        </main>

        <footer className="footer auth-footer">
          <p>Connecting creativity with opportunity.</p>
          <span>© 2026 TAGX</span>
        </footer>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="navbar">
        <a
          className="brand"
   href="#home"
          onClick={(event) => {
            event.preventDefault()
            closeCreatorProfile()
          }}
        >
          TAG<span>X</span>
        </a>

        <nav>
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              closeCreatorProfile()
            }}
          >
            Home
          </a>

          <a
            href="#categories"
            onClick={(event) => {
              event.preventDefault()
              setSelectedCreator(null)
              setTimeout(() => {
                document
                  .getElementById('categories')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }, 0)
            }}
          >
            Categories
          </a>

          <a
            href="#creators"
            onClick={(event) => {
              event.preventDefault()
              setSelectedCreator(null)
              setTimeout(() => {
                document
                  .getElementById('creators')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }, 0)
            }}
          >
            Explore
          </a>
        </nav>
        <div className="account-actions">
          <span className="signed-in-label">Signed in</span>
          <button className="sign-out-button" type="button" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      <main>
        {selectedCreator ? (
          <section className="profile-page">
            <button
              className="view-button"
              onClick={closeCreatorProfile}
            >
              ← Back to creators
            </button>

            <div className="profile-layout">
              <div className="profile-image-container">
                <img
                  className="profile-image"
                  src={selectedCreator.image}
                  alt={`${selectedCreator.name} portfolio`}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </div>

              <div className="profile-details">
                <p className="eyebrow">TAGX / CREATOR PROFILE</p>

                <span className="available-label">
                  CREATIVE PROFESSIONAL
                </span>

                <h1>{selectedCreator.name}</h1>

                <p className="profile-category">
                  {selectedCreator.category}
                </p>

                <p className="creator-location">
                  ⌖ {selectedCreator.location}
                </p>

                <p className="profile-description">
                  {selectedCreator.description}
                </p>

                <div className="profile-info-item">
                  <span>Specialty</span>
                  <strong>{selectedCreator.specialty}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Location</span>
                  <strong>{selectedCreator.location}</strong>
                </div>

                <div className="profile-price">
                  <div>
                    <span className="price-label">
                      Starting from
                    </span>
                    <strong>{selectedCreator.price}</strong>
                  </div>
                </div>

                
<button
  className="profile-contact-button"
  onClick={() => setShowContactForm(true)}
>
  Contact creator ↗
</button>


                {showContactForm ? (
  <form
    className="contact-form"
    onSubmit={(event) => {
      event.preventDefault()
      alert(
        `Thank you! Your enquiry for ${selectedCreator.name} has been submitted in this demo.`
      )
      setShowContactForm(false)
    }}
  >
    <h2>Let's work together.</h2>

    <p>
      Send an enquiry to {selectedCreator.name}.
    </p>

    <label htmlFor="contact-name">Your name</label>
    <input
      id="contact-name"
      name="name"
      type="text"
      placeholder="Enter your name"
      required
    />

    <label htmlFor="contact-email">Email address</label>
    <input
      id="contact-email"
      name="email"
      type="email"
      placeholder="you@example.com"
      required
    />

    <label htmlFor="contact-date">
      Event or project date
    </label>
    <input
      id="contact-date"
      name="projectDate"
      type="date"
    />

    <label htmlFor="contact-message">
      Tell us about your project
    </label>
    <textarea
      id="contact-message"
      name="message"
      placeholder="Describe your event, requirements, and budget..."
      rows="4"
      required
    />

    <button
      className="profile-contact-button"
      type="submit"
    >
      Submit enquiry ↗
    </button>

    <button
      className="contact-cancel-button"
      type="button"
      onClick={() => setShowContactForm(false)}
    >
      Cancel
    </button>
  </form>
) : (
  <p className="profile-note">
    Booking and direct messaging will be added in a later phase.
  </p>
)}
```
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="hero" id="home">
              <div className="hero-layout">
                <div className="hero-copy">
                  <p className="eyebrow">
                    TAGX / THE CREATIVE INDEX
                  </p>

                  <h1>
                    Good work
                    <br />
                    finds its <span>people.</span>
                  </h1>

                  <p className="hero-description">
                    Discover exceptional photographers, filmmakers,
                    artists and creative professionals for your next
                    big moment.
                  </p>

                  <p className="search-label">
                    Find your next collaborator
                  </p>

                  <form
                    className="search-box"
                    onSubmit={(event) => {
                      event.preventDefault()
                      document
                        .getElementById('creators')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <span aria-hidden="true">⌕</span>

                    <input
                      type="search"
                      placeholder="Search photographers, musicians..."
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      aria-label="Search creators"
                    />

                    <button type="submit">Search ↗</button>
                  </form>

                  <p className="trust-line">
                    Independent talent. Distinct points of view.
                  </p>
                </div>

                <div
                  className="hero-art"
                  aria-label="Creative work showcase"
                >
                  <div className="hero-image hero-image-one">
                    <img
                      src="/images/hero-portrait.jpg"
                      alt="Portrait photography"
                    />
                    <span>01 / Portraits</span>
                  </div>

                  <div className="hero-image hero-image-two">
                    <img
                      src="/images/hero-filmmaker.jpg"
                      alt="Creative photography outdoors"
                    />
                    <span>02 / Stories</span>
                  </div>

                  <p className="hero-art-note">
                    Made by creatives.
                    <br />
                    Remembered by everyone.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="categories-section"
              id="categories"
            >
              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    EXPLORE POSSIBILITIES
                  </p>
                  <h2>Find your kind of creative</h2>
                </div>
              </div>

              <div className="category-list">
                {categories.map((category) => (
                  <button
                    className="category-chip"
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                    <span>↗</span>
                  </button>
                ))}
              </div>
            </section>

            <section
              className="creators-section"
              id="creators"
            >
              <div className="section-heading">
                <div>
                  <p className="eyebrow">HANDPICKED TALENT</p>
                  <h2>Meet the creators</h2>
                  <p className="section-description">
                    Explore creative professionals for your next
                    project.
                  </p>
                </div>

                <span className="creator-count">
                  {filteredCreators.length}{' '}
                  {filteredCreators.length === 1
                    ? 'creator'
                    : 'creators'}
                </span>
              </div>

              <div className="creator-grid">
                {filteredCreators.map((creator) => (
                  <article
                    className="creator-card"
                    key={creator.name}
                  >
                    <div className="creator-art">
                      <img
                        className="creator-image"
                        src={creator.image}
                        alt={`${creator.name} portfolio`}
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                        }}
                      />

                      <span className="available-label">
                        CREATIVE PROFESSIONAL
                      </span>
                    </div>

                    <div className="creator-info">
                      <p className="creator-category">
                        {creator.category}
                      </p>

                      <h3>{creator.name}</h3>

                      <p className="creator-location">
                        ⌖ {creator.location}
                      </p>

                      <div className="creator-footer">
                        <div>
                          <span className="price-label">
                            Starting from
                          </span>
                          <strong>{creator.price}</strong>
                        </div>

                        <button
                          className="view-button"
                          onClick={() =>
                            openCreatorProfile(creator)
                          }
                        >
                          View profile ↗
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

{filteredCreators.length === 0 && (
  <div className="empty-message">
    <h3>No creators found</h3>

    <p>
      We couldn't find a match for "{search}". Try a different
      keyword or clear your search.
    </p>

    <button
      className="view-button"
      onClick={() => setSearch('')}
    >
      Clear search ↗
    </button>
  </div>
)}

              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault()
            closeCreatorProfile()
          }}
        >
          TAG<span>X</span>
        </a>

        <p>Connecting creativity with opportunity.</p>

        <span>© 2026 TAGX</span>
      </footer>
    </div>
  )
}

export default App
