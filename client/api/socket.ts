import { io } from 'socket.io-client'

export const socket = io(process.env.NEXT_PUBLIC_SERVER_API_URL as string)
