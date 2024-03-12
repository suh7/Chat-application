import { pusherServer } from "@lib/pusher";
import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId, currentUserId, text, photo } = body;

    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    /* Trigger a Pusher event for a specific chat about the new message */
    await pusherServer.trigger(chatId, "new-message", newMessage)

    /* Triggers a Pusher event for each member of the chat about the chat update with the latest message */
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage]
        });
      } catch (err) {
        console.error(`Failed to trigger update-chat event`);
      }
    });


    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create new message", { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await connectToDB();

    const { messageId, userId } = await req.json();

    // Find the message to be deleted
    const messageToDelete = await Message.findById(messageId);

    if (!messageToDelete) {
      return new Response("Message not found", { status: 404 });
    }

    // Check if the user has permission to delete the message
    if (messageToDelete.sender.toString() !== userId) {
      return new Response("Permission denied", { status: 403 });
    }

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    // Update the chat to remove the deleted message
    const updatedChat = await Chat.findByIdAndUpdate(
      messageToDelete.chat,
      {
        $pull: { messages: messageId },
      },
      { new: true }
    );

    // Trigger a Pusher event for the chat about the message deletion
    await pusherServer.trigger(updatedChat._id.toString(), "delete-message", {
      messageId,
    });

    return new Response("Message deleted successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to delete message", { status: 500 });
  }
};


