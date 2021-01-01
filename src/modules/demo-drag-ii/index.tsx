import { ParentSize } from "@visx/responsive";
import React from "react";
import Example from "./components/Example";

const Drag_ii = () => {
  return (
    <ParentSize>
      {({ width, height }) => <Example width={width} height={height} />}
    </ParentSize>
  );
};

export default Drag_ii;
