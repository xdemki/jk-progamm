import { useSession } from "next-auth/react"

export default function Home() {
    const {data: session} = useSession();

    return (
        <h1>Hallo {session.user.name}</h1>
    )
}