import { useCallback } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'

import Particles from 'react-tsparticles'
import { styled } from '@mui/material/styles'
import Navbar from 'components/Navbar'

import Footer from 'components/Footer'

const CardContainerStyled = styled('div')(({ theme }) => ({
  width: '310px',
  height: '100px',
  margin: 'auto',
  maxWidth: '310px',
  padding: '0',
  borderRadius: '10px',
  border: '1px solid white',
  // background: theme.palette.common.white,
}))

const Lobby: NextPage = () => {
  const router = useRouter()

  const redirectToPage = useCallback(
    (path: string) => router.push(path),
    [router]
  )

  return (
    <main className="min-h-screen justify-center bg-[#18181b] p-5">
      {/* @ts-ignore */}
      <Particles
        style={{ zIndex: -1, opacity: '0.5' }}
        id="tsparticles"
        url="https://raw.githubusercontent.com/VincentGarreau/particles.js/master/demo/particles.json"
      />

      <Navbar />
      <div className="absolute flex h-[90vh] w-[95vw] items-center">
        <div className="relative m-auto flex w-[1030px]">
          <CardContainerStyled className="cursor-pointer shadow-xl hover:bg-sky-700">
            <div className="m-auto w-[310px] p-0">
              <p className="text-center text-white">Google SignIn</p>
            </div>
          </CardContainerStyled>
          <div className="absolute left-[300px] top-[-30px]">
            <Image
              src={'/arrow-1-white.svg'}
              alt="arrow image"
              width="100px"
              height="100px"
            />
          </div>
          <CardContainerStyled className="cursor-pointer shadow-xl hover:bg-sky-700">
            <div className="m-auto w-[310px] p-0">
              <p className="text-center text-white">Select Friends</p>
            </div>
          </CardContainerStyled>
          <div className="absolute left-[651px] bottom-[-45px]">
            <Image
              src={'/arrow-2-white.svg'}
              alt="arrow image"
              width="100px"
              height="100px"
            />
          </div>
          <CardContainerStyled className="cursor-pointer shadow-xl hover:bg-sky-700">
            <div className="m-auto w-[310px] p-0">
              <p className="text-center text-white">/Dashboard</p>
            </div>
          </CardContainerStyled>
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default Lobby
