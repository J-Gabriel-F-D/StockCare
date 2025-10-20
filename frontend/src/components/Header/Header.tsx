import "./header.css";
import bell from "../../assets/gridicons_bell.svg";
import profile from "../../assets/ix_user-profile-filled.svg";
import home from "../../assets/branco_baseline-home.svg";
import logo from "../../logo.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const backToHome = () => {
    navigate("/");
  };

  return (
    <div className="header-container">
      <div className="header-titles">
        <div style={{ width: "3rem", display: "flex", alignItems: "center" }}>
          <img src={logo} alt="StockCare Logo" className="logo" />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="brand-text-stock">Stock</div>
          <div className="brand-text-care">Care</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "20px",
          width: "20%",
        }}
      >
        <div>
          <button className="custom-btn">
            <img
              src={home}
              alt=""
              style={{ width: "80%" }}
              onClick={backToHome}
            />
          </button>
        </div>
        <div className="dropdown">
          <button className="dropbtn">
            <img src={profile} alt="" style={{ width: "80%" }} />
          </button>
          <div className="dropdown-content">
            <Link to="#" className="dropdown-item">
              Atualizar perfil
            </Link>
            <button className="dropdown-item" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <div>
          <button className="custom-btn">
            <img src={bell} alt="" style={{ width: "80%" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
