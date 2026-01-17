const input = document.querySelector("#uploadFile");
if (!(input instanceof HTMLInputElement)) throw new TypeError();
const outputWrapper = document.querySelector("#output");
if (!outputWrapper) throw new TypeError();
const fileReader = new FileReader();
/**
 * @param {FileList} files 
 */
async function handleInput(files) {
    for (const file of files) {
        await new Promise(resolve => {
            fileReader.readAsDataURL(file);
            fileReader.addEventListener("load", resolve, { once: true });
        });
        const details = document.createElement("details");
        details.innerHTML = `<summary>${file.name}<button>Copy</button></summary><code>${fileReader.result}</code>`;
        const copyButton = details.querySelector("button");
        if (!copyButton) throw new TypeError();
        copyButton.addEventListener("click", async () => {
            await navigator.clipboard.writeText(details.querySelector("code").textContent);
            copyButton.innerText = "Copied";
        });
        outputWrapper.appendChild(details);
    }
}
input.addEventListener("change", async () => {
    if (!input.files) throw new TypeError();
    handleInput(input.files);
});
document.querySelector("#pasteArea").addEventListener("paste", (event) => {
    if (!(event instanceof ClipboardEvent)) throw new TypeError();
    handleInput(event.clipboardData.files);
});