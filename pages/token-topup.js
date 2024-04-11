import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import AppLayout from "../components/app-layout/AppLayout"

export default function TokenTopup() {


  const handleClick = async () => {
    await fetch()
  }

  return <div>
    <h1>Token topup Page</h1>

    <button className="btn" onClick={handleClick}>Add tokens</button>










  </div>
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}


export const getServerSideProps = withPageAuthRequired(
  () => {

    return {
      props: {}
    }  
  }
);