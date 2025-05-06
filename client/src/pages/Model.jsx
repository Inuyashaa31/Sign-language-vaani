import React from 'react'
import { useAuth } from "../AuthContext";
import { NavbarDefault } from '../components/Navbar'

function Model() {

  const { currentUser } = useAuth();
  return (
    <div>
      <NavbarDefault />
      <div className='flex flex-row mx-20 mt-20 justify-evenly items-center'>
        <div className='flex flex-col gap-12 w-1/2 '>
          <a className='text-5xl'>Would you like to take the Tutorial?</a>
          <p className='text-3xl'>We can guide you through using the Sign Language Detection System step by step. Or, you can skip it and start right away!</p>
          <div className='flex flex-row mx gap-8 py-10'>
            {!currentUser ? (
              <>
                <a href="/login" className='text-4xl text-white rounded-2xl border bg-sky-600 px-10 py-2'><span>Take Tutorial</span></a>
                <a href="/login" className='text-4xl text-white rounded-2xl border bg-sky-600 px-10 py-2'><span>Skip</span></a>
              </>
            ) : (
              <>
                <a href="/tutorial" className='text-4xl text-white rounded-2xl border bg-sky-600 px-10 py-2'><span>Take Tutorial</span></a>
                <a href="/letstry" className='text-4xl text-white rounded-2xl border bg-sky-600 px-10 py-2'><span>Skip</span></a>
              </>
            )}
          </div>
        </div>
        <div className='flex '>
          <dotlottie-player src="https://lottie.host/d0db1ff5-4fb4-4fd9-afd7-51ea89b3792d/5Rr57YXvkM.json"
            background="transparent"
            speed="1"
            loop autoplay
          ></dotlottie-player>
        </div>
      </div>
    </div>
  )
}

export default Model
