import { useState } from "react"

export default function useIsShow(valorPadrao){
    const [valor,setValor]=useState(valorPadrao)
    function handleHook(valor) {
        setValor(valor)
    }

}