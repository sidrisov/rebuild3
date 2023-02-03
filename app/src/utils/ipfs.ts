import Moralis from 'moralis';

async function base64Content(file: File) {
  return new Promise<string | undefined>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString());
    reader.onerror = (error) => reject(error);
  });
}

export async function uploadToIpfs(file: File) {
  const fileContent = await base64Content(file);

  if (fileContent) {
    const response = await Moralis.EvmApi.ipfs.uploadFolder({
      abi: [
        {
          path: file.name,
          content: fileContent
        }
      ]
    });
    return response.toJSON();
  }
}
