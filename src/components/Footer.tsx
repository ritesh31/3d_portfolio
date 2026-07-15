import { Link } from "react-router-dom";

import { useTable } from "../hooks/useTable";
import { useProfile } from "../hooks/useProfile";
import { SocialLinkRow } from "../types";

function Footer() {
  const { data: socialLinks, loading } = useTable<SocialLinkRow>("social_links");
  const { profile } = useProfile();

  if (loading || socialLinks.length === 0) return null;

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} {profile?.name ?? ""}. All rights reserved.
        </p>

        <div className="flex gap-6">
          {socialLinks
            .filter((social) => social.icon_url)
            .map((social) =>
              social.link.startsWith("/") ? (
                <Link key={social.id} to={social.link} title={social.name}>
                  <img
                    src={social.icon_url as string}
                    alt={social.name}
                    className="w-6 h-6 object-contain"
                  />
                </Link>
              ) : (
                <a
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                >
                  <img
                    src={social.icon_url as string}
                    alt={social.name}
                    className="w-6 h-6 object-contain"
                  />
                </a>
              )
            )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
