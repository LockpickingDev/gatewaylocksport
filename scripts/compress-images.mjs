import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const publicDir = path.join(root, 'public')

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap(e =>
    e.isDirectory()
      ? walk(path.join(dir, e.name))
      : [path.join(dir, e.name)]
  )
}

const EXTS = new Set(['.jpg', '.jpeg', '.png'])

const files = walk(publicDir).filter(f => EXTS.has(path.extname(f).toLowerCase()))

let totalBefore = 0
let totalAfter = 0

for (const file of files) {
  const before = fs.statSync(file).size
  const ext = path.extname(file).toLowerCase()
  const tmp = file + '.tmp'

  try {
    const img = sharp(file).rotate()
    if (ext === '.png') {
      await img.png({ compressionLevel: 9, effort: 10 }).toFile(tmp)
    } else {
      await img.jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(tmp)
    }

    const after = fs.statSync(tmp).size

    if (after < before) {
      fs.renameSync(tmp, file)
      const saved = ((before - after) / before * 100).toFixed(1)
      const beforeKb = (before / 1024).toFixed(0)
      const afterKb = (after / 1024).toFixed(0)
      console.log(`  ✓ ${path.relative(publicDir, file).padEnd(70)} ${beforeKb}KB → ${afterKb}KB  (-${saved}%)`)
      totalBefore += before
      totalAfter += after
    } else {
      fs.unlinkSync(tmp)
      console.log(`  – ${path.relative(publicDir, file)} (already optimal)`)
      totalBefore += before
      totalAfter += before
    }
  } catch (err) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
    console.log(`  ✗ ${path.relative(publicDir, file)} (skipped: ${err.message})`)
    totalBefore += before
    totalAfter += before
  }
}

const totalSavedMb = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)
const totalPct = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1)
console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(2)}MB → ${(totalAfter/1024/1024).toFixed(2)}MB  saved ${totalSavedMb}MB (${totalPct}%)`)
