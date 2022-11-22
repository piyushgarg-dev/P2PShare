import React from 'react'
import type { NextPage } from 'next'
import { createHmac } from 'crypto'
import { Socket } from 'socket.io-client'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { useFirebase, FirebaseContext } from 'context/FirebaseContext'

import Navbar from 'components/Navbar'
import UserAvatar from 'components/UserAvatar'

import Dashboard from 'components/Dashboard'

import { serverInstance, SuperHero } from 'api'

import peerService from 'services/peer'
import { AvailableFiles } from 'components/FileTransfer'

import { MediaStreamContext, ProviderProps } from 'context/MediaStream'
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from 'context/ScreenStream'
import { SocketContext } from 'context/SocketContext'
import GoogleLoginButton from 'components/auth/GoogleLoginButton'
import { IncomingCall, User } from 'types'

const Home: NextPage = () => {
  const { setUserMediaStream, setRemoteMediaStream, remoteStreams } =
    React.useContext(MediaStreamContext) as ProviderProps

  const {
    userScreenStream,
    setUserMediaScreenStream,
    setScreenRemoteMediaStream,
  } = React.useContext(MediaScreenStreamContext) as ProviderScreenProps

  const { currentUser } = useFirebase() as FirebaseContext

  const socket = React.useContext(SocketContext) as Socket

  const [users, setUsers] = React.useState<User[] | undefined | null>()
  const [self, setSelf] = React.useState<SuperHero | undefined | null>()

  const [whiteboardID, setWhiteboardID] = React.useState<string | null>(null)

  const [avilableFiles, setAvailableFiles] = React.useState<AvailableFiles[]>(
    []
  )

  const [calledToUserId, setCalledToUserId] = React.useState<
    string | undefined
  >()

  const [remoteSocketId, setRemoteSocketId] = React.useState<
    string | undefined
  >()

  const [remoteUser, setRemoteUser] = React.useState<undefined | null | User>()

  const [incommingCallData, setIncommingCallData] = React.useState<
    IncomingCall | undefined
  >()

  const isCallModalOpened = React.useMemo(
    () => Boolean(incommingCallData !== undefined),
    [incommingCallData]
  )

  const secret = React.useMemo(() => '$3#Ia', [])

  const loadUsers = React.useCallback(async () => {
    const { data } = await serverInstance.get('/users')
    if (data.users) {
      setUsers(data.users)
    }
  }, [])

  const joinRoom = React.useCallback(async () => {
    try {
      if (currentUser && currentUser.displayName && currentUser.email) {
        socket.emit('room:join', {
          username: `${currentUser?.displayName} - ${currentUser?.email}`,
          displayPicture: currentUser?.photoURL,
          platform: 'macos',
        })
      }
    } catch (error) {
      joinRoom()
    }
  }, [currentUser])

  const handleClickUser = React.useCallback(async (user: User) => {
    const offer = await peerService.getOffer()
    if (offer) {
      socket.emit('peer:call', { to: user.socketId, offer })
      setCalledToUserId(user.socketId)
    }
  }, [])

  const handleIncommingCall = React.useCallback(async (data: IncomingCall) => {
    if (data) {
      setIncommingCallData(data)
    }
  }, [])

  const handleAcceptIncommingCall = React.useCallback(async () => {
    if (!incommingCallData) return
    const { from, user, offer } = incommingCallData
    if (offer) {
      const answer = await peerService.getAnswer(offer)
      if (answer) {
        socket.emit('peer:call:accepted', { to: from, offer: answer })
        setRemoteUser({
          displayPicture: user.displayPicture,
          username: user.username,
          isConnected: true,
          joinedAt: new Date(),
          platform: 'macos',
          socketId: from,
        })
        setRemoteSocketId(from)
      }
    }
  }, [incommingCallData])

  const handleRejectIncommingCall = React.useCallback(
    () => setIncommingCallData(undefined),
    []
  )

  const handleCallAccepted = React.useCallback(async (data) => {
    const { offer, from, user } = data

    await peerService.setRemoteDesc(offer)
    setRemoteUser({
      displayPicture: user.displayPicture,
      username: user.username,
      isConnected: true,
      joinedAt: new Date(),
      platform: 'macos',
      socketId: from,
    })
    setRemoteSocketId(from)
  }, [])

  React.useEffect(() => {
    if (remoteSocketId) setIncommingCallData(undefined)
  }, [remoteSocketId])

  React.useEffect(() => {
    peerService.remoteSocketId = remoteSocketId
  }, [remoteSocketId])

  const handleFileTransfer = React.useCallback(
    (file: File): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (peerService.myDataChanel) {
          let buffer = await file.arrayBuffer()

          const bufferString = JSON.stringify(buffer)
          const hash = createHmac('md5', secret)
            .update(bufferString)
            .digest('hex')
          try {
            peerService.myDataChanel.send(
              JSON.stringify({
                name: file.name,
                size: file.size,
                checksum: hash,
              })
            )
          } catch (error) {
            reject()
          }

          let offset = 0
          let maxChunkSize = 1024 * 26

          peerService.myDataChanel.binaryType = 'arraybuffer'
          try {
            const send = () => {
              while (buffer.byteLength) {
                if (
                  peerService &&
                  peerService.myDataChanel &&
                  peerService?.myDataChanel?.bufferedAmount >
                    peerService?.myDataChanel?.bufferedAmountLowThreshold
                ) {
                  peerService.myDataChanel.onbufferedamountlow = () => {
                    if (peerService && peerService.myDataChanel)
                      peerService.myDataChanel.onbufferedamountlow = null
                    send()
                  }
                  return
                }
                const chunk = buffer.slice(0, maxChunkSize)
                buffer = buffer.slice(maxChunkSize, buffer.byteLength)
                if (peerService && peerService.myDataChanel)
                  peerService?.myDataChanel.send(chunk)
              }
              resolve()
            }
            send()
          } catch (err) {
            reject()
          }
        }
      })
    },
    [secret]
  )

  const handleNegosiation = React.useCallback(
    async (ev: Event) => {
      const offer = await peerService.getOffer()
      socket.emit('peer:negotiate', {
        to: peerService.remoteSocketId,
        offer,
      })
    },
    [remoteSocketId]
  )

  const handleRequiredPeerNegotiate = React.useCallback(async (data) => {
    const { from, offer } = data
    if (offer) {
      const answer = await peerService.getAnswer(offer)
      socket.emit('peer:negosiate:result', { to: from, offer: answer })
    }
  }, [])

  const handleRequiredPeerNegotiateFinalResult = React.useCallback(
    async (data) => {
      const { from, offer } = data
      if (offer) {
        await peerService.setRemoteDesc(offer)
      }
    },
    []
  )

  const handleStartAudioVideoStream = React.useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })

    if (stream && setUserMediaStream) setUserMediaStream(stream)

    for (const track of stream.getTracks()) {
      if (peerService.peer) {
        peerService.peer?.addTrack(track, stream)
      }
    }
  }, [])

  const handleStartScreenShareStream = React.useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({})

    if (stream && setUserMediaScreenStream) setUserMediaScreenStream(stream)

    const track = stream.getTracks()[0]
    if (peerService.peer) {
      peerService.peer?.addTrack(track, stream)
    }
  }, [])

  const handleStopScreenShareStream = React.useCallback(async () => {
    if (userScreenStream) {
      const tracks = userScreenStream.getTracks()
      tracks.forEach((track) => track.stop())

      if (setUserMediaScreenStream) {
        setUserMediaScreenStream(null)
      }
    }
  }, [userScreenStream, setUserMediaScreenStream])

  React.useEffect(() => {
    joinRoom()
  }, [currentUser])

  React.useEffect(() => {
    loadUsers()
    const peerServiceInit = peerService.init()

    peerService?.peer?.addEventListener('negotiationneeded', handleNegosiation)

    let temp = {
      filename: '',
      size: 0,
      checksum: null,
    }

    let receivedSize = 0
    let receiveBuffer: Buffer[] = []

    if (peerService.peer) {
      peerService.peer.addEventListener('track', async (ev) => {
        const remoteStream = ev.streams
        if (remoteStream && setRemoteMediaStream) {
          setRemoteMediaStream([...remoteStreams, remoteStream[0]])
        }
      })
      peerService.peer.addEventListener('ended', async (ev) => {})
    }

    if (peerService.peer)
      //@ts-ignore
      peerService.peer.ondatachannel = (e) => {
        peerService.remoteDataChanel = e.channel
        peerService.remoteDataChanel.onmessage = (e) => {
          const { data } = e

          if (typeof data === 'string') {
            const { name, size, checksum } = JSON.parse(data)
            temp.filename = name
            temp.size = size
            temp.checksum = checksum

            setAvailableFiles((e) => [
              {
                name: temp.filename,
                size: temp.size,
                recievedSize: 0,
                checksum: temp.checksum,
                checksumMatched: false,
              },
              ...e,
            ])
          } else {
            try {
              if (data && receivedSize < temp.size) {
                receiveBuffer.push(data)
                receivedSize += data.byteLength
                setAvailableFiles((e) =>
                  e.map((e) =>
                    e.name === temp.filename
                      ? {
                          name: temp.filename,
                          size: temp.size,
                          recievedSize: receivedSize,
                          checksum: temp.checksum,
                          checksumMatched: false,
                        }
                      : e
                  )
                )
              }
              if (data && receivedSize === temp.size) {
                const blob = new Blob(receiveBuffer)

                ;(async () => {
                  const arraybuffer = await blob.arrayBuffer()
                  const bufferString = JSON.stringify(arraybuffer)
                  const hash = createHmac('md5', secret)
                    .update(bufferString)
                    .digest('hex')

                  if (temp.checksum !== hash) {
                    setAvailableFiles((e) =>
                      e.map((e) =>
                        e.name === temp.filename
                          ? {
                              name: temp.filename,
                              size: temp.size,
                              recievedSize: receivedSize,
                              blob,
                              checksumMatched: false,
                              checksum: temp.checksum,
                            }
                          : e
                      )
                    )
                  } else {
                    setAvailableFiles((e) =>
                      e.map((e) =>
                        e.name === temp.filename
                          ? {
                              name: temp.filename,
                              size: temp.size,
                              recievedSize: receivedSize,
                              blob,
                              checksum: temp.checksum,
                              checksumMatched: true,
                            }
                          : e
                      )
                    )
                    temp = {
                      filename: '',
                      size: 0,
                      checksum: null,
                    }
                    receivedSize = 0
                    receiveBuffer = []
                  }
                })()
              }
            } catch (error) {}
          }
        }
        peerService.remoteDataChanel.onopen = (e) =>
          console.log('Data Chanel Created!')
      }

    return () => {
      peerService?.peer?.removeEventListener(
        'negotiationneeded',
        handleNegosiation
      )
    }
  }, [remoteStreams])

  const handleUserDisconnection = React.useCallback(
    (payload) => {
      const { socketId = null } = payload

      if (socketId) {
        if (remoteSocketId == socketId) {
          setRemoteUser(undefined)
        }
      }
    },
    [remoteSocketId]
  )

  const handleSetWhiteboardID = React.useCallback((payload) => {
    if (payload.whiteboardID) {
      setWhiteboardID(payload.whiteboardID)
    }
  }, [])

  React.useEffect(() => {
    if (remoteSocketId) {
      socket.off('refresh:user-list', loadUsers)
      socket.on('user-disconnected', handleUserDisconnection)
    }

    return () => {
      socket.on('refresh:user-list', loadUsers)
      socket.off('user-disconnected', handleUserDisconnection)
    }
  }, [remoteSocketId])

  React.useEffect(() => {
    socket.on('refresh:user-list', loadUsers)
    socket.on('peer:incomming-call', handleIncommingCall)
    socket.on('peer:call:accepted', handleCallAccepted)
    socket.on('peer:negotiate', handleRequiredPeerNegotiate)
    socket.on('peer:negosiate:result', handleRequiredPeerNegotiateFinalResult)
    socket.on('whiteboard:id', handleSetWhiteboardID)

    return () => {
      socket.off('refresh:user-list', loadUsers)
      socket.off('peer:incomming-call', handleIncommingCall)
      socket.off('peer:call-accepted', handleCallAccepted)
      socket.off('peer:negotiate', handleRequiredPeerNegotiate)
      socket.off(
        'peer:negosiate:result',
        handleRequiredPeerNegotiateFinalResult
      )
    }
  }, [])

  if (!currentUser) {
    return (
      <div className="min-h-screen justify-center bg-[#18181b] p-5">
        <Navbar />
        <div className="flex min-h-[80vh] w-full items-center justify-center text-white">
          <GoogleLoginButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen justify-center bg-[#18181b] p-5">
      <Navbar remoteSocketId={remoteSocketId} remoteUser={remoteUser} />
      {remoteSocketId && (
        <Dashboard
          availableFiles={avilableFiles}
          startAudioVideoStreams={handleStartAudioVideoStream}
          startScreenShareStreams={handleStartScreenShareStream}
          stopScreenShareStreams={handleStopScreenShareStream}
          onFileTransfer={handleFileTransfer}
          remoteSocketId={remoteSocketId}
          whiteboardID={whiteboardID}
        />
      )}
      {!remoteSocketId && (
        <div className="flex min-h-[80vh] w-full items-center justify-center text-white">
          {users &&
            users
              .filter(
                (e) =>
                  e.username !==
                  `${currentUser?.displayName} - ${currentUser?.email}`
              )
              .map((user, index) => (
                <div
                  key={`${user.username}-${index}`}
                  onClick={() => handleClickUser(user)}
                  className={
                    calledToUserId && calledToUserId === user.socketId
                      ? `border-collapse rounded-3xl border-0 border-dashed border-sky-400 motion-safe:animate-bounce`
                      : ''
                  }
                >
                  <UserAvatar
                    src={user.displayPicture}
                    username={user.username}
                  />
                </div>
              ))}
          {(!users ||
            users.filter(
              (e) =>
                e.username !==
                `${currentUser?.displayName} - ${currentUser?.email}`
            ).length <= 0) && (
            <Typography className="font-sans text-slate-400 opacity-70 motion-safe:animate-bounce">
              Join by opening this on other tab
            </Typography>
          )}
        </div>
      )}

      {!remoteSocketId && (
        <div className="flex items-center justify-center">
          <Typography variant="h6" className="font-sans text-slate-400">
            Tip: Click on user to make call
          </Typography>
        </div>
      )}

      <Dialog
        open={isCallModalOpened}
        onClose={() => {}}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Incomming Call From {incommingCallData?.user?.username}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>You have an incomming call</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectIncommingCall}>Reject</Button>
          <Button onClick={handleAcceptIncommingCall} autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Footer /> */}
    </div>
  )
}

export default Home
