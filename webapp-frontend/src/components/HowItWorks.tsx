import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Heart, UserPlus, PenTool, Users } from 'lucide-react';
const touristSteps = [
{
  icon: <Search className="w-6 h-6" />,
  title: 'Browse Workshops',
  description: 'Explore authentic crafts by region or type.'
},
{
  icon: <Calendar className="w-6 h-6" />,
  title: 'Book a Slot',
  description: 'Reserve your time directly with the artisan.'
},
{
  icon: <Heart className="w-6 h-6" />,
  title: 'Experience',
  description: 'Learn the craft and take home your creation.'
}];

const artistSteps = [
{
  icon: <UserPlus className="w-6 h-6" />,
  title: 'Register',
  description: 'Join our community of verified artisans.'
},
{
  icon: <PenTool className="w-6 h-6" />,
  title: 'Build Profile',
  description: 'Showcase your work and workshop details.'
},
{
  icon: <Users className="w-6 h-6" />,
  title: 'Connect',
  description: 'Welcome travelers from around the world.'
}];

export function HowItWorks() {
  return (
    <section
      className="py-24 px-6"
      style={{
        backgroundColor: '#2F5D50'
      }}>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(201,162,39,0.15)',
              color: '#C9A227'
            }}>

            Simple Process
          </span>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{
              fontFamily: 'Fraunces, serif'
            }}>

            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Tourist Flow */}
          <div>
            <h3
              className="text-2xl font-bold text-white mb-8 flex items-center gap-3"
              style={{
                fontFamily: 'Fraunces, serif'
              }}>

              <span className="w-8 h-8 rounded-full bg-mustard text-forest flex items-center justify-center text-sm">
                T
              </span>
              For Travelers
            </h3>
            <div className="space-y-6">
              {touristSteps.map((step, i) =>
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                whileInView={{
                  opacity: 1,
                  x: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: i * 0.1
                }}
                className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10 relative">

                  {i < touristSteps.length - 1 &&
                <div className="absolute left-[2.65rem] top-16 bottom-[-1.5rem] w-0.5 bg-white/10 border-l border-dashed border-white/30" />
                }
                  <div className="w-12 h-12 rounded-full bg-mustard flex items-center justify-center shrink-0 text-forest z-10">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      {step.title}
                    </h4>
                    <p className="text-white/70 text-sm">{step.description}</p>
                  </div>
                  <div className="ml-auto text-4xl font-black text-white/5 font-display">
                    0{i + 1}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Artist Flow */}
          <div>
            <h3
              className="text-2xl font-bold text-white mb-8 flex items-center gap-3"
              style={{
                fontFamily: 'Fraunces, serif'
              }}>

              <span className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center text-sm">
                A
              </span>
              For Artisans
            </h3>
            <div className="space-y-6">
              {artistSteps.map((step, i) =>
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: 20
                }}
                whileInView={{
                  opacity: 1,
                  x: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: i * 0.1
                }}
                className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10 relative">

                  {i < artistSteps.length - 1 &&
                <div className="absolute left-[2.65rem] top-16 bottom-[-1.5rem] w-0.5 bg-white/10 border-l border-dashed border-white/30" />
                }
                  <div className="w-12 h-12 rounded-full bg-terracotta flex items-center justify-center shrink-0 text-white z-10">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      {step.title}
                    </h4>
                    <p className="text-white/70 text-sm">{step.description}</p>
                  </div>
                  <div className="ml-auto text-4xl font-black text-white/5 font-display">
                    0{i + 1}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}