import {} from "react"

type WindowDrawingProps = {
  width?: number;
  height?: number;
};

const WindowDrawing: React.FC<WindowDrawingProps> = ({width = 600, height = 900}) => {
  const frameStroke = 4;
  const sectionWidth = width / 2;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height + 100}`} // добавим место под размеры
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Рама */}
      <rect x="0" y="0" width={width} height={height} stroke="black" strokeWidth={frameStroke} fill="white" />

      {/* Вертикальная перегородка между секциями */}
      <line x1={sectionWidth} y1="0" x2={sectionWidth} y2={height} stroke="black" strokeWidth="2" />

      {/* Левая секция — глухая */}
      <text x={sectionWidth / 2} y={height / 2} fontSize="24" textAnchor="middle" fill="gray">
        Глухое
      </text>

      {/* Правая секция — поворотно-откидная */}
      <text x={sectionWidth + sectionWidth / 2} y={height / 2} fontSize="24" textAnchor="middle" fill="gray">
        Поворотно-откидное
      </text>
      {/* Иконка открывания */}
      <line x1={sectionWidth + 20} y1={20} x2={width - 20} y2={height - 20} stroke="blue" strokeWidth="2" />

      {/* Размер по ширине */}
      <line x1="0" y1={height + 40} x2={width} y2={height + 40} stroke="black" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
      <text x={width / 2} y={height + 70} fontSize="24" textAnchor="middle">{`${width} мм`}</text>

      {/* Размер по высоте */}
      <line x1={width + 40} y1="0" x2={width + 40} y2={height} stroke="black" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
      <text x={width + 70} y={height / 2} fontSize="24" writingMode="tb" textAnchor="middle">{`${height} мм`}</text>

      {/* Маркеры стрелок */}
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="black" />
        </marker>
      </defs>
    </svg>
  );
};

export default WindowDrawing;
