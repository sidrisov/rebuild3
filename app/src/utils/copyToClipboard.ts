export function copyToClipboard(content: string) {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(content);
  }
}
