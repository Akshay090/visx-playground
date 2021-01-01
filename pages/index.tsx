import Button from "@components/Button";
import { useRouter } from "next/router";

const IndexPage = () => {
  const router = useRouter();
  return (
    <div style={{ maxWidth: "56rem", margin: "2rem auto" }}>
      <div style={{ fontSize: "1.5rem", lineHeight: "2rem" }}>
        VISX Playground
      </div>
      <div
        style={{
          fontSize: "1.25rem",
          lineHeight: "1.75rem",
          marginTop: "2rem",
        }}
      >
        Demo Pages :
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem" }}>
        <Button
          text="Tree Demo"
          onClick={() => {
            router.push("/demo-tree");
          }}
        />
        <Button
          text="Link Types Demo"
          onClick={() => {
            router.push("/demo-linkTypes");
          }}
        />
        <Button
          text="Dendrogram Types Demo"
          onClick={() => {
            router.push("/demo-dendrogram");
          }}
        />
      </div>
    </div>
  );
};
export default IndexPage;
