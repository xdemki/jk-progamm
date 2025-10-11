import socket from "@/lib/socket";
import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Divider, Input, List, Select, DatePicker } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export default function StudentTab() {
    const { modal, notification } = App.useApp()

    const { data: session, status } = useSession()
    const [dataLoaded, setDataLoaded] = useState(false);
    const router = useRouter()
    const [classes, setClasses] = useState([])

    let fName = useRef < string | null > (null);
    let lName = useRef < string | null > (null);
    let email = useRef < string | null > (null);
    let classId = useRef < string | null > (null);
    let birthday = useRef < string | null > (null);

    useEffect(() => {
        if (status == 'authenticated' && session) {
            setDataLoaded(false)
            socket.emit('GetClasses', session, (response: any) => {
                if (response.success) {
                    setClasses(response.data)
                    setDataLoaded(true)
                } else {
                    router.push('/');
                }
            })
        }
    }, [status])

    return (
        <>
            <div>
                <Button
                    onClick={() => {
                        modal.confirm({
                            width: 1000,
                            title: 'Schülerprofil erstellen',
                            centered: true,
                            icon: null,
                            onOk() {
                                let _data = {fName, lName, email, birthday, classId}
                                console.log(_data)
                            },
                            content: (
                                <>
                                    <div className="p-4 m-4">
                                        <div className="flex items-center gap-4 flex-2">
                                            <label htmlFor="fName" className="font-semibold text-gray-700">Vorname</label>
                                            <br />
                                            <Input
                                                id="fName"
                                                onChange={(e) => (fName.current = e.target.value)}
                                                placeholder="Vorname" />
                                            <label htmlFor="lName" className="font-semibold text-gray-700">Nachname</label>
                                            <br />
                                            <Input
                                                onChange={(e) => (lName.current = e.target.value)}
                                                id="lName"
                                                placeholder="Nachname" />
                                        </div>

                                        <br />
                                        <label htmlFor="birthday" className="font-semibold text-gray-700">Geburtsdatum</label>
                                        <br />
                                        <DatePicker
                                            id="birthday"
                                            onChange={(e) => console.log(e.toDate().getTime().toString())}
                                            format="DD.MM.YYYY"
                                            placeholder="Geburtstag auswählen"
                                            style={{ width: 200 }}
                                        />
                                        <Divider dashed />
                                        <div className="flex items-center gap-4">
                                            <label htmlFor="email"  className="font-semibold text-gray-700">Email</label>
                                            <Input
                                                id="email"
                                                placeholder="example@gmail.com"
                                                onChange={(e) => (email.current = e.target.value)} />

                                            <label htmlFor="classSelect" className="font-semibold text-gray-700">Klasse auswählen</label>
                                            <Select
                                                id="classSelect"
                                                onSelect={(value) => (classId.current = value)}
                                                className="w-full"
                                                size="middle"
                                                showSearch
                                                placeholder="Klasse auswählen.."
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={classes.map((teacher, index) => ({
                                                    value: teacher.classId || index,
                                                    label: teacher.name
                                                }))}
                                            />
                                        </div>
                                    </div>
                                </>
                            )
                        });
                    }}
                >
                    <PlusOutlined /></Button>
            </div>
            <List

            />
        </>
    )
}