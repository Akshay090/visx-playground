import React, { useEffect, useMemo, useState } from "react";
import { Group } from "@visx/group";
import { Tree, hierarchy } from "@visx/hierarchy";
import {
  HierarchyPointLink,
  HierarchyPointNode,
} from "@visx/hierarchy/lib/types";
import { LinkHorizontal } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";

const peach = "#fd9b93";
const pink = "#fe6e9e";
const blue = "#03c0dc";
const green = "#26deb0";
const plum = "#71248e";
const lightpurple = "#374469";
const white = "#ffffff";
export const background = "#272b4d";

interface TreeNode {
  name: string;
  children?: this[];
}

type HierarchyNode = HierarchyPointNode<TreeNode>;

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
  setSelectedNode: (node: HierarchyNode) => void;
}

/** Handles rendering Root, Parent, and other Nodes. */
function Node({ node, setSelectedNode }: INode) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;
  const isRoot = node.depth === 0;
  const isParent = !!node.children;
  // console.log("all node", node);

  if (isRoot) return <RootNode node={node} setSelectedNode={setSelectedNode} />;
  if (isParent)
    return <ParentNode node={node} setSelectedNode={setSelectedNode} />;
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
          setSelectedNode(node);
          // console.log("setted ", node);
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

function RootNode({ node, setSelectedNode }: INode) {
  return (
    <Group top={node.x} left={node.y} onClick={() => setSelectedNode(null)}>
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

function ParentNode({ node, setSelectedNode }: INode) {
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
          setSelectedNode(node);
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
  const [selNode, setSelNode] = useState<HierarchyNode>();
  const [selNodeAllParent, setSelNodeAllParent] = useState<string[]>();
  const setSelectedNode = (node: HierarchyNode) => {
    setSelNode(node);
  };

  useEffect(() => {
    if (selNode) {
      let selectedNode = { ...selNode };
      const allParents = [selectedNode.data.name];
      // console.log(selNode);
      while (selectedNode.parent !== null) {
        const currentParent = selectedNode.parent.data.name;
        allParents.push(currentParent);
        // console.log("currentParent ", currentParent);
        selectedNode = selectedNode.parent;
      }
      // console.log("all parents", allParents);
      setSelNodeAllParent(allParents);
    }
    if (selNode === null) {
      setSelNodeAllParent(null);
    }
  }, [selNode]);
  const data = useMemo(() => hierarchy(rawTree), []);
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  const isPathHighlight = (link: HierarchyPointLink<TreeNode>): boolean => {
    const targetLinkName = link.target.data.name;
    // highlights from current node to its parent
    // const matchLinkAndNode = targetLinkName === selNode?.data.name;
    // return matchLinkAndNode;

    // hilights the entire path till current node
    return selNodeAllParent?.includes(targetLinkName);
  };
  return width < 10 ? null : (
    <svg width={width} height={height}>
      <LinearGradient id="lg" from={peach} to={pink} />
      <rect width={width} height={height} rx={14} fill={background} />
      <Tree<TreeNode> root={data} size={[yMax, xMax]}>
        {(tree) => (
          <Group top={margin.top} left={margin.left}>
            {console.log(tree.links(), "tree.links()", tree.descendants()[0])}
            {selNode && (
              <LinkHorizontal
                key={`link-${-1}`}
                data={{ source: selNode, target: tree.descendants()[0] }}
                stroke={peach}
                strokeWidth={5}
                fill="none"
              />
            )}
            {tree.links().map((link, i) => {
              return (
                <LinkHorizontal
                  key={`link-${i}`}
                  data={link}
                  stroke={isPathHighlight(link) ? green : lightpurple}
                  strokeWidth={isPathHighlight(link) ? "5" : "1"}
                  fill="none"
                />
              );
            })}
            {tree.descendants().map((node, i) => (
              <Node
                key={`node-${i}`}
                node={node}
                setSelectedNode={setSelectedNode}
              />
            ))}
          </Group>
        )}
      </Tree>
    </svg>
  );
}
