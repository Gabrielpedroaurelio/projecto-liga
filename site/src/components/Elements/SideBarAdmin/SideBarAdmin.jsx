import {FaUser} from 'react-icons/fa6'
import {FaMagnifyingGlass} from 'react-icons/fa6'
import style from './SideBarAdmin.module.css'
import { useState } from 'react'

export default function SideBarAdmin(){

    const  [objectToSearch, setobjectToSearch]=useState("Usuário");
 
    return(
        <>
        <div className={style.containerSideBarAdmin}>
            <div className={style.SideBarAdmin}>
                    <div className={style.barsearch}>
                        <FaMagnifyingGlass/>
                        <input type="text" placeholder={`Pesquisar ${objectToSearch}`}/>
                        <select name="objecto_to_seach" id="objecto_to_seach" onChange={(e)=>{
                            setobjectToSearch(e.target.selectedOptions.item(0).innerHTML)
                            
                            
                        }}>
                            <option value="search_by_user">Usuário</option>
                            <option value="search_by_enterprise">Empresas</option>
                            <option value="search_by_signal">Sinais</option>
                            
                            
                        </select>
                    </div>
                
            </div>

        </div>
        </>
    )
}