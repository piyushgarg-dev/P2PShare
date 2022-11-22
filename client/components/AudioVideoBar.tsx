import React from 'react'
import ReactPlayer from 'react-player'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai'
import Typography from '@mui/material/Typography'
import { MediaStreamContext, ProviderProps } from 'context/MediaStream'
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from 'context/ScreenStream'

import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsMicFill,
  BsFillMicMuteFill,
} from 'react-icons/bs'

interface AudioVideoBarProps {
  pinVideoObj: MediaStream | null
  onStartAudioVideo?: () => void
  pinVideo: (id: string) => void
  unPinVideo: () => void
}

const AudioVideoBar: React.FC<AudioVideoBarProps> = (props) => {
  const { pinVideoObj, onStartAudioVideo, pinVideo, unPinVideo } = props
  const { userStream, remoteStreams } = React.useContext(
    MediaStreamContext
  ) as ProviderProps

  const { userScreenStream } = React.useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps

  return (
    <div className="h-full w-full rounded-md bg-transparent">
      <div className="video-player-container w-full rounded-md">
        {userStream ? (
          <>
            {pinVideoObj?.id !== userStream.id && (
              <div className="group relative">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={userStream}
                  muted
                  playing
                  controls={false}
                  className="opacity-100 group-hover:opacity-50"
                />
                {pinVideoObj && pinVideoObj.id == userStream.id ? (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={unPinVideo}
                  >
                    <AiFillPushpin
                      className="m-auto"
                      size={30}
                      title="UnPin video"
                    />
                  </button>
                ) : (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={() => pinVideo(userStream.id)}
                  >
                    <AiOutlinePushpin
                      className="m-auto"
                      size={30}
                      title="Pin video"
                    />
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div
            onClick={onStartAudioVideo}
            className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md bg-slate-500"
          >
            <div className="text-center text-lg">
              <BsCameraVideoOffFill className="mx-auto" />
              <div className="my-5" />
              <div>
                <Typography variant="body1">
                  Your video is turned off.
                </Typography>
                <Typography variant="caption">Click to turn on</Typography>
              </div>
            </div>
          </div>
        )}
      </div>
      {userScreenStream && pinVideoObj?.id !== userScreenStream.id && (
        <>
          <div className="my-5" />
          <div className="video-player-container w-full rounded-md">
            <div className="group relative">
              <ReactPlayer
                key={userScreenStream.id}
                width="100%"
                height="100%"
                url={userScreenStream}
                playing
                controls={false}
                pip
                className="opacity-100 group-hover:opacity-50"
              />
              {pinVideoObj && pinVideoObj.id == userScreenStream.id ? (
                <button
                  className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                  onClick={unPinVideo}
                >
                  <AiFillPushpin
                    className="m-auto"
                    size={30}
                    title="UnPin video"
                  />
                </button>
              ) : (
                <button
                  className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                  onClick={() => pinVideo(userScreenStream.id)}
                >
                  <AiOutlinePushpin
                    className="m-auto"
                    size={30}
                    title="Pin video"
                  />
                </button>
              )}
            </div>
          </div>
        </>
      )}
      <div className="my-5" />
      <div className="video-player-container w-full rounded-md">
        {remoteStreams
          .filter((stream) => stream.id !== pinVideoObj?.id)
          .map((stream) => (
            <>
              <div className="my-5" />
              <div className="group relative">
                <ReactPlayer
                  key={stream.id}
                  width="100%"
                  height="100%"
                  url={stream}
                  playing
                  controls={false}
                  pip
                  className="opacity-100 group-hover:opacity-50"
                />
                {pinVideoObj && pinVideoObj.id == stream.id ? (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={unPinVideo}
                  >
                    <AiFillPushpin
                      className="m-auto"
                      size={30}
                      title="UnPin video"
                    />
                  </button>
                ) : (
                  <button
                    className="absolute top-[50%] left-0 right-0 hidden group-hover:block"
                    onClick={() => pinVideo(stream.id)}
                  >
                    <AiOutlinePushpin
                      className="m-auto"
                      size={30}
                      title="Pin video"
                    />
                  </button>
                )}
              </div>
            </>
          ))}
      </div>
    </div>
  )
}

export default AudioVideoBar
