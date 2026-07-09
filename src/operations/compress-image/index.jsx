import { useState } from 'react'
import Dropzone from '../../components/Dropzone.jsx'
import Progress from '../../components/Progress.jsx'
import Note from '../../components/Note.jsx'
import Icon from '../../components/Icon.jsx'
import ImageResult from '../../components/ImageResult.jsx'
import { useJob } from '../../hooks/useJob.js'
import { formatBytes } from '../../lib/format.js'
import { compressImage } from './helpers.js'

export default function CompressImage() {
  const [file, setFile] = useState(null)
  const [quality, setQuality] = useState(0.7)
  const [maxDimension, setMaxDimension] = useState(0)
  const [format, setFormat] = useState('keep')
  const { running, progress, error, result, run, reset } = useJob()

  const pick = (files) => {
    setFile(files[0])
    reset()
  }
  const go = () => run((p) => compressImage(file, { quality: Number(quality), maxDimension: Number(maxDimension), format }, p))

  return (
    <div className="space-y-6">
      <Dropzone onFiles={pick} accept="image/*" multiple={false} label="Drop an image here or click to browse" hint="JPEG, PNG, or WebP" icon="image" />

      {file && (
        <>
          <div className="card flex items-center gap-3 p-3">
            <Icon name="image" className="h-5 w-5 text-brand-600" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-slate-400">{formatBytes(file.size)}</span>
          </div>

          <div className="card p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-1">
                <span className="field-label">Quality: {Math.round(quality * 100)}%</span>
                <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full accent-brand-600" />
              </label>
              <label className="space-y-1">
                <span className="field-label">Max width/height</span>
                <select className="field-input" value={maxDimension} onChange={(e) => setMaxDimension(e.target.value)}>
                  <option value={0}>Keep original</option>
                  <option value={3840}>3840 px</option>
                  <option value={1920}>1920 px</option>
                  <option value={1280}>1280 px</option>
                  <option value={800}>800 px</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="field-label">Output format</span>
                <select className="field-input" value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="keep">Keep original</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                  <option value="png">PNG</option>
                </select>
              </label>
            </div>
            <Note type="info" className="mt-4">
              PNG is lossless, so the quality slider won’t shrink it — convert to JPEG or WebP for big savings on photos.
            </Note>
          </div>

          <button type="button" className="btn-primary" onClick={go} disabled={running}>
            <Icon name="compress" className="h-4 w-4" />
            Compress
          </button>
        </>
      )}

      {running && progress && <Progress value={progress.value} message={progress.message} />}
      {error && <Note type="error" title="Compression failed">{error}</Note>}
      {result && !running && <ImageResult result={result} />}
    </div>
  )
}
