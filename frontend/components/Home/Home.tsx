import { Avatar, Button, notification, Tabs } from "antd";
import { signOut, useSession } from "next-auth/react"
import { LogoutOutlined } from '@ant-design/icons'
import type { TabsProps } from "antd";
import ClassTab from "./tabs/ClassTab";
import SubjectTab from "./tabs/SubjectTab";
import Header from "../Header";
import { FaPeopleCarry } from "react-icons/fa";
import StudentTab from "./tabs/StudentTab";

export default function Home() {
    const { data: session } = useSession();
    const [api, contextHolder] = notification.useNotification()

    const items: TabsProps['item'] = [
        {
            key: '1',
            label: 'Klassen',
            children: <ClassTab />
        },
        {
            key: '2',
            label: 'Fächer',
            children: <SubjectTab />
        },
        {
            key: '3',
            label: 'Schüler',
            children: <StudentTab />,
        }
        
        
    ]
    return (
        <>
            <Header withBackBtn={false} />
            <Tabs className="w-full h-auto" defaultActiveKey="1" items={items} />
        </>
    )
}