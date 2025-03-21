import React from 'react'
import { NavbarDefault } from '../components/Navbar'
import Backgroung from '../components/Backgroung'

function Home() {
    return (
        <div className='flex flex-col gap-10'>
            <div className=''>
                <NavbarDefault />
            </div>
            <div className='flex flex-row mx-48 justify-between items-center'>

                <div className='flex flex-col gap-6 w-1/3'>
                    <p className='text-7xl text-black'>Vaani is not just a tool, it's a community. </p>
                    <a className='text-3xl text-font'>Live Translation at Your Fingertips—Transform Signs into Words!</a>
                    <div className='flex  '>
                        <button href="" className='bg-primary text-white rounded-2xl px-10 py-4 text-xl font-bold'>Get Started Now!</button>
                    </div>
                </div>

                <div className='flex w-1/2'>


                    <dotlottie-player src="https://lottie.host/81717c04-b81e-49e5-b5a2-fd507dc4a805/vvyAb4YGPI.json"
                        background="transparent" speed="1" loop autoplay></dotlottie-player>
                </div>

            </div>
        </div>
    )
}

export default Home
