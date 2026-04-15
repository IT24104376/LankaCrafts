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
export function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: 'Inter, sans-serif'
      }}>

      <Navbar />
      <Hero />
      <CraftCategories />
      <HowItWorks />
      <LatestBlogs />
      <FeaturedArtist />
      <MapTeaser />
      <JoinCTA />
      <Footer />
    </div>);

}