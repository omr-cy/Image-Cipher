var decryptMode = Boolean(document.getElementById("decrypt-btn"));
var inputFile = document.getElementById(decryptMode ? "decrypt-input-file" : "input-file");
var image = document.getElementById(decryptMode ? "decrypt-img" : "origin-img");
var password = document.getElementById(decryptMode ? "decrypt-password" : "password");
var actionButton = document.getElementById(decryptMode ? "decrypt-btn" : "encrypt-btn");
var progress = document.getElementById(decryptMode ? "decrypt-progress" : "encrypt-progress");
var errorMessage = document.getElementById(decryptMode ? "decrypt-error" : "encrypt-error");
var viewer = document.getElementById(decryptMode ? "decrypt-viewer" : "cropper-viewer");
var uploader = document.getElementById(decryptMode ? "decrypt-uploader" : "uploader");
var metadataMarker = new Uint8Array([73, 67, 77, 69, 84, 65]);

var cropper = null;
var metadataCoordinates = null;
var previewUrl = null;
var resultBlob = null;
var isProcessing = false;
var createCropperAfterLoad = false;
var hasUsableImage = false;


function setProcessing(active) {
    isProcessing = active;
    progress.hidden = !active;
    actionButton.disabled = active;
    inputFile.disabled = active;
    viewer.setAttribute("aria-busy", String(active));

    if (active) {
        actionButton.textContent = decryptMode ? "Decrypting..." : "Encrypting...";
    } else if (resultBlob) {
        actionButton.textContent = "Download";
    } else {
        actionButton.textContent = decryptMode ? "Decrypt" : "Encrypt";
    }
}


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}


function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
}


function setImagePreview(blob, shouldCreateCropper) {
    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
    }

    previewUrl = URL.createObjectURL(blob);
    createCropperAfterLoad = shouldCreateCropper;
    image.src = previewUrl;
}


function handleImageLoaded() {
    hasUsableImage = true;
    cropper = null;

    if (createCropperAfterLoad) {
        try {
            cropper = new Cropper(image, { aspectRatio: 0, viewMode: 1 });
        } catch (error) {
            hasUsableImage = false;
            showError("Could not start the image cropper.");
            return;
        }
    }

    if (decryptMode) {
        try {
            validateCoordinates(
                metadataCoordinates,
                image.naturalWidth,
                image.naturalHeight
            );
        } catch (error) {
            hasUsableImage = false;
            showError(error.message);
        }
    }
}


function handleImageError() {
    hasUsableImage = false;
    showError("Could not open this image.");
}


function showEditor() {
    uploader.hidden = true;
    viewer.hidden = false;
    viewer.style.display = "flex";
    password.style.display = "block";
    actionButton.style.display = "block";
}


function handleFileChange() {
    var file = inputFile.files[0];
    if (!file) {
        return;
    }

    clearError();
    resultBlob = null;
    metadataCoordinates = null;
    hasUsableImage = false;

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    if (decryptMode) {
        file.arrayBuffer()
            .then(function (buffer) {
                var metadata = extractMetadata(new Uint8Array(buffer));
                metadataCoordinates = metadata.coordinates;
                var imageBlob = new Blob([metadata.imageBytes], { type: "image/png" });

                setImagePreview(imageBlob, false);
                showEditor();
            })
            .catch(function (error) {
                showError(error.message);
            });
        return;
    }

    setImagePreview(file, true);
    showEditor();
}


function markerAt(bytes, offset) {
    if (offset < 0 || offset + metadataMarker.length > bytes.length) {
        return false;
    }

    for (var index = 0; index < metadataMarker.length; index += 1) {
        if (bytes[offset + index] !== metadataMarker[index]) {
            return false;
        }
    }

    return true;
}


