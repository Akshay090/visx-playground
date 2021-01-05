import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { Tree, hierarchy } from "@visx/hierarchy";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { LinkHorizontal, LinkHorizontalCurve } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";

const peach = "#fd9b93";
const pink = "#fe6e9e";
const blue = "#03c0dc";
const green = "#26deb0";
const plum = "#71248e";
// const lightpurple = "#374469";
const white = "#ffffff";
export const background = "#272b4d";

interface TreeNode {
  name: string;
  children?: this[];
}

type HierarchyNode = HierarchyPointNode<TreeNode>;

interface ILoopBack {
  source: string;
  target: string;
}

const loopBackNodes: ILoopBack[] = [
  { source: "A1", target: "T" },
  { source: "C1", target: "A" },
  { source: "C1", target: "Z" },
  { source: "D", target: "B" },
  { source: "D3", target: "B3" },
];

const rawTree: TreeNode = {
  name: "T",
  children: [
    {
      name: "A",
      children: [
        { name: "A1" },
        { name: "A2" },
        { name: "A3" },
        {
          name: "C",
          children: [
            {
              name: "C1",
            },
            {
              name: "D",
              children: [
                {
                  name: "D1",
                },
                {
                  name: "D2",
                },
                {
                  name: "D3",
                },
              ],
            },
          ],
        },
      ],
    },
    { name: "Z" },
    {
      name: "B",
      children: [{ name: "B1" }, { name: "B2" }, { name: "B3" }],
    },
  ],
};

interface INode {
  node: HierarchyNode;
}

/** Handles rendering Root, Parent, and other Nodes. */
function Node({ node }: INode) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;
  const isRoot = node.depth === 0;
  const isParent = !!node.children;

  if (isRoot) return <RootNode node={node} />;
  if (isParent) return <ParentNode node={node} />;
  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={centerY}
        x={centerX}
        fill={background}
        stroke={green}
        strokeWidth={1}
        strokeDasharray="2,2"
        strokeOpacity={0.6}
        rx={10}
        onClick={() => {
          // console.log("node click", node);
        }}
      />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        fill={green}
        style={{ pointerEvents: "none" }}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function RootNode({ node }: INode) {
  return (
    <Group top={node.x} left={node.y}>
      <circle r={12} fill="url('#lg')" />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
        fill={plum}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function ParentNode({ node }: INode) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.x} left={node.y}>
      <rect
        height={height}
        width={width}
        y={centerY}
        x={centerX}
        fill={background}
        stroke={blue}
        strokeWidth={1}
        onClick={() => {
          // alert(`clicked: ${JSON.stringify(node.data.name)}`);
        }}
      />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
        fill={white}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

const defaultMargin = { top: 10, left: 80, right: 80, bottom: 10 };

export type TreeProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function Example({
  width,
  height,
  margin = defaultMargin,
}: TreeProps) {
  const data = useMemo(() => hierarchy(rawTree), []);
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  const getTreeNodeByName = (tree: HierarchyNode, nodeName: string) => {
    return tree
      .descendants()
      .find((treeNode) => treeNode.data.name === nodeName);
  };

  const processLoopBackNodes = (
    tree: HierarchyNode,
    node: ILoopBack
  ): {
    source: HierarchyNode;
    target: HierarchyNode;
  } => {
    const source = getTreeNodeByName(tree, node.source);
    const target = getTreeNodeByName(tree, node.target);

    // handling case where loopback node don't realy exist.
    // the source target assignment is flipped so loopback curve upwards.
    if (source && target) return { source: target, target: source };

    return null;
  };

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <defs>
        <marker
          id="arrow"
          viewBox="0 -5 30 30"
          refX="20"
          refY="-.5"
          markerWidth="14"
          markerHeight="14"
          orient="auto"
          fill="#fff"
        >
          <path d="M0,-5L10,0L0,5" />
        </marker>
      </defs>
      <LinearGradient id="lg" from={peach} to={pink} />
      <rect width={width} height={height} rx={14} fill={background} />
      <Tree<TreeNode> root={data} size={[yMax, xMax]}>
        {(tree) => (
          <Group top={margin.top} left={margin.left}>
            {console.log(tree.links(), "tree.links()", tree.descendants()[0])}
            {console.log(
              getTreeNodeByName(tree, loopBackNodes[1].source),
              "tree.descendants()"
            )}
            {tree.links().map((link, i) => {
              return (
                <LinkHorizontal
                  key={`link-${i}`}
                  data={link}
                  stroke={green}
                  strokeWidth={"5"}
                  fill="none"
                  // markerEnd="url(#arrow)" to add arrow uncomment it
                />
              );
            })}
            {loopBackNodes.map((node, i) => {
              return (
                <LinkHorizontalCurve
                  key={`loop-link-${i}`}
                  data={processLoopBackNodes(tree, node)}
                  stroke={peach}
                  strokeWidth={3}
                  fill="none"
                  // markerEnd="url(#arrow)" to add arrow uncomment it
                />
              );
            })}
            {tree.descendants().map((node, i) => (
              <Node key={`node-${i}`} node={node} />
            ))}
          </Group>
        )}
      </Tree>
    </svg>
  );
}
