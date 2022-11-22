import React from 'react'
import {
  AiOutlineWindows,
  AiOutlinePicture,
  AiOutlineVideoCamera,
  AiOutlineFilePdf,
  AiOutlineCodeSandbox,
} from 'react-icons/ai'

export interface FileIconProps {
  fileName: string
}

const FileIcon: React.FC<FileIconProps> = (props) => {
  const { fileName } = props
  const fileExt = fileName.split('.').at(-1)

  switch (fileExt?.toLowerCase()) {
    case 'exe':
      return <AiOutlineWindows />
    case 'png':
    case 'jpeg':
    case 'jpg':
      return <AiOutlinePicture />
    case 'mp4':
    case 'wav':
    case 'WMV':
    case 'MKV':
    case 'AVI':
    case 'WEBM':
      return <AiOutlineVideoCamera />
    case 'pdf':
      return <AiOutlineFilePdf />
    case 'js':
    case 'html':
    case 'css':
    case 'c':
    case 'c++':
    case 'java':
    case 'bash':
    case 'php':
    case 'yml':
    case 'json':
      return <AiOutlineCodeSandbox />
  }
  return <></>
}

export default FileIcon
