import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/chatContext';
import { useFetchRecp } from '../custom hooks/useFetchRes';
import { Stack } from 'react-bootstrap';
import moment from 'moment';

const ChatBox = () => {

    const {user} = useContext(AuthContext);

    const {messages,
        messagesError,
        isMessagesLoading,
        currentChat} = useContext(ChatContext);

    const { recpUser } = useFetchRecp(currentChat , user);

    if(!recpUser){
        return (
            <p style={{ textAlign: "center" , width: "100%"}}>
                No conversation selected yet
            </p>
        );
    }

    if(isMessagesLoading){
        return (
            <p style={{ textAlign: "center" , width: "100%"}}>Loading Chat</p>
        )
    }
//console.log(recpUser?.user[0]?.name);
//console.log(messages)
  return (
    <Stack gap={4} className="chat-box">
        <div className='chat-header'>
            <strong>{recpUser?.user[0]?.name}</strong>
        </div>
        <Stack gap={3} className='messages'>
            {
                messages && messages.map((message , index) => {
                    return (
                        <Stack key={index} className={`${message?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
                            <span >{message.text}</span>
                            <span className='message-footer'>{moment(message.createdAt).calendar()}</span>
                        </Stack>
                    )
                })
            }
        </Stack>
    </Stack>
  )
}

export default ChatBox
