import React from 'react';
import { TouristNavbar } from './TouristNavbar';
import { Hero } from '../../components/Hero';
import { CraftCategories } from '../../components/CraftCategories';
import { HowItWorks } from '../../components/HowItWorks';
//import { LatestBlogs } from '../../components/LatestBlogs';
import { FeaturedArtist } from '../../components/FeaturedArtist';
import { MapTeaser } from '../../components/MapTeaser';
import { JoinCTA } from '../../components/JoinCTA';
import { Footer } from '../../components/Footer';

/*
 * Home page shown when a Tourist clicks "Home" in their navbar.
 * Same content as the public Home but wrapped inside TouristNavbar
 * so the authenticated nav is preserved.
 */
export function TouristHome() {
    return (
        <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
            <TouristNavbar activeTab="home" />
            {/* Offset for fixed navbar */}
            <div className="pt-16">
                <Hero />
                <CraftCategories />
                <HowItWorks />
                {/* <LatestBlogs /> */}
                <FeaturedArtist />
                <MapTeaser />
                <JoinCTA />
                <Footer />
            </div>
        </div>
    );
}
