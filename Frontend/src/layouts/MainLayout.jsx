import {Outlet,Link} from "react-router"


export default function MainLayout(){
    return(
        <>
            <nav>
                <Link to="/">Home</Link>
                {" | "}
                <Link to="/login">Log In</Link>
                {" | "}
                <Link to="/signup">Sign Up</Link>
            </nav>

            <hr />
            <Outlet/>
        </>
    )
}