import Link from 'next/link';
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import Logo from '../Logo/Logo';



export default function AppLayout({children}) {
  const { user } = useUser();
  console.log('user::', user)



  return <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">


    <div className="flex flex-col text-white overflow-hidden">
      <div className="bg-slate-800 px-2">
        <div><Logo /></div>
        <Link className="btn" href='/post/new'><span className='block'>New Post</span></Link>
        <Link href='/token-topup' className='block mt-2 text-center'>
          <FontAwesomeIcon icon={faCoins} className='text-yellow-500' />
          <span className='pl-1'>0 Tokens Available</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to bg-cyan-800">
        lists of posts
      </div>
      <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">

        {


          !!user ? <>
            <div className='min-width-[50px]'>
              <Image 
                src={user.picture}
                width={50}
                height={50}
                alt='user picture'
                className='rounded-full'
              />
            </div>
            <div className='flex-1 '>
              <div className='font-bold'>{user.email}</div>
              <Link className='text-sm' href='/api/auth/logout'>Logout</Link>

            </div>
          </> : <Link href='/api/auth/login'>Login</Link>
        }




        {/* user info - logout */}
      </div>
    </div>
    <div className="">
      {children}
    </div>



  </div>
}