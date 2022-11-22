import React from 'react'
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md'
import Tooltip from '@mui/material/Tooltip'
import {
  MediaScreenStreamContext,
  ProviderScreenProps,
} from 'context/ScreenStream'

export interface ScreenShareProps {
  onStartScreenShare?: () => void
  onStopScreenShare?: () => void
}

const ScreenShare: React.FC<ScreenShareProps> = (props) => {
  const { onStartScreenShare, onStopScreenShare } = props
  //   const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const { userScreenStream, remoteScreenStream } = React.useContext(
    MediaScreenStreamContext
  ) as ProviderScreenProps

  return (
    <div>
      <div className="h-[5vh] w-full  rounded-lg bg-slate-600">
        <div
          className="flex h-full w-full items-center justify-evenly"
          id="tools-container"
        >
          {userScreenStream ? (
            <Tooltip title="Stop screen share" placement="left-start">
              <div>
                <MdOutlineStopScreenShare
                  className="cursor-pointer"
                  onClick={onStopScreenShare}
                />
              </div>
            </Tooltip>
          ) : (
            <Tooltip title="Start screen share" placement="top">
              <div>
                <MdOutlineScreenShare
                  className="cursor-pointer"
                  onClick={onStartScreenShare}
                />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScreenShare
