import React, { useState } from "react";
import { useParams } from "react-router-dom";

function ChallengesForm() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [link, setLink] = useState("");
    const [inputType, setInputType] = useState("file");
    const [error, setError] = useState("");
    const [video_id, setVideoId] = useState(id);

    const apiURL = "http://localhost:3000";

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setType(selectedFile.type);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "title") setTitle(value);
        if (name === "description") setDescription(value);
        if (name === "link_url") setLink(value);
    };

    const handleSelectChange = (e) => {
        const { value } = e.target;
        setInputType(value);
        if (value === "file") {
            setLink("");
            setType("");
        } else {
            setFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || (!file && !link)) {
            setError("Title, Type, and File/Link are required.");
            return;
        }

        try {
            const formData = new FormData();
            formData.set("title", title);
            formData.set("type", inputType === "file" ? "file" : "link");
            formData.set("description", description);
            formData.set("videoID", video_id);

            if (inputType === "file") {
                formData.set("file_url", file);
            } else {
                formData.set("file_url", link);
            }

            const response = await fetch(`${apiURL}/challenge/create`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                const createdId = responseData.data.id;
                console.log("Created Challenge ID:", createdId);
                window.location.reload();
            } else {
                setError("Error creating material.");
            }
        } catch (error) {
            setError("Error creating material.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <div>
                Title:
                <input
                    id="title"
                    name="title"
                    value={title}
                    onChange={handleInputChange}
                    className="input-field"
                />
            </div>
            <div>
                Description:
                <input
                    id="description"
                    name="description"
                    value={description}
                    onChange={handleInputChange}
                    className="input-field"
                />
            </div>
            <div>
                Input Type:
                <select
                    onChange={handleSelectChange}
                    value={inputType}
                    className="input-field"
                >
                    <option value="file">File</option>
                    <option value="link">Link</option>
                </select>
            </div>
            {inputType === "file" ? (
                <div>
                    File:
                    <input
                        id="file_url"
                        type="file"
                        name="file_url"
                        onChange={handleFileChange}
                        className="input-field"
                    />
                </div>
            ) : (
                <div>
                    Link:
                    <input
                        id="link_url"
                        name="link_url"
                        value={link}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                </div>
            )}
            <input type="submit" value="Create Material" className="submit-button" />
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}

export default ChallengesForm;
