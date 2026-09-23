import { assetUrl } from '../lib/content'
import type { SiteContent } from '../types'

type TeamProps = {
  team: SiteContent['team']
}

export function Team({ team }: TeamProps) {
  return (
    <section id="equipo" className="team">
      <div className="wrap">
        <p className="eyebrow">{team.eyebrow}</p>
        <h2 className="display section-title">{team.title}</h2>
        <hr className="rule" />
        <div className="team-grid">
          {team.members.map((member) => (
            <article className="member" key={member.name}>
              <img src={assetUrl(member.image)} alt={member.name} width={900} height={1120} />
              <p className="role">{member.role}</p>
              <h3 className="display member-name">{member.name}</h3>
              <p className="member-bio">{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
