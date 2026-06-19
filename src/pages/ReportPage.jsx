import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TeamSection from '../components/TeamSection'
import StatsSection from '../components/StatsSection'
import Timeline from '../components/Timeline'
import ChallengesGallery from '../components/ChallengesGallery'
import Recommendations from '../components/Recommendations'
import Conclusion from '../components/Conclusion'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ScrollProgress from '../components/ScrollProgress'
import ReportActions from '../components/ReportActions'
import { useReveal } from '../hooks/useReveal'
import { useCms } from '../store/CmsContext'

export default function ReportPage() {
  const { slug } = useParams()
  const { years, displayData, displayYear, loading, error, setViewYear } = useCms()

  // مزامنة السنة المعروضة مع الـslug في الرابط (وإلا النشطة)
  useEffect(() => {
    if (!slug) {
      setViewYear(null)
      return
    }
    const key =
      Object.keys(years).find((k) => (years[k].slug || k) === slug) ||
      (years[slug] ? slug : null)
    setViewYear(key)
  }, [slug, years, setViewYear])

  useReveal()

  if (loading) return <Loader />
  if (error || !displayData) return <Loader error={error || 'لا توجد بيانات'} />

  return (
    <div key={displayYear}>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <TeamSection />
        <StatsSection />
        <Timeline />
        <ChallengesGallery />
        <Recommendations />
        <Conclusion />
      </main>
      <Footer />
      <ReportActions />
    </div>
  )
}
