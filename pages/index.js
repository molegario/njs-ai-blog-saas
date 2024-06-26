import Link from 'next/link';
import Image from 'next/image'
import bgImg from '../public/hero.webp'
import Logo from '../components/Logo/Logo';
// import { useUser } from '@auth0/nextjs-auth0/client'
export default function Home() {
  // const { user } = useUser();
  // console.log('user::', user)
  return <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">

    <Image src={bgImg} alt='hero' fill className='absolute'/>
    <div
      className='relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm'
    >
      <Logo />
      <p className='text-lg text-justify pb-4'>An AI-powered SAAS solution to generate SEO-optimized blog posts in minutes.  Get high-quality content, without sacrificing your time.</p>
      <Link href='/post/new' className='btn'><span>Begin</span></Link>
    </div>

  </div>;
}
