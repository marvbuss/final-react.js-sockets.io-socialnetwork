import { Component } from "react";

export default class uploader extends Component {
    constructor() {
        super();
        this.state = {};
        this.clickHandler = this.clickHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    clickHandler(e) {
        e.preventDefault();
        const fd = new FormData();
        fd.append("file", this.state.file);
        fetch("/upload.json", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then((data) => {
                this.props.parentCallback(data);
            })
            .catch(console.log);
    }

    handleChange({ target }) {
        this.setState(
            {
                [target.name]: target.files[0],
            },
            () => console.log("handleChange update done:", this.state)
        );
    }

    render() {
        return (
            <>
                <div id="modal">
                    <div id="modal-container">
                        <h1>Change Profile Image</h1>
                        <form>
                            <input
                                type="file"
                                name="file"
                                accept="image/*"
                                onChange={this.handleChange}
                            />
                            <button onClick={(e) => this.clickHandler(e)}>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}
