interface Props {
  text: string;
  onClick: () => void;
}

const Button = ({ text, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#176174",
        cursor: "pointer",
        color: "#fff",
        padding: "1rem",
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
        borderRadius: ".5rem",
        border: "3px solid #fff",
        outline: "2px solid transparent",
        outlineOffset: "2px",
      }}
    >
      {text}
    </button>
  );
};

export default Button;
