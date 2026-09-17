import "./style.css";
import { getButtonMessage } from "./message.js";

const button = document.querySelector("#button");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
    message.textContent = getButtonMessage();
});