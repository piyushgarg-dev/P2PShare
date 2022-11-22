import React from 'react'

export interface ProviderProps {
  remoteStreams: MediaStream[]
  userStream: MediaStream | null
  setUserMediaStream?: (stream: MediaStream) => void
  setRemoteMediaStream?: (stream: MediaStream[]) => void
}

export const MediaStreamContext = React.createContext<ProviderProps | null>(
  null
)

export const MediaStreamProvider: React.FC<React.ReactNode> = (props) => {
  const [remoteMediastreams, setRemoteMediaStream] = React.useState<
    MediaStream[]
  >([])
  const [userMediaStream, setUserMediaStream] =
    React.useState<MediaStream | null>(null)

  return (
    <MediaStreamContext.Provider
      value={{
        remoteStreams: remoteMediastreams,
        userStream: userMediaStream,
        setRemoteMediaStream,
        setUserMediaStream,
      }}
    >
      {props.children}
    </MediaStreamContext.Provider>
  )
}
