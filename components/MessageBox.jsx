import { format } from "date-fns"
import React from 'react'

const MessageBox = ({ message, currentUser, getChatDetails }) => {

  const [chatOptions, setChatOptions] = React.useState(false)

  React.useEffect(() => {
    const closeChatOptions = () => {
      setChatOptions(false);
    };

    // Add event listener to handle clicks anywhere on the screen
    window.addEventListener('click', closeChatOptions);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('click', closeChatOptions);
    };
  }, []);

  const deleteMessage = async (messageId) => {
    try {
      const res = await fetch("/api/messages/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          userId: currentUser._id, // Assuming currentUser is available in the scope
        }),
      });
  
      if (res.ok) {
        console.log("Message deleted successfully");
        setChatOptions(false)
        await getChatDetails()
        // Optionally, you can perform any additional actions after deleting the message
      } else {
        console.error("Failed to delete message");
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  return message?.sender?._id !== currentUser._id ? (
    <div className="message-box">
      <img src={message?.sender?.profileImage || "/assets/person.jpg"} alt="profile photo" className="message-profilePhoto" />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160; {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <p className="message-text">{message?.text}</p>
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
      </div>
    </div>
  ) : (
    <div className="message-box justify-end">
      <div className="message-info items-end">
        <p className="text-small-bold">
          {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <>
            <div className="flex">
              <p className="message-text-sender">{message?.text}</p>
              <span className=" rotate-90 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setChatOptions(true);
                  if(chatOptions){
                    setChatOptions(false)
                  }
                }}
              >...</span>
            </div>
            {
              chatOptions ? (
                <div className="bg-red-500 text-white p-4 rounded-lg cursor-pointer" 
                  onClick = {async() =>{
                    await deleteMessage(message._id)
                  }
                  }
                >
                  Delete
                </div>
              ) : (
                <></>
              )
            }
          </>
        ) : (
          <div className="flex">
            <img src={message?.photo} alt="message" className="message-photo" />
            <span className="rotate-90">...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBox