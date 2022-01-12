import { BrowserRouter, Route, Link } from "react-router-dom";
import { Registration } from "./registration";
import { Login } from "./login";
import { ResetPassword } from "./resetpassword";
import Logo from "./logo";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
            <Logo />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                        <Link to="/login">Click here to Log in!</Link>
                    </Route>
                    <Route path="/login">
                        <Login />
                        <Link to="/">Click here to Register!</Link>
                    </Route>
                    <Route path="/reset">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
