import { useState } from 'react';
import { useMessages, sendMessage } from '../hooks/useChat';
import { auth } from '../hooks/auth';

export default function Chat() {
    const [currentMessage, setCurrentMessage] = useState('');
    const messages = useMessages();

    const handleSend = async () => {
        if (currentMessage.trim() !== '') {
            try {
                const currentUser = auth.currentUser;
                if (currentUser && currentUser.email) {
                    await sendMessage(currentMessage, currentUser?.uid ?? '', currentUser?.email ?? '', currentUser?.displayName ?? '');
                    setCurrentMessage('');
                } else {
                    console.error("No user is signed in or the user doesn't have an email");
                }
            } catch (error) {
                console.error("Error sending message: ", error);
            }
        }
    };

    return (
        <div className="mx-auto bg-[#333] text-center w-2/4 mt-8 mb-24 rounded-xl">
            <div className="p-4 text-left" style={{ height: '500px', overflowY: 'scroll' }}>
                <h1 className="my-2 text-xl text-center">Chat with other players</h1>
                <hr className="my-4" />
                {messages.map((msg, index) => (
                    <p className="my-2" key={index}>
                        {msg.displayName}: {' '}
                        {msg.text}
                    </p>
                ))}
            </div>
            <hr className="my-4" />
            <div className="py-8">
                <input className="p-3 text-black rounded-xl w-2/3"
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    maxLength={50}
                    placeholder="Type a message"
                />
                <button className="ml-2 px-5 py-3 text-black bg-white rounded-xl" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
