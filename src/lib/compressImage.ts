export async function compressImage(file: File, quality = 0.82, maxDimension = 1920): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)

      let { naturalWidth: w, naturalHeight: h } = img
      if (w > maxDimension || h > maxDimension) {
        if (w > h) { h = Math.round(h * maxDimension / w); w = maxDimension }
        else       { w = Math.round(w * maxDimension / h); h = maxDimension }
      }

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)

      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('Compression failed')); return }
        const name = file.name.replace(/\.[^.]+$/, '.jpg')
        const compressed = new File([blob], name, { type: 'image/jpeg' })
        resolve(compressed.size < file.size ? compressed : file)
      }, 'image/jpeg', quality)
    }
    img.onerror = reject
    img.src = url
  })
}
