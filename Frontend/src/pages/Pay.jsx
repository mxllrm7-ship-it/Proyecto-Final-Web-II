import "../styles/styles.css";
import NavBar from "../components/Landing/NavBar/NavBar";
import EventDetail from "../components/Events/Eventdetail/Eventdetail"
import Footer from "../components/Landing/Footer/Footer";

export default function EventPay() {
  return (
    <>
      <NavBar />
      <EventDetail/>
      <Footer />
    </>
  );
}
