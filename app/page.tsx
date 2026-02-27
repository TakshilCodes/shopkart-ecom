import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { email, uuid } from "zod";

export default async function Home() {

  const session = await getServerSession()

  if(!session?.user.id){
    redirect('/signup')
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div>
          {session.user.email}
        </div>
      </main>
    </div>
  );
}
