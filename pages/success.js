import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import AppLayout from "../components/app-layout/AppLayout"
import { getAppProps } from "../utils/db-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link'

export default function Success() {
  return <div className="w-full h-full flex flex-col overflow-auto">
    <div className="m-auto max-w-screen-sm text-center">
      <FontAwesomeIcon icon={faCoins} className="text-yellow-500 text-8xl animate-bounce" />
      <h1>Thank you for purchasing 10 tokens.</h1>
      <Link className="text-2xl" href='/post/new'>Start generating original content now !!!</Link>
    </div>
  </div>
}

Success.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const appsideprops = await getAppProps(ctx);

    return {
      props: {
        ...appsideprops
      }
    }  
  }
});