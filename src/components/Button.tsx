import '../styling/components/Button.css';

interface buttonProps {
  text: string;
  onClick?: () => void;
}

const Button = ({ text, onClick }: buttonProps) => {
  return (
    <button className="button" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
