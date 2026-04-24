export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
  
  const data = await response.json();
  return data.url;
}

export async function uploadFiles(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));
  
  const response = await fetch("/api/upload/multiple", {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error("Failed to upload files");
  }
  
  const data = await response.json();
  return data.urls;
}
