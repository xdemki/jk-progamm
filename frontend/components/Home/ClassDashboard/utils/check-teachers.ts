export function CheckTeachers(classTeachers: any, teachers: any, classId: string) {
    var arr = []

    classTeachers.forEach((teacher: string) => {
        const _t = teachers.find((element: any) => element.userId == teacher);
        
        if(_t) {
            if(_t.classes.find((element: any) => element == classId)) {
                arr.push(_t)
            } else return;
        } else return;
    });

    return arr;
}