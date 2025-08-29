import React from "react"

type Props = {
  minWidth?: number
  allowDismiss?: boolean
}

export const OrientationGuard: React.FC<Props> = ({ minWidth = 600, allowDismiss = true }) => {
  const [show, setShow] = React.useState(false)
  const [dismissed, setDismissed] = React.useState(false)

  React.useEffect(() => {
    const mqPortrait = window.matchMedia("(orientation: portrait)")
    const check = () => {
      const isPortrait = mqPortrait.matches
      const isNarrow = window.innerWidth < minWidth
      setShow(isPortrait && isNarrow && !dismissed)
    }
    check()
    const onResize = () => check()
    mqPortrait.addEventListener?.("change", check)
    window.addEventListener("resize", onResize)
    return () => {
      mqPortrait.removeEventListener?.("change", check)
      window.removeEventListener("resize", onResize)
    }
  }, [minWidth, dismissed])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[60] bg-accent-900/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-surface border border-border/60 shadow-strong rounded-2xl p-5 text-center space-y-3">
        <div className="mx-auto w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <div className="w-5 h-3 border-2 border-primary rounded-md rotate-90" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Rotate your screen</h2>
        <p className="text-sm text-muted-foreground">
See the whole timeline and stay ahead in the game – rotate your screen to landscape mode.
        </p>

        <div className="flex gap-3 justify-center pt-2">
          {allowDismiss && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-muted"
            >
              Nope!
            </button>
          )}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-3 py-2 text-sm rounded-lg bg-primary text-base-100 hover:brightness-110"
          >
            Yay!
          </button>
        </div>
      </div>
    </div>
  )
}
