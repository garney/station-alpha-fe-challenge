import { useState } from "react";
import "./button.css";

interface Props {
  data: {
    textDefault: string;
    textSucces: string;
    iconDefault: JSX.Element;
    iconSucces: JSX.Element;
  };
}
const Button = ({ data }: Props) => {
  const { textDefault, textSucces, iconDefault, iconSucces } = data;
  const [checked, setChecked] = useState(false);
  const [icon, setIcon] = useState(iconDefault);
  const [text, setText] = useState(textDefault);
  const handleClick = () => {
    if (!checked) {
      setChecked(!checked);
      setTimeout(() => {
        setText(textSucces);
        setIcon(iconSucces);
      }, 2500);
    }
  };
  return (
    <div className="container">
      <button
        className={`button ${checked ? "checkedButton" : ""}`}
        onClick={handleClick}
      >
        <div className="icon">{icon}</div>
        <span className={`text ${checked ? "checkedText" : ""}`}>{text}</span>
      </button>
    </div>
  );
};

export default Button;
