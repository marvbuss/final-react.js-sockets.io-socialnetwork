import { Component } from "react";

export default class BioEditor extends Component {
    constructor() {
        super();
        this.state = {
            btnTxt: "",
            showMode: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    toggleEdit() {
        this.setState({
            showMode: !this.state.showMode,
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        fetch("/update/bio.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((data) => data.json())
            .then((data) => {
                console.log("response data from /update/bio.json:", data);
                this.props.updateBio(this.state.bioDraft);
                this.setState({
                    showMode: !this.state.showMode,
                });
            })
            .catch((err) => {
                console.log("err in fetch /update/bio.json", err);
            });
    }

    render() {
        return (
            <>
                <div className="bio">
                    <h2>Your Profile Bio:</h2>
                    {this.state.showMode == false && (
                        <>
                            <p>{this.props.bio}</p>
                            <button onClick={this.toggleEdit}>
                                {this.props.bio ? "edit" : "add"}
                            </button>
                        </>
                    )}
                    {this.state.showMode == true && (
                        <>
                            <textarea
                                name="bioDraft"
                                defaultValue={this.props.bio}
                                onChange={({ target }) =>
                                    this.handleChange({ target })
                                }
                            />
                            <button onClick={this.handleSubmit}>Save</button>
                        </>
                    )}
                </div>
            </>
        );
    }
}
