import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../../components/app-layout/AppLayout";
import { useState } from "react";
import Markdown from 'react-markdown';
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/db-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faCentSign, faHashtag, faQuestion } from "@fortawesome/free-solid-svg-icons";

export default function NewPost({}) {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generating, setGenerating] = useState();

  async function generateSubmitHandler(evt) {
    evt.preventDefault();
    setGenerating(true);

    try{
      const resp = await fetch('/api/generatePost', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          topic,
          keywords
        })
      });
      const json = await resp.json();
  
      if(json?.postid) {
        router.push(`/post/${json.postid}`);
      }
  
    } catch(e) {
      setGenerating(false);
    }
  }

  return <div 
    className="h-full overflow-hidden"
  >
    {
      generating && (
        <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl"/>
          <h6>Generating...</h6>
        </div>  
      )
    }
    {
      !generating && (
        <div className="w-full h-full flex flex-col overflow-auto">
          <form 
            onSubmit={generateSubmitHandler} className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
          >
            <div className="mb-4">
              <label htmlFor="topic">
                <strong>
                  Generate a blog post on the topic of:
                </strong>
              </label>
              <textarea 
                id="topic"
                className="resize-none border border-slate-500 w-full block mt-1 mb-1 px-4 py-2 round-sm"
                value={topic} 
                onChange={e => setTopic(e.target.value)}
                maxLength={150}
                required
              />
            </div>
            <div>
              <label htmlFor="keywords">
                <strong>
                  Targetting the following keywords:
                </strong>
              </label>
              <textarea
                id="keywords"
                className="resize-none border border-slate-500 w-full block mt-1 mb-1 px-4 py-2 round-sm" 
                value={keywords} 
                onChange={e => setKeywords(e.target.value)} 
                maxLength={150}
                required
              />
              <small className="block mb-2">
                Separate keywords with a comma
              </small>
            </div>
            <button type="submit" className="btn" disabled={!keywords.trim() || !topic.trim()}>Generate</button>
          </form>
        </div>
      )
    }

  </div>
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const appsideprops = await getAppProps(ctx);

    if(!appsideprops.tokens) {
      return {
        redirect: {
          destination: '/token-topup',
          permanent: false,
        }
      }
    }

    return {
      props: {
        ...appsideprops
      }
    }  
  }
});