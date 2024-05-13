import React from "react";
import ReactDOM from "react-dom/client";
import ContentScript from "./content-script.tsx"

chrome?.runtime?.connect({name: "POPUP"})
const contentScript = document.createElement("div");
contentScript.id = "warmupinterview-root";
document.body.insertAdjacentElement('afterbegin', contentScript);

ReactDOM.createRoot(contentScript).render(
    <React.StrictMode>
        <ContentScript/>
    </React.StrictMode>
);

