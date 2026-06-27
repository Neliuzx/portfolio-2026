import '../App.css'

function Controls() {
  return (
    <div className="controls">
      <span>Press <kbd className="key">R</kbd> to rotate the cube</span>
      <span>Press <kbd className="key">↑</kbd> to move up</span>
      <span>Press <kbd className="key">↓</kbd> to move down</span>
      <span>Press <kbd className="key">←</kbd> to move left</span>
      <span>Press <kbd className="key">→</kbd> to move right</span>
    </div>
  )
}

export default Controls