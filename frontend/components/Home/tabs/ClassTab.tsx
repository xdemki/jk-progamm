import socket from "@/lib/socket";
import { App, Input, Spin, Transfer } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react"
import { FaCoins, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ClassTab() {
    const { data: session, status } = useSession()
    const [classes, setClasses] = useState < any[] > ([]);
    const newClassName = useRef < string | null > (null);
    const { message, modal, notification } = App.useApp()
    const [teachers, setTeachers] = useState < any[] > ([{ name: 'Lehrer 1' }, { name: 'Lehrer 1' }]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (session && status === 'authenticated') {
            socket.emit('GetClasses', session, (response) => {
                if (response.success) {
                    setClasses(response.data);
                    setLoading(false)
                    notification.info({ message: response.data.length + ' Klassen wurden geladen!' });
                } else {
                    notification.error({ message: 'Es konnten keine Klassen geladen werden!' });
                }
            });
        }
    }, [session, status]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div className="flex p-4">
            <div className="w-full flex justify-center">
                <div className="flex flex-wrap justify-center gap-4 ">
                    {classes.map((cls, index) => (
                        <div onClick={() => {
                            router.replace('/classes/' + cls.classId)
                        }} key={index} className="bg-gray-200 w-64 rounded  hover:cursor-pointer border border-xl border-black-200" >
                            <h3 className="font-bold text-center text-lg">{cls.name}</h3>
                            <div className="flex items-center justify-center gap-2">
                                <h3 className="text-center">{cls.students.length} Schüler</h3>
                                |
                                <h3 className="text-center">{cls.teachers.length} Lehrer</h3>
                            </div>
                        </div>
                    ))}
                    <div onClick={() => {
                        // Klasse erstellen
                        modal.confirm({
                            type: 'success',
                            title: "Neue Klasse erstellen",
                            content: (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="newClassInput" className="font-semibold text-gray-700">Klassename</label>
                                    <Input
                                        id="newClassInput"
                                        placeholder="Name der Klasse"
                                        onChange={(e) => (newClassName.current = e.target.value)} />
                                </div>


                            ),
                            onOk() {
                                if (!newClassName.current) {
                                    message.error("Bitte einen Klassennamen eingeben.");
                                    return Promise.reject(); // Prevents the modal from closing
                                }

                                socket.emit('createClass', { username: session.user.name, newClassName }, (response) => {
                                    if (response.success) {
                                        message.success({ content: 'Du hast eine neue Klasse erstellt!' })
                                        socket.emit('GetClasses', session, (response) => {
                                            if (response.success) {
                                                setClasses(response.data);
                                                message.success({ content: `Du hast die Klasse "${newClassName.current}" erstellt!` });
                                            } else {
                                                message.error('Es konnten keine Klassen geladen werden!');
                                            }
                                        });
                                    } else {
                                        message.error("Etwas ist schiefgelaufen. Versuche es erneuert");
                                    }
                                })
                            },
                        })
                    }} className="text-white p-4 rounded w-64 text-center select-none hover:cursor-pointer shadow-lg transition-transform hover:scale-105 hover:shadow-2xl border 
                                border-[#232946] gap-2 rounded">
                        <FaPlus className="m-auto hover:scale-110 cursor-pointer text-color-white" size={35} color="gray" />
                    </div>
                </div>
            </div>
        </div>
    )
}