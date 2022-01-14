import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.imageUrlCallback = this.imageUrlCallback.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        console.log("App component mounted");
        fetch("/user")
            .then((data) => data.json())
            .then((data) => {
                const { first, last, email, image_url, bio, created_at } = data;
                this.setState({
                    first,
                    last,
                    email,
                    image_url,
                    bio,
                    created_at,
                });
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

    imageUrlCallback(val) {
        this.setState({
            image_url: val,
        });
    }

    updateBio(val) {
        this.setState({
            bio: val,
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
                        imageUrl={this.state.image_url}
                        cssClassName="navbar-avatar"
                        toggleFunc={this.toggleUploader}
                    />
                </section>
                <section className="profile-section">
                    <Profile
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.image_url}
                        toggleFunc={this.toggleUploader}
                        bio={this.state.bio}
                        updateBio={this.updateBio}
                    />
                </section>
                {this.state.uploaderIsVisible && (
                    <Uploader parentCallback={this.imageUrlCallback} />
                )}
            </>
        );
    }
}
