import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            name: "Alistair",
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.logNamePlusSomeOtherStuffAsWell =
            this.logNamePlusSomeOtherStuffAsWell.bind(this);
    }

    componentDidMount() {
        console.log("App component mounted");
        // Make fetch request to get data for currently logged in user
        // and store this data in the component state
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    logNamePlusSomeOtherStuffAsWell(val) {
        console.log(this.state.name + val);
    }

    render() {
        return (
            <>
                <section className="cool-styles">
                    <img
                        src="https://alsimageuniverse.s3.amazonaws.com/jhHC3lw0fMcoDXJFxNpnk_6iFWpR92aG.png"
                        alt="social network logo"
                        id="homepage-logo"
                    />
                    <ProfilePic
                        first={this.state.first}
                        last="Quinn"
                        imageUrl="https://i0.wp.com/mothersniche.com/wp-content/uploads/2013/03/medium_104314753.jpg"
                        loggerFunc={this.logNamePlusSomeOtherStuffAsWell}
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
