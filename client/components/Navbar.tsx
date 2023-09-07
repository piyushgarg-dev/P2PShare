import React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { SiAirplayaudio } from 'react-icons/si'
import {
  useFirebase,
  FirebaseContext,
  handleLogout,
} from 'context/FirebaseContext'
import UserAvatar from './UserAvatar'
import { BsArrowLeftRight } from 'react-icons/bs'
import { User } from 'types'

export interface NavbarProps {
  remoteUser?: User | undefined | null
  remoteSocketId?: string | undefined | null
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { remoteUser, remoteSocketId } = props
  const { currentUser } = useFirebase() as FirebaseContext

  return (
    <nav className="flex items-center justify-between">
      <Typography
        variant="h5"
        className="flex items-center align-middle font-sans font-bold text-white antialiased"
      >
        <SiAirplayaudio className="mr-2 inline" />
        ConnectMe<span className="text-sky-400/100">P2P</span>
      </Typography>
      {currentUser && remoteSocketId && (
        <div>
          <div className="mx-5 mt-4 flex items-center text-white">
            <UserAvatar
              username={
                currentUser?.displayName || currentUser.email || 'Someone'
              }
              src={currentUser?.photoURL || ''}
              height={40}
              width={40}
            />
            <BsArrowLeftRight fontSize={20} />
            {remoteUser ? (
              <UserAvatar
                username={remoteUser?.username || 'Someone'}
                src={remoteUser?.displayPicture}
                height={40}
                width={40}
              />
            ) : (
              <Typography sx={{ mx: 2 }}>Disconnected</Typography>
            )}
          </div>
        </div>
      )}
      {currentUser && (
        <>
          <div className="mx-6 mt-4 flex">
            <UserAvatar
              username={
                currentUser?.displayName || currentUser.email || 'Someone'
              }
              src={currentUser?.photoURL || ''}
              height={40}
              width={40}
            />

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleLogout()}
              className="ml-3"
            >
              LogOut
            </Button>
          </div>
        </>
      )}
    </nav>
  )
}

export default Navbar
