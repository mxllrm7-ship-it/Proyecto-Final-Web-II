import '../styles/styles.css'
import NavBar from '../components/Landing/NavBar/NavBar'
import ImageCarousel from '../components/Landing/Carrousel/Carrousel'
import Events from '../components/Landing/EventList/Events'
import Footer from '../components/Landing/Footer/Footer'

export default function Home(){
    return(
        <>
    <NavBar />
      <ImageCarousel/>
      <Events/>
      <Footer/>
    </>
    )
}