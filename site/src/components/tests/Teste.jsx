import { useEffect } from "react"

export default function Teste(){
    useEffect(()=>{
        async (params) => {
           const request=await fetch("http://127.7.6.4:3000/user")
            request.ok?console.log("Boa"):console.log("Erro");
            const response=await request.json()
            
            console.log(response);
         
            
        }
    },[])
    return(

        <>
<h1>Gabhriel</h1>

        </>
    )



}