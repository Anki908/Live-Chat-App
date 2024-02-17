import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/service";
import {io} from 'socket.io-client'

export const ChatContext = createContext();

export const ChatContextProvider = ({ children , user }) => {
    const [userChats , setUserChats] = useState(null);
    const [isUserChatsLoading , setIsUserChatsLoading] = useState(false);
    const [userChatsError , setUserChatsError] = useState(null);
    const [potentialChats , setPotentialChats] = useState([]);
    const [currentChat , setCurrentChat] = useState(null);
    const [messages , setMessages] = useState(null);
    const [isMessagesLoading , setIsMessagesLoading] = useState(false);
    const [messagesError , setMessagesError] = useState(null);
    const [sendTextMessageError , setSendTextMessageError] = useState(null)
    const [newMessage , setNewMessage] = useState(null);
    const [socket , setSocket] = useState(null);
    const [onlineUsers , setOnlineUsers] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000/');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    } , [user])


    useEffect(() => {
        if(socket == null) return
        socket.emit("addNewUser" , user?._id)
        socket.on("getOnlineUsers" , (res) => {
            setOnlineUsers(res);
        }) 

        return () => {
            socket.off("getOnlineUsers")
        };
        
    } , [socket]);

    console.log("onlineUsers" , onlineUsers);

    useEffect(() => {
        const getUsers = async() => {
            const response = await getRequest(`${baseUrl}/user/getalluser`);

            if(response.error){
                return console.log("error fetching users" , response);
            }
            const potChats = response.user.filter((u) => {
                let isChatCreated = false;
                if(user?._id === u._id) return false;
                //console.log(userChats);
                if(userChats){
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    })
                }
                return !isChatCreated;
            })
            setPotentialChats(potChats);
        }
        getUsers();
    } , [user , userChats])


    useEffect(() => {
        const getUserChats = async() => {
            if(user?._id){
                setIsUserChatsLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                setIsUserChatsLoading(false);
                if(response.error){
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        }
        getUserChats();
    } , [user]);

    useEffect(() => {
        const getMessages = async() => {
            setIsMessagesLoading(true);
            setMessagesError(null);
            const response = await getRequest(`${baseUrl}/message/${currentChat?._id}`);
            console.log(response);
            setIsMessagesLoading(false);
            if(response.error){
                return setMessagesError(response);
            }
            setMessages(response);
        }
        getMessages();
    } , [currentChat]);


    const createChat = useCallback(async (firstId , secondId) => {
        const response = await postRequest(`${baseUrl}/chats` , JSON.stringify({
            firstId,
            secondId
        }));
        if(response.error) return console.log("Error creating in chats" , response);
        setUserChats((prev) => [...prev , response]);
    } , []);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    } , [])

    const sendTextMessage = useCallback(async(textMessage , sender , currentChatId , setTextMessage) => {
        if(!textMessage) return console.log("Please type something");

        const response = await postRequest(`${baseUrl}/message` , JSON.stringify({
            chatId: currentChatId,
            senderId: sender,
            text: textMessage,
        }))

        if(response.error){
            return setSendTextMessageError(response);
        }

        setNewMessage(response);
        setMessages((prev) => [...prev , response]);
        setTextMessage("");
    } , [])

    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats,
            createChat,
            updateCurrentChat,
            messages,
            messagesError,
            isMessagesLoading,
            currentChat,
            sendTextMessage,
            onlineUsers
        }}>
            {children}
        </ChatContext.Provider>
    )
}