import React, { useCallback, useState } from 'react';
const PostsContext = React.createContext({});

export default PostsContext;

function compareDates(a,b) {
  const a_created = new Date(a.created);
  const b_created = new Date(b.created);

  if(a_created < b_created) {
    return 1;
  } else if(a_created > b_created) {
    return -1;
  } else {
    return 0;
  }
}

export const PostsContextProvider = ({children}) => {
  const [posts, setPosts] = useState([]);
  const [nomoreposts, setNomoreposts] = useState(false)

  //for init only
  const setPostsFromSSR = useCallback(
    (postsFromSSR = []) => {
      setPosts(prev=>{
        const updated = [...prev];
        postsFromSSR.forEach(
          ssr=>{
            if(
              !prev.map(ttt=>ttt._id).includes(ssr._id)
            ) {
              updated.push(ssr);
            }
          }
        );

        return updated.sort(compareDates);
      });
    },
    []
  );

  const removeDeletedPostFromTracked = useCallback(
    (postid) => {
      setPosts(prev=>prev.filter(xx=>xx._id!==postid))
    },
    [setPosts]
  );

  const getMorePosts = useCallback(
    async ({created:lastCreatedDate, isRefresh=false}={}) => {

      const nextPostsResp = await fetch('/api/getPosts', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastCreatedDate,
          isRefresh
        })
      });
      const nextPostsJson = await nextPostsResp.json();

      if(nextPostsJson?.posts.length > 0) {
        setNomoreposts(false);
        setPosts(prev=>{
          const updatedPosts = [
            ...prev
          ];
          nextPostsJson.posts.forEach(post => {
            if(!prev.map(uu=>uu._id).includes(post._id)) {
              updatedPosts.push(post)
            }
          });
          return updatedPosts;
        });  
      } else {
        setNomoreposts(true);
      }
    },
    [ setPosts ]
  );

  return <PostsContext.Provider value={{
    posts,
    setPostsFromSSR,
    getMorePosts,
    nomoreposts,
    removeDeletedPostFromTracked,
  }}>{children}</PostsContext.Provider>
}