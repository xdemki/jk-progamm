export default function ColorControl(color: string) {
    console.log(color)
    switch(color) {
        case 'basic': return '#534642'; 
        case 'info': return '#223e8c';
        case 'ticket': return '#8c222c';
        case 'moderation': return '#228c32';
    }
}