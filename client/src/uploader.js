import { useState } from "react";

export default function Uploader({ toggleFunc, parentCallback }) {
    const [file, setFile] = useState();

    function clickHandler(e) {
        e.preventDefault();
        const fd = new FormData();
        fd.append("file", file);
        fetch("/upload.json", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then((data) => {
                parentCallback(data);
            })
            .catch(console.log);
    }

    function handleChange(e) {
        setFile(e.target.files[0]);
    }

    return (
        <>
            <div id="modal">
                <div id="modal-container">
                    <button type="submit" onClick={toggleFunc} id="closeModal">
                        X
                    </button>
                    <h1>Change Profile Image</h1>
                    <form>
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <button type="submit" onClick={(e) => clickHandler(e)}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
