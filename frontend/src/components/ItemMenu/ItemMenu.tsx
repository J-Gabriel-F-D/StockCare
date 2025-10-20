import { Link } from "react-router-dom";
import "./itemMenu.css";

interface ItemMenuProps {
  icon: string;
  link: string;
  text: string;
}

const ItemMenu: React.FC<ItemMenuProps> = ({ icon, link, text }) => {
  return (
    <div className="sidebar-link">
      <Link to={link} className="text-decoration">
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
            margin: "10px 20px",
          }}
        >
          <div>
            <img src={icon} style={{ width: "3rem" }} />
          </div>
          <div>{text}</div>
        </div>
      </Link>
    </div>
  );
};

export default ItemMenu;
