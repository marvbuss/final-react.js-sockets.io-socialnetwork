export default function MessagesReducer(chatMessages = [], action) {
    if (action.type === "chat-messages/received") {
        chatMessages = action.payload.messages;
    } else if (action.type === "chat-message/received") {
        const newChatMessages = [action.payload.message, ...chatMessages];

        return newChatMessages;
    }

    return chatMessages;
}

export function chatMessagesReceived(messages) {
    return {
        type: "chat-messages/received",
        payload: { messages },
    };
}

export function chatMessageReceived(message) {
    return {
        type: "chat-message/received",
        payload: { message },
    };
}
