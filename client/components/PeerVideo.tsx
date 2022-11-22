import React from 'react'
import { HMSPeer, useVideo } from '@100mslive/react-sdk'

export interface PeerProps {
  peer: HMSPeer
}

const Peer: React.FC<PeerProps> = (props) => {
  const { peer } = props
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  })
  return (
    <div>
      <video
        ref={videoRef}
        className={`peer-video ${peer.isLocal ? 'local' : ''}`}
        autoPlay
        muted
        playsInline
      />
      <div>
        {peer.name} {peer.isLocal ? '(You)' : ''}
      </div>
    </div>
  )
}

export default Peer
