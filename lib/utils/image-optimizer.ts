export async function optimizeImage(file: File, maxWidth = 1920, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new window.Image()

      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Nie udało się utworzyć kontekstu canvas"))
          return
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Nie udało się skompresować obrazu"))
              return
            }

            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })

            resolve(optimizedFile)
          },
          file.type,
          quality,
        )
      }

      img.onerror = () => reject(new Error("Nie udało się załadować obrazu"))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error("Nie udało się odczytać pliku"))
    reader.readAsDataURL(file)
  })
}
