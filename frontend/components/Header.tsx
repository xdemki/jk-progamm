import socket from "@/lib/socket";
import { BackwardFilled, LogoutOutlined, UserOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import { App, Avatar, Button, Typography } from "antd"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaRemoveFormat } from "react-icons/fa";

export default function Header({ withBackBtn }: { withBackBtn?: boolean }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { modal } = App.useApp();
    return (
        <>
            {withBackBtn && (
                <div className="header float-left flex gap-3">
                    <Button
                        onClick={() => router.push('/')}
                        size="large" shape="circle"
                        color='red'
                        className="border-red-50 bg-red-50">
                        <ArrowLeftOutlined color="red" />
                    </Button>
                </div>
            )}

            <div className="header float-right flex gap-3">
                <Avatar onClick={() => {
                    modal.info({
                        type: 'success',
                        title: "Profil",
                        content: (
                            <>
                                <div className="flex items-center gap-4">
                                    <Avatar size={'large'}><UserOutlined /></Avatar>
                                    <div>
                                        <p >Nutzername: {session?.user.name}</p>
                                        <p >Email: {session?.user.email}</p>
                                    </div>
                                </div>
                            </>
                        )
                    })
                }} size={'large'} shape={'circle'} className="select-none hover:cursor-pointer">
                    <UserOutlined />
                </Avatar>
                <Button
                    onClick={() => signOut()}
                    size="large" shape="circle"
                    color='red'
                    className="border-red-50 bg-red-50">
                    <LogoutOutlined color="red" />
                </Button>
            </div>
        </>
    )
}