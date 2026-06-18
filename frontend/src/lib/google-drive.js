export async function getDriveFiles(accessToken, folderId = "root", query = "", pageToken = "") {
  let q = `trashed = false and '${folderId}' in parents and (mimeType = 'application/vnd.google-apps.folder' or mimeType starts with 'image/' or mimeType = 'application/pdf')`;
  if (query) {
    q += ` and name contains '${query.replace(/'/g, "\\'")}'`;
  }

  const driveUrl = new URL("https://www.googleapis.com/drive/v3/files");
  driveUrl.searchParams.set("q", q);
  driveUrl.searchParams.set("pageSize", "50");
  driveUrl.searchParams.set("fields", "nextPageToken, files(id, name, mimeType, size, iconLink, thumbnailLink)");
  if (pageToken) {
    driveUrl.searchParams.set("pageToken", pageToken);
  }

  const response = await fetch(driveUrl.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to list Google Drive files");
  }

  return response.json();
}

export async function downloadDriveFile(accessToken, fileId) {
  // 1. Get file metadata (name & mimeType)
  const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType`;
  const metaResponse = await fetch(metaUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!metaResponse.ok) {
    const errText = await metaResponse.text();
    throw new Error("Failed to fetch file metadata: " + errText);
  }

  const { name, mimeType } = await metaResponse.json();

  // 2. Fetch the file media content from Google Drive
  const mediaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const mediaResponse = await fetch(mediaUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!mediaResponse.ok) {
    const errText = await mediaResponse.text();
    throw new Error("Failed to download file content: " + errText);
  }

  return {
    name,
    mimeType,
    body: mediaResponse.body,
  };
}
