import hydrate from "preact-iso/hydrate";
import { App } from "./App";

hydrate(<App />, document.querySelector("#app")!);
