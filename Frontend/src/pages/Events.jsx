import "../styles/styles.css";
import NavBar from "../components/Landing/NavBar/NavBar";
import EventsPage from "../components/Events/Eventspage/Eventspage";
import Footer from "../components/Landing/Footer/Footer";

export default function Events() {
  return (
    <div className="page_cont">
      <NavBar />
      <EventsPage />
      <Footer />
    </div>
  );
}
