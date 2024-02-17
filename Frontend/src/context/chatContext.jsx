import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/service";

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


    //console.log(currentChat?._id);

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
            currentChat
        }}>
            {children}
        </ChatContext.Provider>
    )
}