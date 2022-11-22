export interface User {
  username: string
  displayPicture: string
  platform: string
  joinedAt: Date
  isConnected: boolean
  socketId: string
}

export interface IncomingCall {
  from: string
  user: User
  offer: RTCSessionDescriptionInit
}
