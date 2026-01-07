import { Link } from "react-router-dom";
import { logoutRequest } from '../../../services/auth';
import  './BoxMessage.css'
export default function BoxMessage({msm,valueQuestion, setController}) {
    return (

        <div className="card-logaout">
            <div className="card">
                <div>
                    <h3>{msm}</h3>
                </div>
                <div className="option">
                    <Link to='' id="option-btn-logout-yes" onClick={()=>{
                        logoutRequest()
                        history.replaceState("/admin")
                        
                        
                    }}>Sim</Link>
                    <Link to='' id="option-btn-logout-no" onClick={
                        ()=>setController((prev)=>prev=!prev)
                    }>Não</Link>
                </div>
            </div>
        </div>
    )
}