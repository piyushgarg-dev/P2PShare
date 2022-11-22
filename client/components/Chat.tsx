import React from 'react'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Grid from '@mui/material/Grid'
import Fab from '@mui/material/Fab'
import Badge from '@mui/material/Badge'
import moment from 'moment'
import { BsFillChatLeftFill } from 'react-icons/bs'

import { Socket } from 'socket.io-client'
import { SocketContext } from 'context/SocketContext'

interface Message {
  from?: string
  displayPicture?: string
  message: string
  timestamp?: Date | number
  isSelf?: boolean
}
interface MessageProps extends Message {}

interface ChatProps {
  remoteSocketId?: string
}

const Message: React.FC<MessageProps> = (props) => {
  const { from, message, isSelf, displayPicture, timestamp } = props

  const convertedTime = React.useMemo(
    () => (timestamp ? moment(new Date(timestamp), 'MM').fromNow() : undefined),
    [timestamp]
  )

  return (
    <div>
      <ListItem className="pb-0">
        {!isSelf && (
          <ListItemAvatar>
            <Avatar
              src={displayPicture}
              className="bg-slate-500 shadow-xl"
            ></Avatar>
          </ListItemAvatar>
        )}
        <ListItemText
          className={`rounded-2xl ${
            isSelf ? 'rounded-tr-none' : 'rounded-tl-none'
          } ${isSelf ? 'bg-slate-700' : 'bg-sky-600'} p-2 text-white shadow-xl`}
          primary={message}
        />
        {isSelf && (
          <ListItemAvatar className="ml-3">
            <Avatar
              src={displayPicture}
              className="bg-slate-500 shadow-xl"
            ></Avatar>
          </ListItemAvatar>
        )}
      </ListItem>

      <small
        className={`${
          isSelf ? 'pl-[16px]' : 'float-right pr-[16px]'
        } text-slate-400`}
      >
        {convertedTime && convertedTime}
      </small>
    </div>
  )
}

const Chat: React.FC<ChatProps> = (props) => {
  const { remoteSocketId } = props
  const [opened, setOpened] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])

  const [inputChatMessage, setInputChatMessage] = React.useState<
    string | undefined
  >()

  const [unreadMessageCount, setUnreadMessageCount] = React.useState(0)

  const socket = React.useContext(SocketContext) as Socket
  const chatBoxContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (chatBoxContainerRef.current) {
      chatBoxContainerRef.current.scrollTo(
        0,
        chatBoxContainerRef.current.scrollHeight
      )
    }
  }, [messages])

  React.useEffect(() => {
    if (opened) {
      setUnreadMessageCount(0)
    } else {
      setUnreadMessageCount((e) => e + 1)
    }
  }, [opened, messages])

  const toggleChatBox = React.useCallback(() => setOpened((e) => !e), [])

  const handleOnMessage = React.useCallback((data) => {
    const { from, message, user, self = false } = data
    setMessages((e) => [
      ...e,
      {
        from: user.username,
        displayPicture: user.displayPicture,
        message: message.message,
        isSelf: self,
        timestamp: Date.now(),
      },
    ])
  }, [])

  const handleChatInboxKeyPress = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        if (inputChatMessage && inputChatMessage.trim() !== '') {
          const message: Message = { message: inputChatMessage }
          console.log('Emit to', remoteSocketId, message)
          socket.emit('chat:message', { to: remoteSocketId, message })
          setInputChatMessage('')
        }
      }
    },
    [socket, inputChatMessage]
  )

  React.useEffect(() => {
    socket.on('chat:message', handleOnMessage)

    return () => {
      socket.off('chat:message', handleOnMessage)
    }
  }, [handleOnMessage])

  return (
    <div className="relative">
      {opened && (
        <>
          <div
            ref={chatBoxContainerRef}
            className="my-2 ml-auto h-[400px] w-[350px] overflow-y-scroll rounded-md bg-slate-800 py-2 text-black shadow-2xl"
          >
            {messages && messages.length > 0 && (
              <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <List dense={false}>
                      {messages &&
                        messages.length > 0 &&
                        messages.map((e) => (
                          <>
                            <Message {...e} />
                          </>
                        ))}
                    </List>
                  </Grid>
                </Grid>
              </Box>
            )}
            {messages && messages.length <= 0 && (
              <div className="flex h-full w-full items-center justify-center font-sans text-slate-400">
                <Typography>No new messages</Typography>
              </div>
            )}
          </div>
          <div
            onKeyDown={handleChatInboxKeyPress}
            className="my-2 ml-auto w-[350px] rounded-md bg-[#18181b] p-3 text-slate-600"
          >
            <TextField
              onChange={(e) => setInputChatMessage(e.target.value)}
              className="w-full rounded-lg bg-white "
              id="standard-basic"
              placeholder="Type your message here..."
              autoComplete="off"
              value={inputChatMessage}
            />
          </div>
        </>
      )}
      <div className="flex h-full w-full items-center justify-end">
        <Fab color="primary" className="bg-sky-500" onClick={toggleChatBox}>
          <Badge
            badgeContent={
              unreadMessageCount > 1 ? unreadMessageCount - 1 : undefined
            }
            color="warning"
          >
            <BsFillChatLeftFill fill="#fff" color="#fff" fontSize={20} />
          </Badge>
        </Fab>
      </div>
    </div>
  )
}

export default Chat
