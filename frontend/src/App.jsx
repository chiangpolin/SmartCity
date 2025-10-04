import './App.css'
import Hero from './components/Hero'
import StorySection from './components/StorySection';
import WeekTrafficSection from './components/WeekTrafficSection';
import DayTrafficSection from './components/DayTrafficSection';
import TrafficGridSection from './components/TrafficGridSection';
import MapSection from './components/MapSection'
import DecisionSection from './components/DecisionSection'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Hero />
      <StorySection />
      <WeekTrafficSection />
      <DayTrafficSection />
      <TrafficGridSection />
      <MapSection />
      <DecisionSection />
      <Footer />
    </>
  );
}

export default App
