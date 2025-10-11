'use client'
import Header from "@/components/Header"
import Teachers from "@/components/Home/ClassDashboard/Teachers";
import socket from "@/lib/socket";
import { App, Divider, Flex, message, Spin, Splitter, Transfer, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
const { Title } = Typography

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
    <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
            {props.text}
        </Typography.Title>
    </Flex>
);

export default function page() {
    const { id } = useParams()
    const { message, notification } = App.useApp();
    const [classData, setClassData] = useState({});
    const [loading, setloading] = useState(true)
    const router = useRouter()
    const {data: session, status} = useSession()

    if(!session || status !== 'authenticated') { router.push('/') }

    useEffect(() => {
        socket.emit('GetClassData', { id: id }, (response: any) => {
            if (response.success) {
                setClassData(response.data);
                notification.success({ message: `Klasseninfo geladen!`, closable: false })
                setloading(false)
            } else {
                notification.error({ message: `Es ist ein Fehler aufgetreten!`, closable: false })
                router.push('/')
            }
        })
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Spin size="large" />
            </div>
        )
    }

    const sizes = ['50%', '20%', '50%'];


    return (
        <>
            <div className="p-4">
                <Header withBackBtn={true} />
            </div>
            <br />
            <div>
                <Title level={2} mark className="text-center" underline>Detailansicht | {classData?.name}</Title>
                <Divider dashed />
                <Splitter className="min-h-full">
                    <Splitter.Panel defaultSize="40%" min="20%" max="70%" resizable={true}>
                        <Typography.Title type="secondary" className="text-center" level={5} style={{ whiteSpace: 'nowrap' }}>
                            Leherer
                        </Typography.Title>

                        <Teachers classData={classData} />
                    </Splitter.Panel>
                    <Splitter.Panel defaultSize={sizes[1]}>
                        <Typography.Title type="secondary" className="text-center" level={5} style={{ whiteSpace: 'nowrap' }}>
                            Schüler
                        </Typography.Title>
                    </Splitter.Panel>
                </Splitter>

            </div>

        </>
    )
}