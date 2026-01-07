import style from './ParagrafoErro.module.css'
export default function ParagrafoErro({error}){
    return(
        <>
          <p className={style.ParagrafoErro}>{error}</p>
        
        </>
    )
}