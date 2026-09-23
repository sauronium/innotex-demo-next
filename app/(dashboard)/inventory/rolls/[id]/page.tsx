"use client";
import {useParams} from 'next/navigation';
import {FabricGenealogy} from '@/components/modules/fabric-genealogy';
export default function Page(){const {id}=useParams<{id:string}>();return <FabricGenealogy rollId={id}/>}
