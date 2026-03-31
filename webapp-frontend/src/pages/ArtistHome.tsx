import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { CraftCategories } from '../components/CraftCategories';
import { HowItWorks } from '../components/HowItWorks';
import { LatestBlogs } from '../components/LatestBlogs';
import { FeaturedArtist } from '../components/FeaturedArtist';
import { MapTeaser } from '../components/MapTeaser';
import { JoinCTA } from '../components/JoinCTA';
import { Footer } from '../components/Footer';

/**
 * Home page shown when an Artist clicks "Home" in their dashboard navbar.
 * Same content as the public Home but wrapped inside the artist-mode Navbar
 * so the authenticated nav links (Dashboard, etc.) remain visible.
 */
export function ArtistHome() {
    return (
        <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* artistMode=true keeps the Dashboard link in the navbar */}
            <Navbar artistMode />
            <Hero />
            <CraftCategories />
            <HowItWorks />
            <LatestBlogs />
            <FeaturedArtist />
            <MapTeaser />
            <JoinCTA />
            <Footer />
        </div>
    );
}
