import { useAsync } from "react-use";

export default function useRegulex() {
  return useAsync(async () => {
    return new Promise<any>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = process.env.PUBLIC_URL + "/regulex.js";
      script.onload = () => {
        const regulex = window.require("regulex");
        resolve(regulex);
      };
      script.onerror = () => {
        reject(new Error("load regulex error!"));
      };
      document.body.appendChild(script);
    });
  });
}