function extractMetadata(bytes) {
    var footerOffset = bytes.length - metadataMarker.length;
    if (!markerAt(bytes, footerOffset)) {
        throw new Error("This image has no valid encryption metadata.");
    }

    var markerOffset = -1;
    var metadataOffset = -1;
    var dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    for (
        var candidateOffset = footerOffset - metadataMarker.length - 4;
        candidateOffset >= 0;
        candidateOffset -= 1
    ) {
        if (!markerAt(bytes, candidateOffset)) {
            continue;
        }

        var candidateMetadataOffset = candidateOffset + metadataMarker.length + 4;
        if (candidateMetadataOffset > footerOffset) {
            continue;
        }

        var metadataLengthOffset = candidateOffset + metadataMarker.length;
        var metadataLength = dataView.getUint32(metadataLengthOffset, false);
        if (candidateMetadataOffset + metadataLength === footerOffset) {
            markerOffset = candidateOffset;
            metadataOffset = candidateMetadataOffset;
            break;
        }
    }

    if (metadataOffset < 0) {
        throw new Error("This image has no valid encryption metadata.");
    }

    var metadataText = new TextDecoder().decode(bytes.subarray(metadataOffset, footerOffset));
    var coordinates;

    try {
        coordinates = JSON.parse(metadataText);
    } catch (error) {
        throw new Error("The image metadata is not valid JSON.");
    }

    if (!coordinates || typeof coordinates !== "object" || Array.isArray(coordinates)) {
        throw new Error("The image metadata does not contain valid coordinates.");
    }

    return {
        imageBytes: bytes.slice(0, markerOffset),
        coordinates: coordinates,
    };
}


function validateCoordinates(coordinates, imageWidth, imageHeight) {
    if (!coordinates || typeof coordinates !== "object") {
        throw new Error("The image metadata does not contain valid coordinates.");
    }

    var x = coordinates.x;
    var y = coordinates.y;
    var width = coordinates.width;
    var height = coordinates.height;

    if (
        !Number.isInteger(x)
        || !Number.isInteger(y)
        || !Number.isInteger(width)
        || !Number.isInteger(height)
        || x < 0
        || y < 0
        || width <= 0
        || height <= 0
        || x + width > imageWidth
        || y + height > imageHeight
    ) {
        throw new Error("The image metadata contains coordinates outside the image.");
    }

    return { x: x, y: y, width: width, height: height };
}


function createSegmentCanvas(coordinates) {
    var segmentCanvas = document.createElement("canvas");
    segmentCanvas.width = coordinates.width;
    segmentCanvas.height = coordinates.height;

    var segmentContext = segmentCanvas.getContext("2d");
    segmentContext.drawImage(
        image,
        coordinates.x,
        coordinates.y,
        coordinates.width,
        coordinates.height,
        0,
        0,
        coordinates.width,
        coordinates.height
    );

    return segmentCanvas;
}


function createCompositeCanvas(segmentImage, coordinates) {
    var outputCanvas = document.createElement("canvas");
    outputCanvas.width = image.naturalWidth;
    outputCanvas.height = image.naturalHeight;

    var outputContext = outputCanvas.getContext("2d");
    outputContext.drawImage(image, 0, 0);

    var segmentCanvas = document.createElement("canvas");
    segmentCanvas.width = coordinates.width;
    segmentCanvas.height = coordinates.height;
    var segmentContext = segmentCanvas.getContext("2d");
    segmentContext.drawImage(segmentImage, 0, 0);

    var segmentPixels = segmentContext.getImageData(
        0,
        0,
        coordinates.width,
        coordinates.height
    );
    outputContext.putImageData(segmentPixels, coordinates.x, coordinates.y);

    return outputCanvas;
}


function canvasToBlob(canvas) {
    return new Promise(function (resolve, reject) {
        canvas.toBlob(function (blob) {
            if (!blob) {
                reject(new Error("Could not create the PNG image."));
                return;
            }

            resolve(blob);
        }, "image/png");
    });
}


function loadImageFromBlob(blob) {
    return new Promise(function (resolve, reject) {
        var objectUrl = URL.createObjectURL(blob);
        var loadedImage = new Image();

        loadedImage.onload = function () {
            URL.revokeObjectURL(objectUrl);
            resolve(loadedImage);
        };
        loadedImage.onerror = function () {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Could not open the processed image segment."));
        };

        loadedImage.src = objectUrl;
    });
}


