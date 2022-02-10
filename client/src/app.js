import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { OtherProfile } from "./otherprofile";
import { FindPeople } from "./findpeople";
import FriendsAndWannabees from "./friends-and-wannabees";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Chat from "./chat";

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
                <BrowserRouter>
                    <section className="app-start">
                        <div id="logo-wrapper-app-start">ANKER</div>
                        <Link to="/">Profile</Link>
                        <Link to="/chat">Chat</Link>
                        <Link to="/friends-and-wannabees">Friends</Link>
                        <Link to="/users">Find people</Link>
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.image_url}
                            cssClassName="navbar-avatar"
                            toggleFunc={this.toggleUploader}
                        />
                    </section>
                    <Route exact path="/">
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
                    </Route>
                    <Route path="/friends-and-wannabees">
                        <FriendsAndWannabees />
                    </Route>
                    <Route path="/users">
                        <FindPeople userId={this.state.id} />
                    </Route>
                    <Route path="/user/:id">
                        <OtherProfile />
                    </Route>
                    <Route path="/chat">
                        <Chat />
                    </Route>
                    {this.state.uploaderIsVisible && (
                        <Uploader parentCallback={this.imageUrlCallback} />
                    )}
                </BrowserRouter>
            </>
        );
    }
}
