import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { MdGroups, MdGroup } from 'react-icons/md'
import Particles from 'react-tsparticles'

import Navbar from 'components/Navbar'
import IconCardButton from 'components/IconCardButton'
import Footer from 'components/Footer'

const Homepage: NextPage = () => {
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
      <div className="absolute w-[95vw]">
        <div className="flex min-h-[80vh] flex-col items-center justify-center sm:flex-row">
          <IconCardButton
            onClick={() => redirectToPage('/p2p')}
            text="Connect Peer 2 Peer"
            subtext="Fast & Secure"
            icon={<MdGroup style={{ display: 'unset' }} fontSize={100} />}
          />
          {/* <IconCardButton
            onClick={() => redirectToPage('/room')}
            text="Connect Group"
            subtext="Slower"
            icon={<MdGroups style={{ display: 'unset' }} fontSize={100} />}
          /> */}
        </div>

        <Footer />
      </div>
    </main>
  )
}

export default Homepage
