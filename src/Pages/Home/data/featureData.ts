
import { BsFillCloudFill } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaRegFaceGrin } from "react-icons/fa6";

export interface featureData {
    number: number;
    title: string;
    color: string;
    description: string;
    Icon: React.ElementType;
}


export const getfeatureData = (): featureData[] => [
    {
        number: 1,
        title: 'Análisis de patrones', 
        description: 'Descubre patrones ocultos en tus emociones con nuestro análisis avanzado basado en IA.',
        color: '#252c3e',
        Icon: BsFillCloudFill,
    },
    {
        number: 2,
        title: 'Comunidad',
        description: 'Comparte tus experiencias y conecta con personas que tiene sueños y/o problemas similares a los tuyos.', 
        color: '#9675bc',
        Icon: BsFillPeopleFill,
    },
    {
        number: 3,
        title: 'Emociones',
        description: 'Mapea las emociones presentes en tus sueños y su impacto en tu vida.',
        color: '#f1b3be',
        Icon: FaRegFaceGrin,
    },
];