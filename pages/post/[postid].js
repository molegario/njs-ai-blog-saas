import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import Markdown from 'react-markdown';
import AppLayout from "../../components/app-layout/AppLayout";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { getAppProps } from "../../utils/db-utils";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import PostsContext from "../../context/posts-context";

export default function Post({
  postcontent,
  posttitle,
  metadescription,
  keywords,
  currentpostid
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const { removeDeletedPostFromTracked } = useContext(PostsContext);
  const customRenderers = {
    p(paragraph) {
      const { node } = paragraph;
      if(node.children[0].tagName === 'img') {
        const image = node.children[0];
        return <div className={classes.image}>
          <Image 
            src={`https://olegario-nextjs-projects-bucket.s3.ca-central-1.amazonaws.com/${image.properties.src}`}
            alt={image.alt}
            width={600}
            height={300}          
          />
        </div>;
      }
      return <p>{paragraph.children}</p>
    },
    code(code) {
      const { className, children } = code;
      const language = className.split('-')[1];
      return <SyntaxHighlighter 
          style={atomDark}
          language={language}
          children={children}
        />;
    },
  };

  const handleDelete = async () => {
    const respDelete = await fetch('/api/deletePost', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postid: currentpostid
      })
    });

    const jsonDelete = await respDelete.json();

    if(jsonDelete.success) {
      removeDeletedPostFromTracked(currentpostid)
      router.push('/post/new');
    }
  };

  return <div className="overflow-auto h-full">
    <div
      className="max-w-screen-sm mx-auto"
    >
      <div className="text-sm font-bold mt-6 p-2 pt-3 mb-3 bg-stone-200 rounded-sm">
        SEO title and meta description
      </div>
      <div className="p-4 my-2 border border-stone-200 rounded-md">
        <div className="text-blue-600 text-2xl font-bold ">{posttitle}</div>
        <div className="mt-2 ">{metadescription}</div>
      </div>
      <div className="text-sm font-bold mt-6 p-2 pt-3 mb-3 bg-stone-200 rounded-sm">
        Keywords
      </div>
      <div>
        <div className="flex flex-wrap pt-2 gap-1 ">
        {keywords.split(',')
          .map((keyword,idx)=><div 
            key={`keyword-${idx}`}
            className="p-2 rounded-full bg-slate-800 text-white"
          >
            <FontAwesomeIcon icon={faHashtag} />{keyword}
          </div>)}
        </div>
      </div>

      <div className="text-sm font-bold mt-6 p-2 pt-3 mb-3 bg-stone-200 rounded-sm">
        Blog Post
      </div>
      <Markdown components={customRenderers}>
        {postcontent || ""}
      </Markdown>
      <div className="my-4">
        {
          !showDeleteConfirm && 
          <button className="btn bg-red-600 hover:bg-red-700" onClick={()=>setShowDeleteConfirm(true)}>Delete Post</button>
        }
        {
          showDeleteConfirm && <div className="">
            <p className="p-2 bg-red-300 text-center">Are you sure you want to delete this post? This action is irreversible.</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn bg-stone-600 hover:bg-stone-700" onClick={()=>{
                setShowDeleteConfirm(false);
              }}>Cancel</button>
              <button className="btn bg-red-600 hover:bg-red-700 animate-pulse" onClick={handleDelete}>Click to Confirm Deletion</button>
            </div>
        </div>
        }
      </div>
    </div>
  </div>
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired(
  {
    async getServerSideProps(ctx) {
      const {params, req, res} = ctx;

      //get user session for Auth0Id
      const userSession = await getSession(req, res);
      
      //get db
      const client = await clientPromise;
      const db = client.db('njsblogsaas');
      const appsideprops = await getAppProps(ctx);

      //find user record from auth0Id to get user._id
      const user = await db.collection('users').findOne({
        auth0Id: userSession.user.sub
      });

      //find post that match navigated id and userid
      const post = await db.collection('posts').findOne({
        _id: new ObjectId(ctx.params?.postid),
        userId: user._id,
      })

      if(!post) {
        return {
          redirect: {
            destination: '/post/new',
            permanent: false
          }
        };
      }

      return {
        props: {
          postcontent: post.postcontent,
          posttitle: post.posttitle,
          metadescription: post.metadescription,
          keywords: post.keywords,
          ...appsideprops,
          currentpostid: ctx.params?.postid || null,
          currentpostcreated: post.created.toString(),
        }
      };
    }
  }
);