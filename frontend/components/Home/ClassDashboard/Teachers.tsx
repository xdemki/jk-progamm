import socket from "@/lib/socket";
import { App, Avatar, Button, List, Select, Spin } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react"
import { CheckTeachers } from "./utils/check-teachers";
import { CloseCircleOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { FaPlus } from "react-icons/fa";

export default function Teachers(data) {
    const { data: session, status } = useSession()

    const [teachers, setTeachers] = useState([])
    const [classTeachers, setClassTeachers] = useState([])

    const [dataLoaded, setDataLoaded] = useState(false);
    const router = useRouter()

    const { modal, notification } = App.useApp()

    const newTeacherSelect = useRef < string | null > (null);

    useEffect(() => {
        if (status == 'authenticated' && session) {
            setDataLoaded(false)
            socket.emit('GetTeachers', session, (response: any) => {
                if (response.success) {
                    setTeachers(response.data)
                    const teacher_check = CheckTeachers(data.classData.teachers, response.data, data.classData.classId)
                    setClassTeachers(teacher_check);
                    setDataLoaded(true)
                } else {
                    router.push('/');
                }
            })
        }
    }, [status])

    return (
        <>
            <div className="p-4">
                <List
                    itemLayout="horizontal"
                    dataSource={classTeachers}
                    loading={!dataLoaded}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                title={<a href="https://ant.design">{item.username}</a>}
                                description={`${item.email}`}
                            />
                            {item.username !== session?.user.name && (
                                <Button
                                    type="dashed"
                                    className="border border-xl border-red-500"
                                    onClick={() => {
                                        modal.confirm({
                                            icon: null,
                                            title: 'Lehrer entfernen',
                                            content: `Möchtest du ${item.username} wirklich aus der Klasse entfernen?`,
                                            okText: 'Entfernen',
                                            okType: 'danger',
                                            cancelText: 'Abbrechen',
                                            onOk() {
                                                socket.emit('RemoveTeacher', { user: item.userId, class: data.classData.classId }, (response: any) => {
                                                    if (response.success) {
                                                        setClassTeachers(prev => prev.filter(t => t.userId !== item.userId));
                                                        notification.success({ message: `${item.username} wurde entfernt.` });
                                                    } else {
                                                        notification.error({ message: 'Fehler beim Entfernen des Lehrers.' });
                                                    }
                                                });
                                            }
                                        });
                                    }}
                                >
                                    <DeleteOutlined />
                                </Button>
                            )}
                        </List.Item>
                    )}
                />
                <div className="flex justify-center mt-2">
                    <Button onClick={() => {
                        modal.confirm({
                            icon: null,
                            closeIcon: <CloseCircleOutlined />,
                            closable: true,
                            title: 'Lehrer zur Klasse hinzufügen',
                            content: (
                                <>
                                    <label htmlFor="AddTeacherInput">Lehrer hinzufügen</label>
                                    <Select
                                        id="AddTeacherInput"
                                        onSelect={(value) => (newTeacherSelect.current = value)}
                                        className="w-full"
                                        size="middle"
                                        showSearch
                                        placeholder="Lehrer auswählen.."
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={teachers.filter(_element => !classTeachers.find(_y => _y.userId == _element.userId)).map((teacher, index) => ({
                                            value: teacher.userId || index,
                                            label: teacher.username
                                        }))}
                                    />
                                </>
                            ),
                            onCancel() {
                                newTeacherSelect.current = null
                            },
                            onOk() {
                                console.log(newTeacherSelect.current)
                                const select = newTeacherSelect.current;

                                if (select == null) {
                                    notification.error({ message: 'Kein Lehrer wurde ausgewählt' })
                                } else {
                                    socket.emit('AddTeacher', { user: select, class: data.classData.classId }, (response: any) => {
                                        if (response.success) {
                                            notification.success({ message: 'Du hast einen Lehrer zur Klasse hinzugefügt' });
                                            setClassTeachers([...classTeachers, response.data])

                                        } else {
                                            notification.error({ message: 'Es ist etwas Schiefgelaufen' });
                                        }
                                    })
                                }
                            }
                        })
                    }} className="justify-center w-[50%]"><PlusCircleOutlined /></Button>
                </div>
            </div>
        </>

    )
}