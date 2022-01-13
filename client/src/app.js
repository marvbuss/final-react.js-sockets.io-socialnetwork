import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.logNamePlusSomeOtherStuffAsWell =
            this.logNamePlusSomeOtherStuffAsWell.bind(this);
    }

    componentDidMount() {
        console.log("App component mounted");
        fetch("/user")
            .then((data) => data.json())
            .then((data) => {
                const { first, last, email, created_at } = data;
                this.setState({ first, last, email, created_at });
            })
            .catch((err) => {
                console.log("err in fetch /user", err);
                this.setState({
                    error: "Something went wrong. Please try again!",
                });
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    logNamePlusSomeOtherStuffAsWell(val) {
        this.setState({
            val,
        });
    }

    render() {
        return (
            <>
                <section className="app-start">
                    <div id="logo-wrapper-app-start">MONOPOLY</div>
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        toggleFunc={this.toggleUploader}
                    />
                </section>
                {this.state.uploaderIsVisible && <Uploader />}
                <button onClick={this.toggleUploader}>
                    Show or hide uploader
                </button>
            </>
        );
    }
}
