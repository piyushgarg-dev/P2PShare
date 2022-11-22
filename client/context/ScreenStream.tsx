import React from 'react'

export interface ProviderScreenProps {
  remoteScreenStream: MediaStream | null
  userScreenStream: MediaStream | null
  setUserMediaScreenStream?: (stream: MediaStream | null) => void
  setScreenRemoteMediaStream?: (stream: MediaStream) => void
}

export const MediaScreenStreamContext =
  React.createContext<ProviderScreenProps | null>(null)

export const MediaScreenStreamProvider: React.FC<React.ReactNode> = (props) => {
  const [ScreenRemoteMediastream, setScreenRemoteMediaStream] =
    React.useState<MediaStream | null>(null)
  const [userMediaScreenStream, setUserMediaScreenStream] =
    React.useState<MediaStream | null>(null)

  return (
    <MediaScreenStreamContext.Provider
      value={{
        remoteScreenStream: ScreenRemoteMediastream,
        userScreenStream: userMediaScreenStream,
        setScreenRemoteMediaStream,
        setUserMediaScreenStream,
      }}
    >
      {props.children}
    </MediaScreenStreamContext.Provider>
  )
}
