import React from 'react'
import Typography from '@mui/material/Typography'

export interface IconCardButtonProps {
  icon: React.ReactNode
  text: string
  subtext?: string

  onClick?: () => void
}

const IconCardButton: React.FC<IconCardButtonProps> = (props) => {
  const { icon, text, subtext, onClick } = props
  return (
    <div
      onClick={onClick}
      className="tetx-center mx-5 my-5 flex h-[250px] w-[250px] cursor-pointer items-center justify-center rounded-md border-2 shadow-md hover:bg-sky-700 sm:my-0"
    >
      <div className="text-center">
        <span className="mx-auto text-white">{icon}</span>
        <Typography className="font-sans text-lg font-bold text-white">
          {text}
        </Typography>
        <Typography className="text-md font-sans font-bold text-sky-300 text-white">
          {subtext}
        </Typography>
      </div>
    </div>
  )
}

export default IconCardButton