async function sendSegment(endpoint, imageBase64) {
    var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            pxls: imageBase64,
            passwd: password.value,
        }),
    });
    var result = await response.json();
    var resultField = decryptMode ? "decrypted_pxls" : "encrypted_pxls";

    if (!response.ok) {
        throw new Error(result.error || "The server could not process the image segment.");
    }
    if (typeof result[resultField] !== "string" || !result[resultField]) {
        throw new Error("The server returned an invalid image segment.");
    }

    return result[resultField];
}


function canvasToBase64(canvas) {
    var dataUrl = canvas.toDataURL("image/png");
    var commaIndex = dataUrl.indexOf(",");
    if (commaIndex < 0) {
        throw new Error("Could not prepare the image segment.");
    }

    return dataUrl.substring(commaIndex + 1);
}


function appendMetadata(imageBytes, coordinates) {
    var metadataBytes = new TextEncoder().encode(JSON.stringify(coordinates));
    var totalLength = imageBytes.length + metadataMarker.length + 4
        + metadataBytes.length + metadataMarker.length;
    var outputBytes = new Uint8Array(totalLength);
    var offset = 0;

    outputBytes.set(imageBytes, offset);
    offset += imageBytes.length;
    outputBytes.set(metadataMarker, offset);
    offset += metadataMarker.length;
    new DataView(outputBytes.buffer).setUint32(offset, metadataBytes.length, false);
    offset += 4;
    outputBytes.set(metadataBytes, offset);
    offset += metadataBytes.length;
    outputBytes.set(metadataMarker, offset);

    return outputBytes;
}


async function processImage() {
    var coordinates;

    if (decryptMode) {
        coordinates = validateCoordinates(
            metadataCoordinates,
            image.naturalWidth,
            image.naturalHeight
        );
    } else {
        if (!cropper) {
            throw new Error("Select an image area before encrypting.");
        }

        coordinates = validateCoordinates(
            cropper.getData(true),
            image.naturalWidth,
            image.naturalHeight
        );
    }

    var segmentCanvas = createSegmentCanvas(coordinates);
    var segmentBase64 = canvasToBase64(segmentCanvas);
    var endpoint = decryptMode ? "/decrypt" : "/encrypt";
    var transformedSegmentBase64 = await sendSegment(endpoint, segmentBase64);
    var transformedSegmentBytes = Uint8Array.from(
        atob(transformedSegmentBase64),
        function (character) {
            return character.charCodeAt(0);
        }
    );
    var transformedSegment = await loadImageFromBlob(
        new Blob([transformedSegmentBytes], { type: "image/png" })
    );
    var outputCanvas = createCompositeCanvas(transformedSegment, coordinates);
    var outputImage = await canvasToBlob(outputCanvas);
    var outputBytes = new Uint8Array(await outputImage.arrayBuffer());

    if (decryptMode) {
        resultBlob = outputImage;
    } else {
        resultBlob = new Blob(
            [appendMetadata(outputBytes, coordinates)],
            { type: "image/png" }
        );
    }

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    setImagePreview(outputImage, false);
    viewer.classList.add(decryptMode ? "is-decrypted" : "is-encrypted");
    password.hidden = true;
    password.style.display = "none";
}


function downloadResult() {
    var downloadUrl = URL.createObjectURL(resultBlob);
    var link = document.createElement("a");
    link.href = downloadUrl;
    link.download = decryptMode ? "decrypted_image.png" : "encrypted_image.png";
    link.click();
    setTimeout(function () {
        URL.revokeObjectURL(downloadUrl);
    }, 1000);
}


async function handleActionClick() {
    if (isProcessing) {
        return;
    }

    if (resultBlob) {
        downloadResult();
        return;
    }

    if (!hasUsableImage) {
        showError("Choose a valid image first.");
        return;
    }
    if (password.value.length < 8) {
        showError("Password must be at least 8 characters.");
        return;
    }

    clearError();
    setProcessing(true);

    try {
        await processImage();
    } catch (error) {
        showError(error.message);
    } finally {
        setProcessing(false);
    }
}


image.addEventListener("load", handleImageLoaded);
image.addEventListener("error", handleImageError);
inputFile.addEventListener("change", handleFileChange);
actionButton.addEventListener("click", handleActionClick);
