// const POSTS_FETCH_SIZE = 8;
import Link from 'next/link';
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import Logo from '../Logo/Logo';
import { useContext, useEffect } from 'react';
import PostsContent from '../../context/posts-context';

export default function AppLayout({children, posts: postsFromSSR, tokens, currentpostid, currentpostcreated}) {
  const { user } = useUser();
  const {setPostsFromSSR, posts, getMorePosts, nomoreposts} = useContext(PostsContent);

  useEffect(
    () => {
      if(currentpostid) {
        const isInFrame = postsFromSSR.map(yy=>yy._id).includes(currentpostid);
        if(!isInFrame) {
          getMorePosts({
            created: currentpostcreated,
            isRefresh: true,
          });
        }
      } 
      setPostsFromSSR(postsFromSSR);
    },
    [setPostsFromSSR, postsFromSSR, currentpostid, currentpostcreated, getMorePosts]
  );

  return <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
    <div className="flex flex-col text-white overflow-hidden">
      <div className="bg-slate-800 px-2">
        <div><Logo /></div>
        <Link className="btn" href='/post/new'><span className='block'>New Post</span></Link>
        <Link href='/token-topup' className='block mt-2 text-center'>
          <FontAwesomeIcon icon={faCoins} className='text-yellow-500' />
          <span className='pl-1'>{tokens ? tokens : 0} Tokens Available</span>
        </Link>
        <h2>Your content</h2>
      </div>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to bg-cyan-800 p-2">
        <ul>
          {
            posts?.length === 0 && (
              <li className='text-center'>-no posts available-</li>
            )
          }
          {
            posts?.map(uu=><li key={uu._id}>
              <Link 
                href={`/post/${uu._id}`}
                className={`border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap 
                my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${currentpostid === uu._id ? "bg-white/20 border-white/100" : ""}`}
                alt={uu.posttitle}
              >
                {uu.posttitle}
              </Link>
            </li>)
          }
        </ul>
        {
          !nomoreposts &&
          <div onClick={()=>{
            getMorePosts(posts.toReversed()?.[0]);
          }} className='text-center w-full text-sm text-slate-400 cursor-pointer mt-4'>load more posts</div>
        }
      </div>
      <div className="bg-cyan-800 flex overflow-hidden items-center gap-2 border-t border-t-black/50 h-20 px-2">
        {
          !!user ? <>
            <div className='min-width-[50px] flex-shrink-0'>
              <Image 
                src={user.picture}
                width={50}
                height={50}
                alt='user picture'
                className='rounded-full'
              />
            </div>
            <div className='flex flex-col flex-1 overflow-hidden'>
              <div className='font-bold text-ellipsis overflow-hidden whitespace-nowrap'>{user.email}</div>
              <Link className='text-sm' href='/api/auth/logout'>Logout</Link>
            </div>
          </> : <Link href='/api/auth/login'>Login</Link>
        }
      </div>
    </div>
    {children}
  </div>
}