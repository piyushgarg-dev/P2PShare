import React from 'react'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { getRandomColorCode } from 'utils/color'
import Tooltip from '@mui/material/Tooltip'

export interface UserAvatarProps {
  username: string
  src?: string
  height?: number
  width?: number
}

const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const { username, src, height, width } = props
  if (!src)
    return (
      <Avatar
        sx={{
          cursor: 'pointer',
          mx: 1,
          width: height ?? 90,
          height: width ?? 90,
          backgroundColor: getRandomColorCode(),
        }}
      >
        <Typography variant="h3">{username[0]}</Typography>
      </Avatar>
    )
  return (
    <Tooltip title={username}>
      <Avatar
        sx={{
          cursor: 'pointer',
          width: width ?? 90,
          mx: 1,
          height: height ?? 90,
          backgroundColor: getRandomColorCode(),
        }}
        alt={username}
        src={src}
      />
    </Tooltip>
  )
}

export default UserAvatar
