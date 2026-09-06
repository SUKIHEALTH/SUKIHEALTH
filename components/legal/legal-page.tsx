import type React from "react"

type LegalPageProps = {
  title: string
  intro: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalPage({ title, intro, lastUpdated, children }: LegalPageProps) {
  return (
    <main className="bg-background">
      <section className="border-b bg-gray-50">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-16 max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 text-balance">{title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">{intro}</p>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      </section>
      <article className="container mx-auto flex flex-col gap-10 px-4 py-12 max-w-3xl">{children}</article>
    </main>
  )
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="flex flex-col gap-3 scroll-mt-24">
      <h2 id={`${id}-heading`} className="text-2xl font-semibold text-gray-900">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-base leading-relaxed text-gray-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-1 [&_a]:text-teal-700 [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
    </section>
  )
}
