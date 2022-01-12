import { Component } from "react";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: true,
        };
        this.toggleUploader = 
    }

    toggleUploader() {
        this.State({
            this.setState({
                uploaderIsVisible: !this.state.uploaderIsVisible
            })
        })
    }

    render() {
        return (
            <>
                <section>
                    <img
                        src="https://www.pngkey.com/png/detail/321-3219278_blink-182-logo-png.png"
                        alt="logo"
                        id="network-logo"
                    />
                    <h1>This app.js works</h1>
                    <ProfilePic
                        first="Alistair"
                        last="Quinn"
                        imageUrl="https://thumbs.dreamstime.com/b/sumatran-tiger-bamboo-dramatic-stare-42151058.jpg"
                    />
                </section>
                (this.state.uploaderIsVisible && <Uploader />
                );
            </>
        );
    }
}
