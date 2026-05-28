type Props = {
  title: string
  description?: string
}

/**
 * Per-page <title> and <meta> tags. Relies on React 19's native support for
 * hoisting <title>, <meta>, and <link> elements out of the component tree
 * into <head> — no helmet provider, no extra dependency.
 *
 * Site-wide defaults (e.g. the noindex robots meta during pre-launch) live
 * in index.html. PageHead overrides on a per-page basis.
 */
export function PageHead({ title, description }: Props) {
  return (
    <>
      <title>{`${title} | Crayhill Capital Management`}</title>
      {description ? <meta name="description" content={description} /> : null}
    </>
  )
}
