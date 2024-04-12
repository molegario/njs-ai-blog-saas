import React, { useCallback, useReducer, useState } from 'react';
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

function postsReducer(state, action) {
  switch(action.type) {
    case 'addPosts': {
      const updated = [...state];
      action.posts.forEach(
        ssr=>{
          if(
            !state.map(ttt=>ttt._id).includes(ssr._id)
          ) {
            updated.push(ssr);
          }
        }
      );
      return updated.sort(compareDates);
    }
    case 'deletePost': {
      return state.filter(xx=>xx._id!==action.postid);
    }
    default:
      return state;
  }
}

export const PostsContextProvider = ({children}) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [nomoreposts, setNomoreposts] = useState(false)

  //for init only
  const setPostsFromSSR = useCallback(
    (postsFromSSR = []) => {
      dispatch({
        type: "addPosts",
        posts: postsFromSSR,
      });
    },
    []
  );

  const removeDeletedPostFromTracked = useCallback(
    (postid) => {
      dispatch({
        type: "deletePost",
        postid,
      })
    },
    []
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
        dispatch({
          type: "addPosts",
          posts: nextPostsJson.posts
        });
      } else {
        setNomoreposts(true);
      }
    },
    [ setNomoreposts ]
  );

  return <PostsContext.Provider value={{
    posts,
    setPostsFromSSR,
    getMorePosts,
    nomoreposts,
    removeDeletedPostFromTracked,
  }}>{children}</PostsContext.Provider>
}