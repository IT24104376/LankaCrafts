import React from 'react';
import { Link } from 'react-router-dom';
export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#1A1A1A'
      }}>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 4 C10 4 6 10 6 16 C6 22 10 28 16 28 C22 28 26 22 26 16 C26 10 22 4 16 4Z"
                  fill="rgba(255,255,255,0.3)" />

                <path
                  d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z"
                  fill="#C9A227" />

              </svg>
              <span
                className="text-white text-lg font-bold"
                style={{
                  fontFamily: 'Fraunces, serif'
                }}>

                Lanka Crafts
              </span>
            </div>
            <p
              className="text-white/70 text-sm leading-relaxed"
              style={{
                fontFamily: 'Inter, sans-serif'
              }}>

              Celebrating the living heritage of Sri Lankan artisanship — one
              craft at a time.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4
              className="text-white font-bold mb-4 text-sm tracking-widest uppercase"
              style={{
                fontFamily: 'Inter, sans-serif'
              }}>

              Explore
            </h4>
            <ul className="space-y-2">
              {[
              {
                name: 'Craft Traditions',
                path: '/browse'
              },
              {
                name: 'Meet Artisans',
                path: '/browse'
              },
              {
                name: 'Workshops',
                path: '/map'
              },
              {
                name: 'Mobile App',
                path: '/mobile'
              }].
              map((item) =>
              <li key={item.name}>
                  <Link
                  to={item.path}
                  className="text-white/65 hover:text-white text-sm transition-colors"
                  style={{
                    fontFamily: 'Inter, sans-serif'
                  }}>

                    {item.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h4
              className="text-white font-bold mb-4 text-sm tracking-widest uppercase"
              style={{
                fontFamily: 'Inter, sans-serif'
              }}>

              Regions
            </h4>
            <ul className="space-y-2">
              {['Kandy', 'Galle', 'Colombo', 'Jaffna', 'Ratnapura'].map(
                (item) =>
                <li key={item}>
                    <Link
                    to="/browse"
                    className="text-white/65 hover:text-white text-sm transition-colors"
                    style={{
                      fontFamily: 'Inter, sans-serif'
                    }}>

                      {item}
                    </Link>
                  </li>

              )}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4
              className="text-white font-bold mb-4 text-sm tracking-widest uppercase"
              style={{
                fontFamily: 'Inter, sans-serif'
              }}>

              Connect
            </h4>
            <div className="flex gap-3 mb-6">
              {['Instagram', 'Facebook', 'Twitter'].map((social) =>
              <a
                key={social}
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)'
                }}
                title={social}>

                  <span className="text-white text-xs font-bold">
                    {social[0]}
                  </span>
                </a>
              )}
            </div>
            <p
              className="text-white/60 text-xs"
              style={{
                fontFamily: 'Inter, sans-serif'
              }}>

              Sri Lanka Tourism Development Authority
              <br />
              No. 80, Galle Road, Colombo 03
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>

          <p
            className="text-white/50 text-sm"
            style={{
              fontFamily: 'Inter, sans-serif'
            }}>

            © {new Date().getFullYear()} Lanka Crafts Tourism Board. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Contact'].map((item) =>
            <a
              key={item}
              href="#"
              className="text-white/50 hover:text-white text-sm transition-colors"
              style={{
                fontFamily: 'Inter, sans-serif'
              }}>

                {item}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>);

}