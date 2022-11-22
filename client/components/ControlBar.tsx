import React from 'react'
import { useAVToggle } from '@100mslive/react-sdk'

import {
  BsCameraVideoFill,
  BsMicFill,
  BsMicMuteFill,
  BsFillCameraVideoOffFill,
} from 'react-icons/bs'

const VideoControllBar: React.FC = () => {
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } =
    useAVToggle()
  return (
    <div className="flex w-[80vw] items-center justify-evenly rounded-md bg-sky-500 p-2">
      {isLocalAudioEnabled ? (
        <BsMicFill onClick={toggleAudio} color="#fff" fontSize={18} />
      ) : (
        <BsMicMuteFill onClick={toggleAudio} color="#fff" fontSize={18} />
      )}
      {isLocalVideoEnabled ? (
        <BsCameraVideoFill onClick={toggleVideo} color="#fff" fontSize={18} />
      ) : (
        <BsFillCameraVideoOffFill
          onClick={toggleVideo}
          color="#fff"
          fontSize={18}
        />
      )}
    </div>
  )
}

export default VideoControllBar
