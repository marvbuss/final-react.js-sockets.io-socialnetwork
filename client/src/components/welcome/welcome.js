import { BrowserRouter, Route, Link } from "react-router-dom";
import { Registration } from "../registration/registration";
import { Login } from "../login/login";
import { ResetPassword } from "../resetpassword/resetpassword";
import Logo from "../../utils/logo/logo";

export default function Welcome() {
    return (
        <div id="welcome">
            <Logo />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                        <div>
                            <Link to="/login">Click here to Log in!</Link>
                        </div>
                    </Route>
                    <Route path="/login">
                        <Login />
                        <div>
                            <Link to="/"> Click here to Register!</Link>
                        </div>
                    </Route>
                    <Route path="/reset">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
