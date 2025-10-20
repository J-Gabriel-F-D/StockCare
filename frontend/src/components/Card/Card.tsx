import { useNavigate } from "react-router-dom";
import "./card.css";

interface CardProps {
  title?: string;
  icon?: string;
  btnTrue?: boolean;
  textBtn?: string;
  link?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, btnTrue, textBtn, link }) => {
  const navigate = useNavigate();

  const goingTo = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="card">
      <div className="card-icon">
        <img src={icon} style={{}} />
      </div>
      <div className="card-header">
        {btnTrue && (
          <button className="card-btn" onClick={goingTo}>
            {textBtn}
          </button>
        )}
        <div
          style={{
            width: "99%",
            textAlign: "center",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export default Card;
