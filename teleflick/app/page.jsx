import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerSession(options);

  if (!session) {
    return <p> Hello, you're not signed in</p> ;
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Hello {session?.user?.email}</p>
    </div>
  )
}

export default Home;