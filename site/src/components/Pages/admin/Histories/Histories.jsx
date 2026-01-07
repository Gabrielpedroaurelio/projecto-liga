import NavBarAdmin from "../../../Elements/NavBarAdmin/NavBarAdmin";
import SideBarAdmin from "../../../Elements/SideBarAdmin/SideBarAdmin";
import style from './Histories.module.css'
import AbaHistoryAction from "../AbaHistoryAction/AbaHistoryAction";
import AbaHistoryLogin from "../AbaHistoryLogin/AbaHistoryLogin";
import { useEffect, useReducer, useState } from "react";
const historyArray = [
  <AbaHistoryAction />,
  <AbaHistoryLogin />
]
export default function Histories(params) {
  
  return (
    <>
      <NavBarAdmin></NavBarAdmin>

      <main className={style.containerHistory}>
        <div className={style.navigatorHistory}>
          <div>
            <button>Actitidades dos Usuario</button>
            <button>Entrada e Saida dos Usuario</button>
          </div>
        </div>
        <div>

          <div className="containerAbaHistory">
            {historyArray[1]}
          </div>
        </div>
      </main>


    </>
  )
} 