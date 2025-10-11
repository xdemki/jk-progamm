import { SettingOutlined } from "@ant-design/icons"
import { Button, Typography } from "antd"
import { FaPlus } from "react-icons/fa";
const {Title} = Typography;

export default function SubjectTab() {
    const subjects = [
        { name: 'Mathe', color: 'red' },
        { name: 'Deutsch', color: 'blue' },
        { name: 'Naturwissenschaften', color: 'green' },
    ];

    const colorClasses: Record<string, string> = {
        red: 'bg-red-500 hover:bg-red-600 border-red-500',
        blue: 'bg-blue-500 hover:bg-blue-600 border-blue-500',
        green: 'bg-green-500 hover:bg-green-600 border-green-500',
    };

    return (
        <div className="flex items-center p-6">
            <div className="flex flex-wrap justify-center gap-6">
                {subjects.map((cls, index) => (
                    <div
                        key={index}
                        className={`
                            ${colorClasses[cls.color]} 
                            text-white font-semibold
                            px-6 py-4 rounded-2xl border
                            shadow-md hover:shadow-lg
                            transition-all duration-300 
                            cursor-pointer select-none
                            transform hover:-translate-y-1
                        `}
                    >
                        {cls.name}
                    </div>
                ))}
                <div
                        className={`
                            bg-gray-600
                            text-white font-semibold
                            px-6 py-4 rounded-2xl border
                            shadow-md hover:shadow-lg
                            transition-all duration-300 
                            cursor-pointer select-none
                            transform hover:-translate-y-1
                        `}
                    >
                        <FaPlus />
                </div>
            </div>
        </div>
    );
}

// export default function SubjectTab() {
    
//     const subjects = [
//         {
//             name: 'Mathe',
//             color: 'rgb(220, 38, 38)',
//             calculations: ''
//         },
//         {
//             name: 'Deutsch',
//             color: 'rgb(37, 99, 235)',
//             calculations: ''
//         },
//         {
//             name: 'Naturwissenschaften',
//             color: 'rgb(22, 163, 74)',
//             calculations: ''
//         }
//     ]

//     return (
//         <div className="flex bg-gray-50 p-4">
//             <div className="w-full flex justify-center">
//                 <div className="flex flex-wrap justify-center align-items gap-5 ">
//                     {subjects.map((cls, index) => (
//                         <div
//                             key={index}
//                             className={`bg-`+cls.color+` border border-lg px-4 py-2 rounded-md`}
//                         >
//                             <Title level={3} className="text-bold text-lg">{cls.name}</Title>
//                             <div className="flex items-center justify-center">
//                                 <Button size="large" type="default" ><SettingOutlined /></Button>
//                             </div>
//                         </div>
//                     ))}

//                 </div>
//             </div>
//         </div>
//     )
// }