import { useState } from 'react'
import Dropzone from '../../components/Dropzone.jsx'
import Progress from '../../components/Progress.jsx'
import Note from '../../components/Note.jsx'
import Icon from '../../components/Icon.jsx'
import ResultGallery from '../../components/ResultGallery.jsx'
import { useJob } from '../../hooks/useJob.js'
import { formatBytes } from '../../lib/format.js'
import { pdfToImages } from './helpers.js'

export default function PdfToImages() {
  const [file, setFile] = useState(null)
  const [format, setFormat] = useState('png')
  const [scale, setScale] = useState(2)
  const [range, setRange] = useState('')
  const { running, progress, error, result, run, reset } = useJob()

  const pick = (files) => {
    setFile(files[0])
    reset()
  }

  const convert = () =>
    run((onProgress) => pdfToImages(file, { format, scale: Number(scale), range }, onProgress))

  return (
    <div className="space-y-6">
      <Dropzone onFiles={pick} accept="application/pdf,.pdf" multiple={false} label="Drop a PDF here or click to browse" hint="One PDF at a time" icon="fileText" />

      {file && (
        <>
          <div className="card flex items-center gap-3 p-3">
            <Icon name="fileText" className="h-5 w-5 text-brand-600" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-slate-400">{formatBytes(file.size)}</span>
          </div>

          <div className="card p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-1">
                <span className="field-label">Format</span>
                <select className="field-input" value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="png">PNG (lossless)</option>
                  <option value="jpeg">JPEG (smaller)</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="field-label">Quality / DPI</span>
                <select className="field-input" value={scale} onChange={(e) => setScale(e.target.value)}>
                  <option value={1}>Screen (72 dpi)</option>
                  <option value={2}>High (144 dpi)</option>
                  <option value={3}>Print (216 dpi)</option>
                  <option value={4}>Max (288 dpi)</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="field-label">Pages (optional)</span>
                <input className="field-input" placeholder="e.g. 1-3,5" value={range} onChange={(e) => setRange(e.target.value)} />
              </label>
            </div>
          </div>

          <button type="button" className="btn-primary" onClick={convert} disabled={running}>
            <Icon name="image" className="h-4 w-4" />
            Convert to images
          </button>
        </>
      )}

      {running && progress && <Progress value={progress.value} message={progress.message} />}
      {error && <Note type="error" title="Couldn’t convert this PDF">{error}</Note>}
      {result && !running && <ResultGallery results={result} zipName={`${file?.name?.replace(/\.pdf$/i, '') || 'pages'}-images.zip`} />}
    </div>
  )
}
