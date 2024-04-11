import { useRouter } from "next/router"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

export default function PostReview() {
  const router = useRouter();
  const { postid } = router.query;
  return <div>
    <h1>Post Review {postid}</h1>
  </div>
}

export const getServerSideProps = withPageAuthRequired(
  () => {

    return {
      props: {}
    }  
  }
);