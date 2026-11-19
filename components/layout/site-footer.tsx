import { profile } from '@/content/profile';

export const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col gap-4 border-t border-border py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <p>
        © {year} {profile.name}
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        <li>
          <a
            href={`mailto:${profile.email}`}
            className="focus-ring rounded hover:text-fg"
          >
            Email
          </a>
        </li>
        <li>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="focus-ring rounded hover:text-fg"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="focus-ring rounded hover:text-fg"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href={profile.resumeUrl}
            className="focus-ring rounded hover:text-fg"
          >
            Resume (PDF)
          </a>
        </li>
      </ul>
    </footer>
  );
};
