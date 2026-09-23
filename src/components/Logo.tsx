type LogoProps = {
  name: string
}

export function Logo({ name }: LogoProps) {
  const [first, ...rest] = name.split(' ')

  return (
    <span className="logo">
      <span className="logo-dot" aria-hidden="true" />
      <span className="logo-name">{first}</span>
      {rest.length > 0 && <span className="logo-suffix">{rest.join(' ')}</span>}
    </span>
  )
}
