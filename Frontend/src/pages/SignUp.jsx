import NavBar from "../components/Landing/NavBar/NavBar";
import SignUpUser from "../components/Register/SignUp/SignUp";
import Footer from "../components/Landing/Footer/Footer";
import '../styles/styles.css'

export default function SignUp(){
    return(
         <>
              <NavBar />
              <SignUpUser/>
              <Footer />
            </>
    )
}