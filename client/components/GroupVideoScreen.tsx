import React from 'react'
import { styled } from '@mui/material/styles'
import { useHMSActions, useHMSStore, selectPeers } from '@100mslive/react-sdk'
import Peer from './PeerVideo'
import VideoControllBar from './ControlBar'

interface User {
  fullname: string
  email: string
}

export interface GroupVideoScreenProps {
  roomCode: string
  joinToken: string
  userInfo: User
}

const PeerContainer = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
}))

const GroupVideoScreen: React.FC<GroupVideoScreenProps> = (props) => {
  const { roomCode, joinToken, userInfo } = props
  const peers = useHMSStore(selectPeers)
  // const screenshareOn = hmsStore.getState(selectIsSomeoneScreenSharing);

  const hmsActions = useHMSActions()

  React.useEffect(() => {
    hmsActions.join({
      authToken: joinToken,
      userName: userInfo.fullname,
    })
  }, [joinToken, userInfo])

  React.useEffect(() => {
    window.onunload = () => {
      hmsActions.leave()
    }
  }, [hmsActions])

  const toggleScreenShare = React.useCallback(async () => {
    await hmsActions.setScreenShareEnabled(true)
  }, [hmsActions])

  return (
    <div>
      <PeerContainer>
        {peers && peers.map((peer) => <Peer peer={peer} />)}
      </PeerContainer>
      <div
        className="flex w-[100vw] justify-center"
        style={{ position: 'fixed', bottom: '10px' }}
      >
        <VideoControllBar />
      </div>
    </div>
  )
}

export default GroupVideoScreen
