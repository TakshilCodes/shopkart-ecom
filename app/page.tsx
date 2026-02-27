import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await getServerSession(authOptions)

  if(!session?.user.id){
    redirect('/signin')
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div>
          {session.user.email}
        </div>
        <LogoutButton/>
      </main>
    </div>
  );
}
