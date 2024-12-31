import React, { useState, useRef } from "react";
import axios from "axios";

const UploaderComponent = ({ episodeId, closeModal }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [serverName, setServerName] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef();

  const api = axios.create({
    baseURL:
      "https://vy4uz0kpuh.execute-api.ap-southeast-2.amazonaws.com/cineworld",
  });

  class Uploader {
    constructor(options) {
      this.useTransferAcceleration = options.useTransferAcceleration;
      this.chunkSize = Math.max(
        1024 * 1024 * options.chunkSize,
        1024 * 1024 * 5
      );
      this.threadsQuantity = Math.min(options.threadsQuantity || 5, 15);
      this.timeout = 5000;
      this.file = options.file;
      this.fileName = options.fileName;
      this.baseURL = options.baseURL;
      this.aborted = false;
      this.uploadedSize = 0;
      this.progressCache = {};
      this.activeConnections = {};
      this.parts = [];
      this.uploadedParts = [];
      this.fileId = null;
      this.fileKey = null;
      this.onProgressFn = () => {};
      this.onErrorFn = () => {};
    }

    async initialize() {
      try {
        const fileName = this.file.name;
        const initializeResponse = await api.post("/initialize", {
          name: fileName,
        });

        const AWSFileDataOutput = initializeResponse.data;
        this.fileId = AWSFileDataOutput.fileId;
        this.fileKey = AWSFileDataOutput.fileKey;

        const numberOfParts = Math.ceil(this.file.size / this.chunkSize);

        const urlsResponse = await api.post(
          this.useTransferAcceleration
            ? "/getPreSignedTAUrls"
            : "/getPreSignedUrls",
          { fileId: this.fileId, fileKey: this.fileKey, parts: numberOfParts },
          { headers: { "Content-Type": "application/json" } }
        );

        const responseBody = JSON.parse(urlsResponse.data.body);

        if (!responseBody.parts || !Array.isArray(responseBody.parts)) {
          throw new Error("Failed to get parts from API response.");
        }

        this.parts.push(...responseBody.parts);
        this.sendNext();
      } catch (error) {
        this.complete(error);
      }
    }

    sendNext(retry = 0) {
      if (this.parts.length === 0) {
        if (Object.keys(this.activeConnections).length === 0) {
          this.complete();
        }
        return;
      }

      const part = this.parts.pop();
      const sentSize = (part.PartNumber - 1) * this.chunkSize;
      const chunk = this.file.slice(sentSize, sentSize + this.chunkSize);

      this.sendChunk(chunk, part)
        .then(() => this.sendNext())
        .catch((error) => {
          if (retry < 6) {
            setTimeout(() => {
              this.parts.push(part);
              this.sendNext(retry + 1);
            }, 2 ** retry * 100);
          } else {
            this.complete(error);
          }
        });
    }

    async sendChunk(chunk, part) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.timeout = this.timeout;

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round(
              (event.loaded / this.file.size) * 100
            );
            this.onProgressFn({ percentage });
          }
        });

        xhr.open("PUT", part.signedUrl);

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const ETag = xhr.getResponseHeader("ETag");
              if (ETag) {
                this.uploadedParts.push({
                  PartNumber: part.PartNumber,
                  ETag: ETag.replace(/"/g, ""),
                });
                resolve();
              }
            } else {
              reject(new Error(`Failed to upload part ${part.PartNumber}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error("XHR error during upload"));
        xhr.ontimeout = () => reject(new Error("XHR timeout during upload"));

        xhr.send(chunk);
      });
    }

    async complete(error) {
      if (error) {
        setStatus("Upload failed!");
        this.onErrorFn(error);
        return;
      }

      try {
        const videoFinalizationMultiPartInput = {
          fileId: this.fileId,
          fileKey: this.fileKey,
          parts: this.uploadedParts,
        };

        await api.post("/complete", videoFinalizationMultiPartInput, {
          headers: { "Content-Type": "application/json" },
        });

        setVideoLink(`${this.fileName}_s3`);
        setStatus("Upload completed!");
        setIsUploaded(true);
      } catch (err) {
        setStatus("Error completing upload!");
        this.onErrorFn(err);
      }
    }

    onProgress(callback) {
      this.onProgressFn = callback;
    }

    onError(callback) {
      this.onErrorFn = callback;
    }
  }

  const handleUpload = () => {
    const file = fileInputRef.current.files[0];
    if (!file) return;

    const fileNameWithoutExtension = file.name.substring(
      0,
      file.name.lastIndexOf(".")
    );

    console.log("Uploading file:", fileNameWithoutExtension); // Log file name without extension

    const uploader = new Uploader({
      file,
      fileName: fileNameWithoutExtension,
      chunkSize: 10,
      threadsQuantity: 4,
      baseURL:
        "https://vy4uz0kpuh.execute-api.ap-southeast-2.amazonaws.com/cineworld",
      useTransferAcceleration: true,
    });

    uploader.onProgress(({ percentage }) => setProgress(percentage));
    uploader.onError((err) => {
      console.error("Upload error:", err);
      setStatus(`Error: ${err.message}`);
    });

    setStatus(`Uploading: ${fileNameWithoutExtension}...`);
    uploader.initialize();
  };

  const handleServerNameSubmit = async () => {
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken"))
      ?.split("=")[1];

    if (!authToken || !serverName || !videoLink || !episodeId) {
      return;
    }

    const serverData = {
      serverId: 0, // Server ID will be auto-incremented
      episodeId,
      name: serverName,
      link: videoLink,
    };

    console.log("Server Data:", serverData); // Log the server data

    try {
      const response = await axios.post(
        "https://cineworld.io.vn:7001/api/servers",
        serverData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Server Info Saved:", response.data);
      setStatus("Server information saved successfully!");

      closeModal(); // Close modal after saving server info
    } catch (error) {
      console.error("Error saving server info:", error);
      setStatus("Failed to save server information.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "80%",
          maxWidth: "600px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          overflowY: "auto",
        }}>
        <h1>Upload Video File</h1>
        <input type="file" ref={fileInputRef} />
        <button
          onClick={handleUpload}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}>
          Upload
        </button>

        <div id="progressContainer" style={{ marginTop: "20px" }}>
          <progress value={progress} max="100" style={{ width: "100%" }} />
          <span>{progress}%</span>
        </div>

        <div>{status}</div>

        {isUploaded && (
          <div style={{ marginTop: "20px" }}>
            <h3>Enter Server Information</h3>
            <input
              type="text"
              placeholder="Server Name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              style={{
                padding: "10px",
                width: "100%",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleServerNameSubmit}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}>
              Save Server Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploaderComponent;
