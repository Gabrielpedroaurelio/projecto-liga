import { FaUser } from 'react-icons/fa6'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import style from './SideBarAdmin.module.css'
import { useState } from 'react'

export default function SideBarAdmin({ onSearch }) {
 
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Chama o callback se foi fornecido
        if (onSearch && typeof onSearch === 'function') {
            onSearch(value);
        }
    };

    return (
        <>
            <div className={style.containerSideBarAdmin}>
                <div className={style.SideBarAdmin}>
                    <div className={style.barsearch}>
                        <FaMagnifyingGlass />
                        <input
                            type="text"
                            placeholder={`Pesquisar`}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        
                    </div>

                </div>

            </div>
        </>
    )
}