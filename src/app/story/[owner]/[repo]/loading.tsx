export default function StoryLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0e1a" }}>
      {/* Nav skeleton */}
      <nav
        className="border-b px-6 py-4"
        style={{
          backgroundColor: "rgba(10,14,26,0.8)",
          borderColor: "rgba(148,163,184,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div
            className="h-4 w-20 rounded animate-pulse"
            style={{ background: "rgba(30,41,59,0.8)" }}
          />
          <div
            className="h-4 w-4 rounded animate-pulse"
            style={{ background: "rgba(30,41,59,0.8)" }}
          />
          <div
            className="h-4 w-36 rounded animate-pulse"
            style={{ background: "rgba(30,41,59,0.8)" }}
          />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-pulse">
        {/* Repo Header skeleton */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "rgba(15,22,41,0.8)",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div
                className="h-4 w-28 rounded-full"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
              <div
                className="h-8 w-64 rounded"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
              <div
                className="h-4 w-96 rounded"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
            </div>
            <div
              className="h-9 w-28 rounded-xl shrink-0"
              style={{ background: "rgba(30,41,59,0.8)" }}
            />
          </div>
          <div className="flex gap-3">
            <div
              className="h-6 w-24 rounded-full"
              style={{ background: "rgba(30,41,59,0.8)" }}
            />
            <div
              className="h-6 w-20 rounded-full"
              style={{ background: "rgba(30,41,59,0.8)" }}
            />
            <div
              className="h-6 w-20 rounded-full"
              style={{ background: "rgba(30,41,59,0.8)" }}
            />
          </div>
        </div>

        {/* Stats Grid skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 space-y-3"
              style={{
                background: "rgba(15,22,41,0.8)",
                border: "1px solid rgba(148,163,184,0.1)",
              }}
            >
              <div
                className="h-3 w-24 rounded"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
              <div
                className="h-9 w-16 rounded"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
            </div>
          ))}
        </div>

        {/* Wide stats bar skeleton */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(15,22,41,0.8)",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex gap-8">
            <div className="space-y-2 flex-1">
              <div
                className="h-3 w-24 rounded"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
              <div
                className="h-5 w-36 rounded"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
            </div>
            <div className="space-y-2 flex-1">
              <div
                className="h-3 w-24 rounded"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
              <div
                className="h-5 w-20 rounded"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
            </div>
          </div>
        </div>

        {/* Timeline skeleton */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "rgba(15,22,41,0.8)",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            <div
              className="h-5 w-40 rounded"
              style={{ background: "rgba(30,41,59,0.8)" }}
            />
            <div
              className="h-4 w-52 rounded"
              style={{ background: "rgba(30,41,59,0.8)" }}
            />
          </div>
          <div
            className="h-40 w-full rounded-xl"
            style={{ background: "rgba(30,41,59,0.8)" }}
          />
        </div>

        {/* Commit list skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4 flex gap-4"
              style={{
                background: "rgba(15,22,41,0.8)",
                border: "1px solid rgba(148,163,184,0.1)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full shrink-0"
                style={{ background: "rgba(30,41,59,0.8)" }}
              />
              <div className="flex-1 space-y-2 py-1">
                <div
                  className="h-4 w-3/4 rounded"
                  style={{ background: "rgba(30,41,59,0.8)" }}
                />
                <div
                  className="h-3 w-1/2 rounded"
                  style={{ background: "rgba(30,41,59,0.8)" }}
                />
                <div
                  className="h-3 w-20 rounded"
                  style={{ background: "rgba(30,41,59,0.8)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
