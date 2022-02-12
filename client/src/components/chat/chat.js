import { useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../socket/socket";

export default function Chat() {
    const chatMessages = useSelector((state) => state?.chatMessages);
    const textareaRef = useRef();
    const chatContainerRef = useRef();

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newChatMessage", e.target.value);
            textareaRef.current.value = "";
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-container" ref={chatContainerRef}>
                {chatMessages.map((chatMessage) => {
                    return (
                        <div key={chatMessage.created_at}>
                            <img
                                src={chatMessage.image_url}
                                className="navbar-avatar"
                            />
                            <p>
                                {chatMessage.message} | {chatMessage.first}
                                {chatMessage.last} - {chatMessage.created_at}
                            </p>
                        </div>
                    );
                })}
            </div>
            <textarea
                ref={textareaRef}
                className="input-container"
                placeholder="Enter your chat message here"
                onKeyDown={keyCheck}
            />
        </div>
    );
}
