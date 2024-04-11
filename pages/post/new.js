import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../../components/app-layout/AppLayout";
import { useState } from "react";
import Markdown from 'react-markdown';

export default function NewPost({}) {
  // console.log('test::', test)
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');

  const [postContent, setPostContent] = useState();

  async function generateSubmitHandler(evt) {
    evt.preventDefault();
    // console.log('click handler')

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
    
    // console.log("RESULT::", json);
    setPostContent(json.post.postcontent);
  }

  return <div 
    className="px-2 max-w-3xl"
  >
    <form 
      onSubmit={generateSubmitHandler}
    >
      <div>
        <label htmlFor="topic">
          <strong>
            Generate a blog post on the topic of:
          </strong>
        </label>
        <textarea 
          id="topic"
          className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 round-sm"
          value={topic} 
          onChange={e => setTopic(e.target.value)}
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
          className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 round-sm" 
          value={keywords} 
          onChange={e => setKeywords(e.target.value)} 
        />
      </div>
      <button type="submit" className="btn">Generate</button>
    </form>

    <Markdown>
      {postContent}
    </Markdown>
  </div>
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired(
  () => {

    return {
      props: {}
    }  
  }
);