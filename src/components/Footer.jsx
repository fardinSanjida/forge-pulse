import { LogoFacebook, LogoLinkedin, Xmark } from "@gravity-ui/icons";
import Image from "next/image";
import Link from "next/link";
import footerBackground from "../../asset/footer-background.jpg";
import logo from "../../asset/logo.png";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Classes", href: "/classes" },
  { label: "Community Forum", href: "/community" },
  { label: "Dashboard", href: "/dashboard" },
];

const socialLinks = [
  {
    label: "X",
    href: "https://x.com",
    icon: Xmark,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: LogoFacebook,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: LogoLinkedin,
  },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t-9 border-orange-300 rounded-2xl bg-neutral-950 text-white">
      <Image
        src={footerBackground}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-15"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-[1.3fr_0.7fr] lg:grid-cols-[1.3fr_0.8fr_0.9fr_1fr] lg:px-8">
        <section className="space-y-4">
          <Link href="/" className="inline-flex items-center" aria-label="Forge Pulse home">
            <span className="relative flex h-25 w-60 overflow-hidden rounded-full">
              <Image src={logo} alt="Forge Pulse logo" sizes="200px" className="object-contain object-left" />
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-6 text-white/65">
            Forge Pulse helps learners discover practical classes, connect with instructors, and keep momentum in one learning community.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
            Quick Links
          </h2>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition hover:text-orange-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
            Follow Us
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Forge Pulse on ${social.label}`}
                  title={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/75 transition hover:border-orange-300/60 hover:bg-orange-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </section>

        <address className="not-italic">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>123 Learning Avenue, Dhaka 1205</p>
            <p>
              <a className="transition hover:text-orange-300" href="mailto:hello@forgepulse.com">
                hello@forgepulse.com
              </a>
            </p>
            <p>
              <a className="transition hover:text-orange-300" href="tel:+8801700000000">
                +880 1700-000000
              </a>
            </p>
          </div>
        </address>
      </div>

      <div className="relative z-10 border-t border-white/10 px-4 py-5 text-center text-sm text-white/55 sm:px-6 lg:px-8">
        <p>Copyright {new Date().getFullYear()} Forge Pulse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
