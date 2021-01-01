
import { ParentSize } from "@visx/responsive";
import React from "react";
import Example from "./components/Example";

const TreeDemo = () => {
  return (
    <ParentSize>
      {({ width, height }) => <Example width={width} height={height} />}
    </ParentSize>
  );
};

export default TreeDemo;
