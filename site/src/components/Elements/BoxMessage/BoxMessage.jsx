import './BoxMessage.css'

export default function BoxMessage({ msm, setController, onConfirm }) {
    return (
        <div className="card-logaout">
            <div className="card">
                <div>
                    <h3>{msm}</h3>
                </div>
                <div className="option">
                    <button
                        className="btn-confirm"
                        id="option-btn-logout-yes"
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            setController(false);
                        }}
                    >
                        Sim
                    </button>
                    <button
                        className="btn-cancel"
                        id="option-btn-logout-no"
                        onClick={() => setController(false)}
                    >
                        Não
                    </button>
                </div>
            </div>
        </div>
    )
}