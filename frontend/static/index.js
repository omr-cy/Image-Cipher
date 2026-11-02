// NOTE: Shared encrypt/decrypt flow written by the AI assistant; review before submission.
const decryptMode = Boolean(document.getElementById("decrypt-btn"));
const inputFile = document.getElementById(decryptMode ? "decrypt-input-file" : "input-file");
const image = document.getElementById(decryptMode ? "decrypt-img" : "origin-img");
const password = document.getElementById(decryptMode ? "decrypt-password" : "password");
const actionButton = document.getElementById(decryptMode ? "decrypt-btn" : "encrypt-btn");
const progress = document.getElementById(decryptMode ? "decrypt-progress" : "encrypt-progress");
const viewer = document.getElementById(decryptMode ? "decrypt-viewer" : "cropper-viewer");
const uploader = document.getElementById(decryptMode ? "decrypt-uploader" : "uploader");

let cropper = null;
let imageDataUrl = null;
let resultBlob = null;
let previewUrl = null;
let isProcessing = false;

function setProcessing(active) {
    isProcessing = active;
    progress.hidden = !active;
    actionButton.disabled = active;
    inputFile.disabled = active;
    actionButton.textContent = active
        ? decryptMode ? "Decrypting..." : "Encrypting..."
        : resultBlob ? "Download" : decryptMode ? "Decrypt" : "Encrypt";
    viewer.setAttribute("aria-busy", String(active));
}

function makeImageBlobs(base64, type) {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const marker = [73, 67, 77, 69, 84, 65];
    let previewEnd = bytes.length;
    const hasMarker = offset => marker.every((byte, index) => bytes[offset + index] === byte);
    const footerOffset = bytes.length - marker.length;

    if (footerOffset >= 0 && hasMarker(footerOffset)) {
        const searchStart = footerOffset - marker.length - 4;
        const searchEnd = Math.max(0, searchStart - 1024 * 1024);
        for (let offset = searchStart; offset >= searchEnd; offset--) {
            if (!hasMarker(offset)) continue;
            const lengthOffset = offset + marker.length;
            const length = new DataView(bytes.buffer).getUint32(lengthOffset, false);
            if (lengthOffset + 4 + length === footerOffset) {
                previewEnd = offset;
                break;
            }
        }
    }

    return {
        download: new Blob([bytes], { type }),
        preview: new Blob([bytes.subarray(0, previewEnd)], { type }),
    };
}

function downloadResult() {
    const url = URL.createObjectURL(resultBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = decryptMode ? "decrypted_image.png" : "encrypted_image.png";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function processImage() {
    const base64Image = imageDataUrl.split(",", 2)[1];
    if (!base64Image) throw new Error("Could not read the selected image.");

    const payload = { image: base64Image, passwd: password.value };
    if (!decryptMode) payload.coords = cropper.getData(true);

    const response = await fetch(decryptMode ? "/decrypt" : "/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);

    const output = makeImageBlobs(result.image, result.imageType);
    resultBlob = output.download;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(output.preview);
    image.onload = null;
    image.src = previewUrl;
    cropper?.destroy();
    cropper = null;
    viewer.classList.add(decryptMode ? "is-decrypted" : "is-encrypted");
    password.hidden = true;
    password.style.display = "none";
}

inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (!file) return;

    cropper?.destroy();
    cropper = null;
    resultBlob = null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;

    const reader = new FileReader();
    reader.onload = () => {
        imageDataUrl = reader.result;
        image.onload = () => {
            if (!decryptMode) cropper = new Cropper(image, { aspectRatio: 0, viewMode: 1 });
        };
        image.src = imageDataUrl;
        uploader.hidden = true;
        viewer.hidden = false;
        if (!decryptMode) viewer.style.display = "flex";
        password.style.display = "block";
        actionButton.style.display = "block";
    };
    reader.onerror = () => console.error("Could not read the selected image.");
    reader.readAsDataURL(file);
});

actionButton.addEventListener("click", async () => {
    if (isProcessing) return;
    if (resultBlob) {
        downloadResult();
        return;
    }
    if (!imageDataUrl || (!decryptMode && !cropper) || password.value.length < 8) return;

    setProcessing(true);
    try {
        await processImage();
    } catch (error) {
        console.error(`Could not ${decryptMode ? "decrypt" : "encrypt"} the image:`, error);
    } finally {
        setProcessing(false);
    }
});
