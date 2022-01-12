import { Component } from "react";
import { Link } from "react-router-dom";

export class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 1,
        };
        // to not cause cannot read setState of undefined errors, you need to bind the value of "this"
        this.handleChange = this.handleChange.bind(this);
        this.handleResetSubmit = this.handleResetSubmit.bind(this);
        this.handleResetConfirm = this.handleResetConfirm.bind(this);
    }

    renderStage() {
        if (this.state.stage === 1) {
            return (
                <>
                    <h2>
                        Please enter the email address with which you registered
                    </h2>
                    <form>
                        <input
                            name="email"
                            placeholder="your@email.com"
                            type="email"
                            onChange={this.handleChange}
                        />
                        <button onClick={this.handleResetSubmit}>Reset</button>
                    </form>
                </>
            );
        } else if (this.state.stage === 2) {
            return (
                <>
                    <h2>Please enter the code you received</h2>
                    <form>
                        <input
                            name="resetCode"
                            placeholder="123456"
                            type="number"
                            onChange={this.handleChange}
                        />
                        <input
                            name="password"
                            placeholder="New Password"
                            type="number"
                            onChange={this.handleChange}
                        />
                        <button onClick={this.handleResetConfirm}>
                            Confirm
                        </button>
                    </form>
                </>
            );
        } else if (this.state.stage === 3) {
            return (
                <>
                    <h1>Success</h1>
                    <Link to="/login">Click here to Log in!</Link>
                </>
            );
        }
    }

    componentDidMount() {
        console.log("ResetPassword just mounted");
        console.log(this.state);
    }

    handleChange({ target }) {
        console.log("input value changed :D");
        console.log("value typed:", target.value);
        console.log("name of target", target.name);
        // to update state we use this.setState and pass to it an object with our state changes
        this.setState(
            {
                [target.name]: target.value,
            },
            () => console.log("handleChange update done:", this.state)
        );
    }

    handleResetSubmit(e) {
        e.preventDefault();
        console.log("user wants to submit their details", this.state);
        // we now want to send over our user's data to the server
        fetch("/password/reset/start.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(
                    "response data from /password/reset/start.json:",
                    data
                );
                if (data.success == false) {
                    this.setState({
                        error: "Something went wrong. Please try again!",
                    });
                } else {
                    this.setState({ stage: 2 });
                }
            })
            .catch((err) => {
                console.log("err in fetch /password/reset/start.json", err);
                this.setState({
                    error: "Something went wrong. Please try again!",
                });
            });
    }

    handleResetConfirm(e) {
        e.preventDefault();
        console.log("user wants to submit their details", this.state);
        // we now want to send over our user's data to the server
        fetch("/password/reset/confirm.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(
                    "response data from /password/reset/confirm.json:",
                    data
                );
                if (data.success == false) {
                    this.setState({
                        error: "Something went wrong. Please try again!",
                    });
                } else {
                    this.setState({ stage: 3 });
                }
            })
            .catch((err) => {
                console.log("err in fetch /password/reset/confirm.json", err);
                this.setState({
                    error: "Something went wrong. Please try again!",
                });
            });
    }

    render() {
        return (
            <>
                <h1>Reset Password</h1>
                {this.state.error && (
                    <h2 style={{ color: "red" }}>{this.state.error}</h2>
                )}
                {this.renderStage()}
            </>
        );
    }
}
