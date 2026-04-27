import fs from 'node:fs/promises';

function stripGeneratedAt(value) {
  if (Array.isArray(value)) {
    return value.map(stripGeneratedAt);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'generatedAt')
        .map(([key, entryValue]) => [key, stripGeneratedAt(entryValue)]),
    );
  }

  return value;
}

export async function writeStableJsonArtifact(filePath, artifact) {
  const nextContent = `${JSON.stringify(artifact, null, 2)}\n`;

  try {
    const existingRaw = await fs.readFile(filePath, 'utf8');
    const existingJson = JSON.parse(existingRaw);
    const nextJson = JSON.parse(nextContent);

    if (
      JSON.stringify(stripGeneratedAt(existingJson)) ===
      JSON.stringify(stripGeneratedAt(nextJson))
    ) {
      return false;
    }
  } catch {
    // Missing or invalid existing file falls through to normal write.
  }

  await fs.writeFile(filePath, nextContent, 'utf8');
  return true;
}
