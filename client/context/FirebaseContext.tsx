import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase'

export interface FirebaseContext {
  currentUser: User | null
  signinWithGooglePopup: (options?: { redirectTo?: string }) => Promise<any>
}

const FirebaseContext = createContext<FirebaseContext | null>(null)

export const useFirebase = () => {
  const state = useContext(FirebaseContext)
  if (state !== null && !state)
    throw new Error('Wrap useFirebase hook inside FirebaseProvider')
  return state
}

const googleAuthProvider = new GoogleAuthProvider()

export const FirebaseProvider: React.FC = (props) => {
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleOnAuthStateChange = useCallback(
    (e: User | null) => setCurrentUser(e),
    []
  )

  const signinWithGooglePopup = useCallback(
    async (options?: { redirectTo?: string }) => {
      const result = await signInWithPopup(auth, googleAuthProvider)
      if (result.user) {
        if (options && options.redirectTo)
          return router.replace(options.redirectTo)
      }
      return result
    },
    []
  )

  useEffect(() => {
    const unsubscribeAuthStateChange = onAuthStateChanged(
      auth,
      handleOnAuthStateChange
    )
    return () => {
      unsubscribeAuthStateChange()
    }
  }, [])

  return (
    <FirebaseContext.Provider value={{ signinWithGooglePopup, currentUser }}>
      {props.children}
    </FirebaseContext.Provider>
  )
}

export const handleLogout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
