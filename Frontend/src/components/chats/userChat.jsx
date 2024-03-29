import React, { useContext } from 'react'
import { useFetchRecp } from '../../custom hooks/useFetchRes'
import {Stack} from 'react-bootstrap'
import avatar from '../../assets/avatar.svg'
import { ChatContext } from '../../context/chatContext'

const userChat = ({chat , user}) => {
    const {recpUser} = useFetchRecp(chat , user);
    const {onlineUsers} = useContext(ChatContext);

    const isOnline = onlineUsers?.some((user) => user?.userId === recpUser?.user[0]?._id);

    //console.log(recpUser)
  return (
    <Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justify-content-between"
    role="button"
    >
      <div className='d-flex'>
        <div className='me-2'>
          <img src={avatar} height="35px"/>
        </div>
        <div className='text-content'>
          <div className='name'>{recpUser?.user[0]?.name}</div>
          <div className='text'>Text Messages</div>
        </div>
      </div>
      <div className='d-flex flex-coloumn align-items-end'>
        <div className='date'> 17/02/2024 </div>
        <div className='this-user-notification'>2</div>
        <span className={ isOnline ? 'user-online' : ''}></span>
      </div>
    </Stack>
  )
}

export default userChat
